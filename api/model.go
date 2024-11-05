package main

import "gorm.io/gorm"

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

type EmailTemplate struct {
	gorm.Model
	Name    string `gorm:"unique"`
	From    string `gorm:"not null"`
	Subject string `gorm:"nullable"`
	Body    string `gorm:"not null"`
	Json    string `gorm:"nullable"`
}

type User struct {
	gorm.Model
	FirebaseUid string `gorm:"unique"`
	Status      bool   `gorm:"not null;default:false"`
}

type Permission struct {
	gorm.Model
	Name  string `gorm:"not null"`
	Value string `gorm:"not null, unique"`
}

type Iam struct {
	gorm.Model
	UserID       int
	User         User
	PermissionID int
	Permission   Permission
}
