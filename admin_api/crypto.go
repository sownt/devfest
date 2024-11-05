package main

import "github.com/google/uuid"

func NewSecretCode() string {
	return uuid.New().String()[:6]
}
