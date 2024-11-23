package main

import (
	"bytes"
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	"html/template"
)

func ParseEmailBody(data any, body string) (string, error) {
	mail := template.Must(template.New("").Parse(body))
	var htmlBody bytes.Buffer
	err := mail.Execute(&htmlBody, data)
	if err != nil {
		return "", err
	}
	return string(htmlBody.Bytes()), nil
}

func SendEmail(ctx context.Context, email Email) (*sesv2.SendEmailOutput, error) {
	cfg, err := config.LoadDefaultConfig(
		ctx,
		config.WithRegion("ap-southeast-1"),
	)
	if err != nil {
		return nil, err
	}
	input := &sesv2.SendEmailInput{
		FromEmailAddress: aws.String(email.From),
		Destination: &types.Destination{
			CcAddresses: []string{},
			ToAddresses: []string{email.To},
		},
		Content: &types.EmailContent{
			Simple: &types.Message{
				Subject: &types.Content{
					Data: aws.String(email.Subject),
				},
				Body: &types.Body{
					Html: &types.Content{
						Data: aws.String(email.Body),
					},
				},
			},
		},
	}
	svc := sesv2.NewFromConfig(cfg)
	output, err := svc.SendEmail(ctx, input)
	if err != nil {
		return nil, err
	}
	return output, nil
}
