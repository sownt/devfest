package main

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

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

func NewSecretCode(len int) string {
	return uuid.New().String()[:len]
}
