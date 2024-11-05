package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
	dsn := fmt.Sprintf("host=localhost user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB"),
		os.Getenv("EXPOSE_DATABASE"),
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
	err = _db.AutoMigrate(&Attendee{}, &Email{}, &EmailTemplate{}, &User{}, &Permission{}, &Iam{})
	if err != nil {
		panic("failed to migrate database")
	}
	sqlDB, err := _db.DB()
	if err != nil {
		panic(err)
	}
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)
	return _db
}

func InitDatabase() {
	GetDb().Clauses(clause.OnConflict{DoNothing: true}).Create(
		&EmailTemplate{
			Name:    "new_account_email",
			From:    "GDG Cloud Hanoi <devfest@gdgcloudhanoi.dev>",
			Subject: "CẢM ƠN BẠN ĐÃ ĐĂNG KÝ THAM GIA GOOGLE CLOUD DEVFEST HANOI 2024",
			Body:    newAccountEmailBody,
			Json:    newAccountEmailJson,
		})
}
