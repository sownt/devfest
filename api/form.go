package main

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
