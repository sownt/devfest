package main

import (
	"context"
	"encoding/json"
	firebase "firebase.google.com/go"
	"fmt"
	"google.golang.org/api/option"
	"gorm.io/gorm/clause"
	"log"
	"net/http"
	"os"
)

func GetFirebase() *firebase.App {
	if firebaseApp == nil {
		f, err := InitFirebase()
		if err != nil {
			panic("failed to init firebase")
		}
		firebaseApp = f
	}
	return firebaseApp
}

func InitFirebase() (*firebase.App, error) {
	serviceAccountKey, err := json.Marshal(map[string]interface{}{
		"type":                        os.Getenv("SAK_TYPE"),
		"project_id":                  os.Getenv("SAK_PROJECT_ID"),
		"private_key_id":              os.Getenv("SAK_PRIVATE_KEY_ID"),
		"private_key":                 os.Getenv("SAK_PRIVATE_KEY"),
		"client_email":                os.Getenv("SAK_CLIENT_EMAIL"),
		"client_id":                   os.Getenv("SAK_CLIENT_ID"),
		"auth_uri":                    os.Getenv("SAK_AUTH_URI"),
		"token_uri":                   os.Getenv("SAK_TOKEN_URI"),
		"auth_provider_x509_cert_url": os.Getenv("SAK_AUTH_PROVIDER_X509_CERT_URL"),
		"client_x509_cert_url":        os.Getenv("SAK_CAT_CLIENT_X509_CERT_URL"),
		"universe_domain":             os.Getenv("SAK_UNIVERSE_DOMAIN"),
	})
	if err != nil {
		return nil, err
	}
	opt := option.WithCredentialsJSON(serviceAccountKey)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing app: %v", err)
	}
	return app, nil
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
	GetDb().Clauses(clause.OnConflict{DoNothing: true}).Create(&User{FirebaseUid: token.UID})
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
