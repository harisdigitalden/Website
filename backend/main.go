// Hari's Digital Den - API server.
//
// Endpoints:
//
//	GET  /api/health
//	GET  /api/services
//	GET  /api/packages
//	GET  /api/testimonials
//	GET  /api/faqs
//	GET  /api/brands
//	GET  /api/showcase
//	POST /api/contact
//
// If STATIC_DIR points at the built Angular app, the server also serves the
// frontend (with SPA fallback), so one binary can run the whole site.
package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	loadDotEnv(".env")
	port := env("PORT", "8080")
	allowedOrigin := env("ALLOWED_ORIGIN", "http://localhost:4200")
	dataDir := env("DATA_DIR", "data")
	staticDir := env("STATIC_DIR", "../frontend/dist/frontend/browser")

	store, err := newEnquiryStore(dataDir)
	if err != nil {
		log.Fatalf("enquiry store: %v", err)
	}

	api := &apiHandler{store: store, limiter: newRateLimiter(5, time.Minute), mailer: newMailerFromEnv()}
	if api.mailer != nil {
		log.Printf("enquiry emails go to %s", strings.Join(api.mailer.to, ", "))
	} else {
		log.Printf("email not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFY_TO); enquiries are saved to %s only", dataDir)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", api.health)
	mux.HandleFunc("GET /api/services", api.services)
	mux.HandleFunc("GET /api/packages", api.packages)
	mux.HandleFunc("GET /api/testimonials", api.testimonials)
	mux.HandleFunc("GET /api/faqs", api.faqs)
	mux.HandleFunc("GET /api/brands", api.brands)
	mux.HandleFunc("GET /api/showcase", api.showcase)
	mux.HandleFunc("POST /api/contact", api.contact)

	if info, err := os.Stat(staticDir); err == nil && info.IsDir() {
		log.Printf("serving frontend from %s", staticDir)
		mux.Handle("/", spaHandler(staticDir))
	}

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           logRequests(cors(allowedOrigin, mux)),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
	}

	log.Printf("Hari's Digital Den API listening on http://localhost:%s", port)
	log.Fatal(srv.ListenAndServe())
}

// loadDotEnv reads KEY=VALUE lines from a local .env file (if present) for
// settings like SMTP passwords that must not be committed. Real environment
// variables (e.g. set on Render) take priority.
func loadDotEnv(path string) {
	data, err := os.ReadFile(path)
	if err != nil {
		return
	}
	for _, line := range strings.Split(string(data), "\n") {
		line = strings.TrimSpace(line)
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if _, exists := os.LookupEnv(key); !exists {
			os.Setenv(key, value)
		}
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
