package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/mail"
	"regexp"
	"strings"
)

type apiHandler struct {
	store   *enquiryStore
	limiter *rateLimiter
	mailer  *mailer // nil when email isn't configured
}

func (h *apiHandler) health(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *apiHandler) services(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, services)
}

func (h *apiHandler) packages(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, packages)
}

func (h *apiHandler) testimonials(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, testimonials)
}

func (h *apiHandler) brands(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, brands)
}

func (h *apiHandler) showcase(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, showcases)
}

func (h *apiHandler) faqs(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, faqs)
}

type contactRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Business string `json:"business"`
	Service  string `json:"service"`
	Plan     string `json:"plan"`
	Message  string `json:"message"`
	Website  string `json:"website"` // honeypot: real users never fill this
}

// Indian mobile numbers: optional +91/0 prefix, then 10 digits starting 6-9.
var indianPhone = regexp.MustCompile(`^(?:\+?91|0)?[6-9]\d{9}$`)

func (h *apiHandler) contact(w http.ResponseWriter, r *http.Request) {
	if !h.limiter.allow(clientIP(r)) {
		writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "Too many requests. Please try again in a minute."})
		return
	}

	var req contactRequest
	r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body."})
		return
	}

	if req.Website != "" {
		// Bot filled the honeypot; pretend success.
		writeJSON(w, http.StatusOK, map[string]string{"message": "Thank you!"})
		return
	}

	if errs := req.validate(); len(errs) > 0 {
		writeJSON(w, http.StatusUnprocessableEntity, map[string]any{"error": "Please fix the highlighted fields.", "fields": errs})
		return
	}

	enq := &Enquiry{
		Name:     strings.TrimSpace(req.Name),
		Email:    strings.TrimSpace(req.Email),
		Phone:    normalisePhone(req.Phone),
		Business: strings.TrimSpace(req.Business),
		Service:  strings.TrimSpace(req.Service),
		Plan:     strings.TrimSpace(req.Plan),
		Message:  strings.TrimSpace(req.Message),
	}
	if err := h.store.save(enq); err != nil {
		log.Printf("save enquiry: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "Something went wrong. Please call or WhatsApp us."})
		return
	}

	log.Printf("new enquiry %s from %s (%s) for %s", enq.ID, enq.Name, enq.Phone, enq.Service)
	if h.mailer != nil {
		h.mailer.notifyAsync(enq)
	}
	writeJSON(w, http.StatusCreated, map[string]string{
		"id":      enq.ID,
		"message": "Thank you! Our team will call you within 24 hours.",
	})
}

func (c contactRequest) validate() map[string]string {
	errs := map[string]string{}
	if n := len(strings.TrimSpace(c.Name)); n < 2 || n > 80 {
		errs["name"] = "Please enter your name."
	}
	if _, err := mail.ParseAddress(strings.TrimSpace(c.Email)); err != nil {
		errs["email"] = "Please enter a valid email address."
	}
	if !indianPhone.MatchString(normalisePhone(c.Phone)) {
		errs["phone"] = "Please enter a valid 10-digit mobile number."
	}
	if strings.TrimSpace(c.Service) == "" {
		errs["service"] = "Please choose a service."
	}
	if len(c.Message) > 2000 {
		errs["message"] = "Message is too long (max 2000 characters)."
	}
	return errs
}

func normalisePhone(p string) string {
	return strings.NewReplacer(" ", "", "-", "", "(", "", ")", "").Replace(strings.TrimSpace(p))
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("write json: %v", err)
	}
}
