package main

import (
	"devfest_api/docs"
	firebase "firebase.google.com/go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

const (
	UserSessionExpiresIn = time.Hour * 24
)

var (
	db          *gorm.DB
	firebaseApp *firebase.App
)

func main() {
	// Set up timezone
	err := os.Setenv("TZ", "Asia/Ho_Chi_Minh")
	if err != nil {
		log.Fatal("Set timezone error")
	}

	// Load .env file
	err = godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Setup gin
	r := gin.Default()
	r.Use(gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("NEXT_PUBLIC_BASE_URL")},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.GET("/ping", Ping)
	r.GET("/qr", GenerateQr)
	r.POST("/login", Login)

	authorized := r.Group("/", RequiredLogin())
	{
		authorized.GET("/admin/ping", Ping)
		authorized.POST("/logout", Logout)
		authorized.POST("/ticket", CreateTicket)
		authorized.GET("/check-in", CheckInEvent)
		analytics := authorized.Group("/analytics")
		{
			analytics.GET("/summary", Summary)
			analytics.GET("/gender", Gender)
			analytics.GET("/birthday", Birthday)
			analytics.GET("/experience", Experience)
		}
	}

	attendee := r.Group("/attendee")
	{
		attendee.POST("/email", CheckEmail)
		attendee.POST("/attend", Attend)
		attendee.GET("/ticket", GetTicketDetail)
		attendee.GET("/all", GetAttendees)
	}

	// Swagger
	docs.SwaggerInfo.BasePath = "/api/v1"
	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	// Run
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
