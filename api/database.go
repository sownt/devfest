package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
	"time"
)

func GetDb() *gorm.DB {
	if db == nil {
		db = SetupPostgres()
	}
	return db
}

func SetupPostgres() *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("SERVICE_PORT"),
	)
	_db, err := gorm.Open(
		postgres.New(
			postgres.Config{
				DSN:                  dsn,
				PreferSimpleProtocol: true,
			}),
		&gorm.Config{},
	)
	if err != nil {
		panic("failed to connect database")
	}
	err = _db.AutoMigrate(&Attendee{}, &Email{}, &EmailTemplate{}, &User{}, &Permission{}, &Iam{}, &Event{}, &Ticket{})
	if err != nil {
		panic("failed to migrate database")
	}
	sqlDB, err := _db.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Second * 10)
	return _db
}
