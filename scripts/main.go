package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
	"log"
	"os"
	"time"
)

var (
	db *gorm.DB
)

func NewSecretCode(len int) string {
	return uuid.New().String()[:len]
}

func SendEmails(handler func([][]string), csvFile string) {
	file, err := os.Open(csvFile)
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		fmt.Println("Error reading CSV file:", err)
		return
	}
	handler(records)
}

func SendMarketing(records [][]string) {
	var et EmailTemplate
	GetDb().First(&et, "name = ?", "marketing_email")
	if et.ID == 0 {
		fmt.Println("New Account Email Not Found")
	}
	for i, row := range records {
		var mailTo string
		for j, col := range row {
			fmt.Printf("Row %d, Column %d: %s\n", i+1, j+1, col)
			if j == 0 {
				mailTo = col
			}
			var att Attendee
			GetDb().First(&att, "email = ?", mailTo)
			if att.ID != 0 {
				fmt.Printf("Found attendee (ID=%d), skip...\n", att.ID)
				continue
			}
			body, err := ParseEmailBody(nil, et.Body)
			if err != nil {
				fmt.Println(err.Error())
			}
			email := Email{
				From:    et.From,
				To:      mailTo,
				Subject: et.Subject,
				Body:    body,
			}
			output, err := SendEmail(context.Background(), email)
			if err != nil {
				email.Status = false
				email.Error = err.Error()
			} else {
				email.Status = true
				email.MessageId = *output.MessageId
			}
			id := GetDb().Create(&email)
			if id.Error != nil {
				fmt.Println(id.Error.Error())
			}
			time.Sleep(time.Millisecond * 75)
		}
	}

}

func SendMorningTickets(records [][]string) {
	var et EmailTemplate
	GetDb().First(&et, "name = ?", "morning_ticket")
	if et.ID == 0 {
		fmt.Println("New Account Email Not Found")
	}
	for i, row := range records {
		var mailTo string
		for j, col := range row {
			fmt.Printf("Row %d, Column %d: %s\n", i+1, j+1, col)
			if j == 0 {
				mailTo = col
			}
			var att Attendee
			GetDb().First(&att, "email = ?", mailTo)
			if att.ID == 0 {
				fmt.Printf("Attendee not found (%s), skip...\n", mailTo)
				continue
			}
			if att.Sessions == "afternoon" {
				fmt.Printf("Attendee didn't register morning session (%s), skip...\n", mailTo)
				continue
			}
			var ticket Ticket
			secretCode := NewSecretCode(16)
			GetDb().First(&ticket, "secret = ?", secretCode)
			for ticket.ID != 0 {
				secretCode = NewSecretCode(16)
			}
			ticketData := TicketEmailData{
				Name: att.Name,
				Qr:   secretCode,
			}
			GetDb().First(&ticket, "attendee_id = ? AND event_id = ?", att.ID, 1)
			if ticket.ID != 0 {
				fmt.Printf("Attendee already have ticket for morning session (%s), skip...\n", mailTo)
				continue
			}
			ticket = Ticket{
				EventID:    1,
				AttendeeID: att.ID,
				Secret:     ticketData.Qr,
			}
			id := GetDb().Create(&ticket)
			if id.Error != nil {
				fmt.Printf("Failed to create ticket (%s): %s", mailTo, id.Error.Error())
				continue
			}
			body, err := ParseEmailBody(ticketData, et.Body)
			if err != nil {
				fmt.Println(err.Error())
			}
			email := Email{
				From:    et.From,
				To:      mailTo,
				Subject: et.Subject,
				Body:    body,
			}
			output, err := SendEmail(context.Background(), email)
			if err != nil {
				email.Status = false
				email.Error = err.Error()
			} else {
				email.Status = true
				email.MessageId = *output.MessageId
			}
			id = GetDb().Create(&email)
			if id.Error != nil {
				fmt.Println(id.Error.Error())
			}
			time.Sleep(time.Millisecond * 100)
		}
	}

}

func SendAfternoonTickets(records [][]string) {
	var et EmailTemplate
	GetDb().First(&et, "name = ?", "afternoon_ticket")
	if et.ID == 0 {
		fmt.Println("New Account Email Not Found")
	}
	for i, row := range records {
		var mailTo string
		for j, col := range row {
			fmt.Printf("Row %d, Column %d: %s\n", i+1, j+1, col)
			if j == 0 {
				mailTo = col
			}
			var att Attendee
			GetDb().First(&att, "email = ?", mailTo)
			if att.ID == 0 {
				fmt.Printf("Attendee not found (%s), skip...\n", mailTo)
				continue
			}
			if att.Sessions == "morning" {
				fmt.Printf("Attendee didn't register afternoon session (%s), skip...\n", mailTo)
				continue
			}

			var ticket Ticket
			secretCode := NewSecretCode(16)
			GetDb().First(&ticket, "secret = ?", secretCode)
			for ticket.ID != 0 {
				secretCode = NewSecretCode(16)
			}
			ticketData := TicketEmailData{
				Name: att.Name,
				Qr:   secretCode,
			}
			GetDb().First(&ticket, "attendee_id = ? AND event_id = ?", att.ID, 2)
			if ticket.ID != 0 {
				fmt.Printf("Attendee already have ticket for afternoon session (%s), skip...\n", mailTo)
				continue
			}
			ticket = Ticket{
				EventID:    2,
				AttendeeID: att.ID,
				Secret:     ticketData.Qr,
			}
			id := GetDb().Create(&ticket)
			if id.Error != nil {
				fmt.Printf("Failed to create ticket (%s): %s", mailTo, id.Error.Error())
				continue
			}
			body, err := ParseEmailBody(ticketData, et.Body)
			if err != nil {
				fmt.Println(err.Error())
			}
			email := Email{
				From:    et.From,
				To:      mailTo,
				Subject: et.Subject,
				Body:    body,
			}
			output, err := SendEmail(context.Background(), email)
			if err != nil {
				email.Status = false
				email.Error = err.Error()
			} else {
				email.Status = true
				email.MessageId = *output.MessageId
			}
			id = GetDb().Create(&email)
			if id.Error != nil {
				fmt.Println(id.Error.Error())
			}
			time.Sleep(time.Millisecond * 100)
		}
	}
}

func timer(name string) func() {
	start := time.Now()
	return func() {
		fmt.Printf("%s took %v\n", name, time.Since(start))
	}
}

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

	// Setup db
	InitDb()

	defer timer("SendEmails")()
	SendEmails(SendMorningTickets, "scripts/data/data.csv")
}
