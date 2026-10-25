package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// Enquiry is a lead submitted through the contact form.
type Enquiry struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Business  string    `json:"business,omitempty"`
	Service   string    `json:"service"`
	Plan      string    `json:"plan,omitempty"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

// enquiryStore appends enquiries to a JSON Lines file. Swap this for a
// database (Postgres, MongoDB) when the site grows.
type enquiryStore struct {
	mu   sync.Mutex
	path string
}

func newEnquiryStore(dir string) (*enquiryStore, error) {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return nil, err
	}
	return &enquiryStore{path: filepath.Join(dir, "enquiries.jsonl")}, nil
}

func (s *enquiryStore) save(e *Enquiry) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	e.CreatedAt = time.Now()
	e.ID = fmt.Sprintf("ENQ-%d", e.CreatedAt.UnixNano())

	f, err := os.OpenFile(s.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		return err
	}
	defer f.Close()
	return json.NewEncoder(f).Encode(e)
}
