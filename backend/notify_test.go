package main

import (
	"strings"
	"testing"
	"time"
)

func TestWhatsappNumber(t *testing.T) {
	cases := map[string]string{
		"+91 98765 43210": "919876543210",
		"09876543210":     "919876543210",
		"9876543210":      "919876543210",
	}
	for in, want := range cases {
		if got := whatsappNumber(in); got != want {
			t.Errorf("whatsappNumber(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestBuildEnquiryEmail(t *testing.T) {
	e := &Enquiry{
		ID: "ENQ-1", Name: "Ravi <Test>", Email: "ravi@example.com", Phone: "+91 98765 43210",
		Service: "Website Development", Message: "Need a site", CreatedAt: time.Now(),
	}
	msg := string(buildEnquiryEmail("site@example.com", []string{"owner@example.com"}, e))

	for _, want := range []string{
		"To: owner@example.com",
		"Reply-To: ravi@example.com",
		"https://wa.me/919876543210",
		"Ravi &lt;Test&gt;", // customer input is HTML-escaped
		"Content-Type: text/html; charset=UTF-8",
	} {
		if !strings.Contains(msg, want) {
			t.Errorf("email missing %q", want)
		}
	}
}

func TestMailerDisabledWithoutConfig(t *testing.T) {
	t.Setenv("SMTP_HOST", "")
	t.Setenv("NOTIFY_TO", "")
	if newMailerFromEnv() != nil {
		t.Error("expected no mailer when SMTP isn't configured")
	}
}
