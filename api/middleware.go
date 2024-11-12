package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

func RequiredLogin() gin.HandlerFunc {
	return func(c *gin.Context) {
		client, err := GetFirebase().Auth(c)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		session, _ := c.Cookie("session")
		token, err := client.VerifySessionCookieAndCheckRevoked(c, session)
		if err != nil {
			c.SetCookie("session", "", -1, "/", os.Getenv("BASE_URL"), false, false)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		var user User
		GetDb().First(&user, "firebase_uid = ?", token.UID)
		if user.ID == 0 || !user.Status {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{})
			return
		}
		c.Next()
	}
}
