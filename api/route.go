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
		Secret:       NewSecretCode(),
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
		From:    os.Getenv("EMAIL_FROM"),
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
