package main

import (
	"bytes"
	"fmt"
	"html"
	"log"
	"mime"
	"net/smtp"
	"os"
	"regexp"
	"strings"
	"time"
)

// mailer emails each new enquiry to the company inbox over SMTP (STARTTLS,
// port 587). Works with Gmail / Google Workspace (use an App Password), Zoho
// Mail, Brevo, or any provider that offers SMTP. Configured from env vars:
//
//	SMTP_HOST   e.g. smtp.gmail.com, smtp.zoho.in, smtp-relay.brevo.com
//	SMTP_PORT   default 587
//	SMTP_USER   login (usually the full email address)
//	SMTP_PASS   password or app password
//	NOTIFY_TO   where enquiries go; comma-separated for several inboxes
//	NOTIFY_FROM sender address (defaults to SMTP_USER)
type mailer struct {
	host, port, user, pass, from string
	to                           []string
}

// newMailerFromEnv returns nil when email isn't configured, so the site still
// works (enquiries are saved and logged) without it.
func newMailerFromEnv() *mailer {
	m := &mailer{
		host: os.Getenv("SMTP_HOST"),
		port: env("SMTP_PORT", "587"),
		user: os.Getenv("SMTP_USER"),
		pass: os.Getenv("SMTP_PASS"),
		from: env("NOTIFY_FROM", os.Getenv("SMTP_USER")),
	}
	for _, addr := range strings.Split(os.Getenv("NOTIFY_TO"), ",") {
		if addr = strings.TrimSpace(addr); addr != "" {
			m.to = append(m.to, addr)
		}
	}
	if m.host == "" || m.user == "" || m.pass == "" || len(m.to) == 0 {
		return nil
	}
	// Google shows App Passwords in groups of four ("abcd efgh ..."); the
	// spaces aren't part of the password.
	if strings.Contains(m.host, "gmail") {
		m.pass = strings.ReplaceAll(m.pass, " ", "")
	}
	return m
}

func (m *mailer) sendEnquiry(e *Enquiry) error {
	msg := buildEnquiryEmail(m.from, m.to, e)
	auth := smtp.PlainAuth("", m.user, m.pass, m.host)
	return smtp.SendMail(m.host+":"+m.port, auth, m.from, m.to, msg)
}

var nonDigits = regexp.MustCompile(`\D`)

// whatsappNumber turns an Indian mobile like "+91 98765 43210" or
// "09876543210" into "919876543210" for a wa.me link.
func whatsappNumber(phone string) string {
	d := nonDigits.ReplaceAllString(phone, "")
	d = strings.TrimPrefix(d, "0")
	if len(d) == 10 {
		d = "91" + d
	}
	return d
}

func buildEnquiryEmail(from string, to []string, e *Enquiry) []byte {
	subject := fmt.Sprintf("New consultation request — %s (%s)", e.Name, e.Service)
	wa := "https://wa.me/" + whatsappNumber(e.Phone)

	rows := [][2]string{
		{"Name", e.Name},
		{"Phone", e.Phone},
		{"Email", e.Email},
		{"Business", e.Business},
		{"Service", e.Service},
		{"Plan", e.Plan},
		{"Message", e.Message},
		{"Received", e.CreatedAt.Format("02 Jan 2006, 3:04 PM")},
		{"Reference", e.ID},
	}
	var table strings.Builder
	for _, r := range rows {
		if strings.TrimSpace(r[1]) == "" {
			continue
		}
		fmt.Fprintf(&table,
			`<tr><td style="padding:8px 12px;color:#5a6168;white-space:nowrap;vertical-align:top">%s</td><td style="padding:8px 12px;color:#141c21;font-weight:600">%s</td></tr>`,
			r[0], strings.ReplaceAll(html.EscapeString(r[1]), "\n", "<br>"))
	}

	body := fmt.Sprintf(`<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eadfca;border-radius:12px;overflow:hidden">
<div style="background:#090e13;color:#d8ae62;padding:16px 20px;font-size:18px;font-weight:bold">New consultation request</div>
<table style="width:100%%;border-collapse:collapse;background:#fffbf4">%s</table>
<div style="padding:16px 20px;background:#fffbf4">
<a href="%s" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold">Reply on WhatsApp</a>
<a href="tel:%s" style="display:inline-block;margin-left:8px;background:#d8ae62;color:#090e13;text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:bold">Call</a>
</div>
<div style="padding:10px 20px;background:#fffbf4;color:#97a1aa;font-size:12px">Sent by the Hari's Digital Den website. Press Reply to email the customer.</div>
</div>`, table.String(), wa, html.EscapeString(e.Phone))

	var b bytes.Buffer
	fmt.Fprintf(&b, "From: %s\r\n", mime.QEncoding.Encode("utf-8", "Hari's Digital Den Website")+" <"+from+">")
	fmt.Fprintf(&b, "To: %s\r\n", strings.Join(to, ", "))
	if e.Email != "" {
		fmt.Fprintf(&b, "Reply-To: %s\r\n", e.Email)
	}
	fmt.Fprintf(&b, "Subject: %s\r\n", mime.QEncoding.Encode("utf-8", subject))
	fmt.Fprintf(&b, "Date: %s\r\n", time.Now().Format(time.RFC1123Z))
	b.WriteString("MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n")
	b.WriteString(body)
	return b.Bytes()
}

// notifyAsync emails the enquiry without delaying the visitor's response.
func (m *mailer) notifyAsync(e *Enquiry) {
	go func() {
		if err := m.sendEnquiry(e); err != nil {
			log.Printf("email for enquiry %s failed: %v", e.ID, err)
			return
		}
		log.Printf("emailed enquiry %s to %s", e.ID, strings.Join(m.to, ", "))
	}()
}
