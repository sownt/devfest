package main

import (
	"encoding/csv"
	"fmt"
	"gorm.io/gorm"
	"os"
)

var (
	db *gorm.DB
)

func SendTickets() {
	file, err := os.Open("data.csv")
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
	for i, row := range records {
		fmt.Printf("Row %d:\n", i+1)
		for j, col := range row {
			fmt.Printf("  Column %d: %s\n", j+1, col)
		}
	}
}

func main() {
	SendTickets()
}
