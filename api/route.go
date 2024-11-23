package main

import (
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

func GenerateQrTicket(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "content query parameter is required"})
		return
	}
	png, err := qrcode.Encode(id, qrcode.Medium, 512)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate QR code"})
		return
	}
	c.Data(http.StatusOK, "image/png", png)
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

func GetTicket(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var ticket Ticket
	GetDb().Where("secret = ?", id).First(&ticket)
	if ticket.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ticket not found.",
		})
		return
	}
	var attendee Attendee
	GetDb().First(&attendee, "id = ?", ticket.AttendeeID)
	if attendee.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{})
	}
	c.JSON(http.StatusOK, gin.H{
		"name":         attendee.Name,
		"email":        attendee.Email,
		"birthday":     attendee.Birthday,
		"experience":   attendee.Experience,
		"jobTitle":     attendee.JobTitle,
		"companyEmail": attendee.CompanyEmail,
		"linkedIn":     attendee.LinkedIn,
		"used":         ticket.Used,
	})
}

func CheckInEvent(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{})
		return
	}
	var ticket Ticket
	GetDb().Where("secret = ?", id).First(&ticket)
	if ticket.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Ticket not found.",
		})
		return
	}
	if !ticket.Used.IsZero() {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Already checked in.",
		})
		return
	}
	ticket.Used = time.Now()
	GetDb().Save(&ticket)
	c.JSON(http.StatusOK, gin.H{
		"message": "Check-in successfully.",
	})
}
