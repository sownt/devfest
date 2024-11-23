package main

import (
	"gorm.io/gorm"
)

var (
	db *gorm.DB
)

func SendTickets() {
	GetDb()
}

func main() {
	SendTickets()
}
