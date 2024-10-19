package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/skip2/go-qrcode"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"
)

type AttendeeForm struct {
	Name         string `form:"name" binding:"required"`
	Birthday     string `form:"birthday" binding:"required"`
	Gender       string `form:"gender" binding:"required"`
	Email        string `form:"email" binding:"required,email"`
	Phone        string `form:"phone,omitempty"`
	Sessions     string `form:"sessions" binding:"required"`
	Experience   string `form:"experience" binding:"required"`
	JobTitle     string `form:"job_title" binding:"required"`
	CompanyEmail string `form:"company_email,omitempty"`
	LinkedIn     string `form:"linkedin,omitempty"`
	Question     string `form:"question,omitempty"`
}

type Attendee struct {
	gorm.Model
	Name         string `gorm:"not null"`
	Birthday     string `gorm:"not null"`
	Gender       string `gorm:"not null"`
	Email        string `gorm:"not null;unique"`
	Phone        string `gorm:"nullable"`
	Sessions     string `gorm:"not null"`
	Experience   string `gorm:"not null"`
	JobTitle     string `gorm:"not null"`
	CompanyEmail string `gorm:"nullable"`
	LinkedIn     string `gorm:"nullable"`
	Question     string `gorm:"nullable"`
	Secret       string `gorm:"not null"`
}

type Email struct {
	gorm.Model
	From      string `gorm:"not null"`
	To        string `gorm:"not null"`
	Cc        string `gorm:"nullable"`
	Subject   string `gorm:"not null"`
	Body      string `gorm:"not null"`
	Status    bool   `gorm:"not null"`
	MessageId string `gorm:"nullable"`
	Error     string `gorm:"nullable"`
}

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(&Attendee{}, &Email{})
	if err != nil {
		panic("failed to migrate database")
		return
	}
}

func NewSecretCode() string {
	return uuid.New().String()[:6]
}

func ParseEmail(data any, templates ...string) (string, error) {
	mail, err := template.ParseFiles(templates...)
	if err != nil {
		fmt.Println(err)
	}
	var htmlBody bytes.Buffer
	err = mail.Execute(&htmlBody, data)
	if err != nil {
		return "", err
	}
	return string(htmlBody.Bytes()), nil
}

func SendEmail(ctx context.Context, email Email) (*sesv2.SendEmailOutput, error) {
	cfg, err := config.LoadDefaultConfig(
		ctx,
		config.WithRegion("ap-southeast-1"),
	)
	if err != nil {
		return nil, err
	}
	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(email.From),
		Destination: &types.Destination{
			CcAddresses: []string{},
			ToAddresses: []string{email.To},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String(email.Subject),
				},
				Body: &types.Body{
					Html: &types.Content{
						Data: aws.String(email.Body),
					},
				},
			},
		},
	}
	svc := sesv2.NewFromConfig(cfg)
	output, err := svc.SendEmail(ctx, input)
	if err != nil {
		return nil, err
	}
	return output, nil
}

func GetErrorMessage(e validator.FieldError) string {
	switch e.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email format"
	case "min":
		return "Value is too short"
	case "max":
		return "Value is too long"
	default:
		return "Invalid value"
	}
}

func main() {
	err := os.Setenv("TZ", "Asia/Ho_Chi_Minh")
	if err != nil {
		return
	}
	fmt.Println(time.Now())

	// Load .env file
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Connect database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
		return
	}
	sqlDB, err := db.DB()
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	Migrate(db)

	// Setup gin
	r := gin.Default()
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("NEXT_PUBLIC_BASE_URL")},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
	r.GET("/qr", func(c *gin.Context) {
		content := c.Query("content")
		var png []byte
		png, _ = qrcode.Encode(content, qrcode.Medium, 512)
		imgBase64Str := base64.StdEncoding.EncodeToString(png)
		c.JSON(http.StatusOK, gin.H{
			"image": imgBase64Str,
		})
	})
	attendee := r.Group("/attendee")
	{
		attendee.POST("/check-email", func(c *gin.Context) {
			email := c.PostForm("email")
			var attendee Attendee
			db.First(&attendee, "email = ?", email)
			c.JSON(http.StatusOK, gin.H{
				"status": attendee.ID != 0,
			})
		})
		attendee.POST("/attend", func(c *gin.Context) {
			var attendeeForm AttendeeForm
			err := c.ShouldBind(&attendeeForm)
			if err != nil {
				// Check if the error is a validation error
				if validationErrs, ok := err.(validator.ValidationErrors); ok {
					// Prepare an errors map
					errors := make(map[string]string)

					// Iterate over the validation errors and extract error messages
					for _, e := range validationErrs {
						// Create a meaningful error message for each field
						errors[e.Field()] = GetErrorMessage(e)
					}

					// Respond with a 400 Bad Request and the error messages
					c.JSON(http.StatusBadRequest, gin.H{
						"message": "Validation failed",
						"errors":  errors,
					})
					return
				}

				// Return a generic error if binding fails for non-validation reasons
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form submission"})
				return
			}
			var att Attendee
			db.First(&att, "email = ?", attendeeForm.Email)
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
			body, err := ParseEmail(attendee, "templates/confirmation.html")
			if err != nil {
				fmt.Println(err.Error())
			}
			email := Email{
				From:    os.Getenv("EMAIL_FROM"),
				To:      attendee.Email,
				Subject: "CẢM ƠN BẠN ĐÃ ĐĂNG KÝ THAM GIA GOOGLE CLOUD DEVFEST HANOI 2024",
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
			id := db.Create(&attendee)
			if id.Error != nil {
				c.JSON(http.StatusBadRequest, gin.H{})
				return
			}
			id = db.Create(&email)
			if id.Error != nil {
				fmt.Println(id.Error.Error())
			}
			c.JSON(http.StatusOK, gin.H{})
		})
	}
	port := os.Getenv("SERVICE_PORT")
	if port == "" {
		port = ":8080"
	} else if port[0] != ':' {
		port = ":" + port
	}
	err = r.Run(port)
	if err != nil {
		return
	}
}
