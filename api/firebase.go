package main

import (
	"context"
	firebase "firebase.google.com/go"
	"fmt"
	"google.golang.org/api/option"
	"gorm.io/gorm/clause"
	"log"
	"net/http"
)

func GetFirebase() *firebase.App {
	if firebaseApp == nil {
		InitFirebase()
	}
	return firebaseApp
}

func InitFirebase() {
	opt := option.WithCredentialsFile("serviceAccountKey.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic(fmt.Errorf("error initializing app: %v", err))
	}
	firebaseApp = app
}

func VerifyToken(ctx context.Context, idToken string) (string, error) {
	client, err := GetFirebase().Auth(ctx)
	if err != nil {
		return "", fmt.Errorf("error getting auth client: %v\n", err)
	}
	token, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return "", fmt.Errorf("error verifying ID token: %v\n", err)
	}
	GetDb().Clauses(clause.OnConflict{DoNothing: true}).Create(&User{
		FirebaseUid: token.UID,
		Email:       token.Claims["email"].(string),
		Name:        token.Claims["name"].(string),
		Avatar:      token.Claims["picture"].(string),
	})
	cookie, err := client.SessionCookie(ctx, idToken, UserSessionExpiresIn)
	if err != nil {
		return "", fmt.Errorf("Failed to create a session cookie %v\n", http.StatusInternalServerError)
	}

	return cookie, nil
}

func RevokeSessionCookie(ctx context.Context, session string) error {
	client, err := GetFirebase().Auth(ctx)
	if err != nil {
		return fmt.Errorf("error getting Auth client: %v\n", err)
	}
	decoded, err := client.VerifySessionCookie(ctx, session)
	if err != nil {
		return fmt.Errorf("Failed to verify session cookie: %v\n", err)
	}
	log.Printf("Session cookie verified: %v\n", decoded)
	if err := client.RevokeRefreshTokens(ctx, decoded.UID); err != nil {
		return fmt.Errorf("Failed to revoke refresh token: %v\n", err)
	}
	return nil
}
