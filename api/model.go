package main

import (
	"database/sql"
	"gorm.io/gorm"
)

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
	Email       string `gorm:"not null;unique"`
	Name        string `gorm:"not null"`
	Avatar      string `gorm:"not null"`
}

type Event struct {
	gorm.Model
	Name        string       `gorm:"not null"`
	Description string       `gorm:"nullable"`
	StartTime   sql.NullTime `gorm:"nullable"`
	EndTime     sql.NullTime `gorm:"nullable"`
}

type Ticket struct {
	gorm.Model
	AttendeeID uint
	Attendee   Attendee `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	EventID    uint
	Event      Event        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Used       sql.NullTime `gorm:"nullable"`
	Secret     string       `gorm:"not null;unique" json:"secret"`
}
