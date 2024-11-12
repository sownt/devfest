package main

import (
	"encoding/base64"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/skip2/go-qrcode"
	"net/http"
	"os"
	"time"
)

func Ping(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

func GenerateQr(c *gin.Context) {
	content := c.Query("content")
	var png []byte
	png, _ = qrcode.Encode(content, qrcode.Medium, 512)
	imgBase64Str := base64.StdEncoding.EncodeToString(png)
	c.JSON(http.StatusOK, gin.H{
		"image": imgBase64Str,
	})
}

func CheckEmail(c *gin.Context) {
	email := c.PostForm("email")
	var attendee Attendee
	GetDb().First(&attendee, "email = ?", email)
	c.JSON(http.StatusOK, gin.H{
		"used": attendee.ID != 0,
	})
}

func Attend(c *gin.Context) {
	var attendeeForm AttendeeForm
	err := c.ShouldBind(&attendeeForm)
	if err != nil {
		var validationErrs validator.ValidationErrors
		if errors.As(err, &validationErrs) {
			errs := make(map[string]string)
			for _, e := range validationErrs {
				errs[e.Field()] = GetErrorMessage(e)
			}
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Validation failed",
				"errors":  errs,
			})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form submission"})
		return
	}
	var att Attendee
	GetDb().First(&att, "email = ?", attendeeForm.Email)
	if att.ID != 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Email is already taken",
		})
		return
	}
	attendee := Attendee{
		Name:         attendeeForm.Name,
		Birthday:     attendeeForm.Birthday,
		Gender:       attendeeForm.Gender,
		Email:        attendeeForm.Email,
		Phone:        attendeeForm.Phone,
		Sessions:     attendeeForm.Sessions,
		Experience:   attendeeForm.Experience,
		JobTitle:     attendeeForm.JobTitle,
		CompanyEmail: attendeeForm.CompanyEmail,
		LinkedIn:     attendeeForm.LinkedIn,
		Question:     attendeeForm.Question,
		Secret:       NewSecretCode(6),
	}
	var et EmailTemplate
	GetDb().First(&et, "name = ?", "new_account_email")
	if et.ID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{})
	}
	body, err := ParseEmailBody(attendee, et.Body)
	if err != nil {
		fmt.Println(err.Error())
	}
	email := Email{
		From:    et.From,
		To:      attendee.Email,
		Subject: et.Subject,
		Body:    body,
	}
	output, err := SendEmail(c.Request.Context(), email)
	if err != nil {
		email.Status = false
		email.Error = err.Error()
	} else {
		email.Status = true
		email.MessageId = *output.MessageId
	}
	id := GetDb().Create(&attendee)
	if id.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	id = GetDb().Create(&email)
	if id.Error != nil {
		fmt.Println(id.Error.Error())
	}
	c.JSON(http.StatusOK, gin.H{})
}

func Login(c *gin.Context) {
	accessToken, existed := c.GetPostForm("access_token")
	if !existed {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{})
		return
	}
	session, err := VerifyToken(c, accessToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{})
		return
	}
	c.SetCookie("session", session, int(UserSessionExpiresIn.Seconds()), "/", os.Getenv("BASE_URL"), false, false)
	c.JSON(http.StatusOK, gin.H{})
}

func Logout(c *gin.Context) {
	cookie, _ := c.Cookie("session")
	err := RevokeSessionCookie(c, cookie)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	c.SetCookie("session", "", -1, "/", os.Getenv("BASE_URL"), false, false)
}

func CreateTicket(c *gin.Context) {
	id, ext := c.Get("attendeeId")
	if !ext {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	eventId, ext := c.Get("eventId")
	if !ext {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	var attendee Attendee
	GetDb().Where("id = ?", id).First(&attendee)
	if attendee.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Attendee not found.",
		})
	}
	var event Event
	GetDb().Where("id = ?", eventId).First(&event)
	if event.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	checkin := Ticket{
		Attendee: attendee,
		Event:    event,
	}
	GetDb().Create(&checkin)
	c.JSON(http.StatusOK, checkin)
}

func GetTicketDetail(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	var checkin Ticket
	GetDb().Where("secret = ?", id).First(&checkin)
	if checkin.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ticket not found.",
		})
	}
	c.JSON(http.StatusOK, checkin)
}

func CheckInEvent(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var checkin Ticket
	GetDb().Where("secret = ?", id).First(&checkin)
	if checkin.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ticket not found.",
		})
		return
	}
	if !checkin.Used.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Already checked in.",
		})
		return
	}
	checkin.Used = time.Now()
	GetDb().Save(&checkin)
	c.JSON(http.StatusOK, gin.H{
		"message": "Check-in successfully.",
	})
}

func GetAttendees(c *gin.Context) {
	var attendees []Attendee
	var total int64
	var pagination Pagination

	if err := c.ShouldBindQuery(&pagination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid pagination parameters"})
		return
	}
	if pagination.Page <= 0 {
		pagination.Page = 1
	}
	if pagination.PageSize <= 0 {
		pagination.PageSize = 10
	}

	GetDb().Model(&Attendee{}).Count(&total)
	offset := (pagination.Page - 1) * pagination.PageSize
	if err := db.Limit(pagination.PageSize).Offset(offset).Find(&attendees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve attendees"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": attendees,
		"meta": gin.H{
			"total":    total,
			"page":     pagination.Page,
			"pageSize": pagination.PageSize,
		},
	})
}

// Statistics

func Summary(c *gin.Context) {
	type Summary struct {
		Date             string `json:"date"`
		Count            int    `json:"count"`
		AccumulatedCount int    `json:"accumulated_count"`
	}
	var results []Summary

	GetDb().Raw(`
		WITH date_series AS (
			SELECT generate_series(
				NOW()::date - INTERVAL '14 days', 
				NOW()::date, 
				'1 day'::interval
			) AS date
		)
		SELECT 
			date_series.date, 
			COALESCE(COUNT(a.id), 0) as count,
			SUM(COALESCE(COUNT(a.id), 0)) OVER (ORDER BY date_series.date) AS accumulated_count
		FROM date_series
		LEFT JOIN attendees a ON DATE(a.created_at) = date_series.date
		GROUP BY date_series.date
		ORDER BY date_series.date ASC
	`).Scan(&results)

	c.JSON(http.StatusOK, results)
}

func Gender(c *gin.Context) {
	type GenderCount struct {
		Gender string `json:"gender"`
		Count  int    `json:"count"`
	}
	var results []GenderCount

	GetDb().Model(&Attendee{}).
		Select("gender, COUNT(*) as count").
		Group("gender").
		Order("COUNT(*) asc").
		Find(&results)

	c.JSON(http.StatusOK, results)
}

func Birthday(c *gin.Context) {
	type BirthdayCount struct {
		Birthday string `json:"birthday"`
		Count    int    `json:"count"`
	}
	var results []BirthdayCount

	GetDb().Model(&Attendee{}).
		Select("birthday, COUNT(*) as count").
		Group("birthday").
		Order("birthday asc").
		Find(&results)

	c.JSON(http.StatusOK, results)
}

func Experience(c *gin.Context) {
	type ExperienceCount struct {
		Experience string `json:"experience"`
		Count      int    `json:"count"`
	}
	var results []ExperienceCount

	GetDb().Model(&Attendee{}).
		Select("experience, COUNT(*) as count").
		Group("experience").
		Order("experience asc").
		Find(&results)

	c.JSON(http.StatusOK, results)
}
