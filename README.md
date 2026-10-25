# Hari's Digital Den

**Brand | Content | Growth.** Website for Hari's Digital Den, a digital marketing studio in Andhra Pradesh & Telangana: websites, Instagram and Facebook marketing, social media setup and management, and branding.

Social: [Instagram](https://www.instagram.com/harisdigitalden/) · [Facebook](https://www.facebook.com/profile.php?id=61595347683871) · [X](https://x.com/harisdigitalden) · [Threads](https://www.threads.com/@harisdigitalden)

Logo files (`frontend/public/images/logo*.png`) were cropped from the VR Interiors quotation image.

| Part     | Tech                                              | Folder      | Dev URL               |
|----------|---------------------------------------------------|-------------|-----------------------|
| Frontend | Angular 22 (standalone components, signals, SCSS) | `frontend/` | http://localhost:4200 |
| Backend  | Go 1.27, standard library only (`net/http`)       | `backend/`  | http://localhost:8080 |

## Run in VS Code (one IDE for both)

1. Open the **`ad-haris-digital-den`** folder in VS Code (File → Open Folder).
2. Install the recommended extensions when prompted (Angular Language Service, Go).
3. Press **Ctrl+Shift+B**. This runs **"dev: start both"**, which starts the Go API and the Angular dev server.
4. Open http://localhost:4200. Angular forwards `/api/*` calls to Go (see `frontend/proxy.conf.json`).

To debug, open the Run and Debug panel (Ctrl+Shift+D) and pick **"Full stack (Go + Angular)"**. Breakpoints work in both the `.go` and `.ts` files.

### Or from a terminal

```powershell
# terminal 1
cd backend;  go run .
# terminal 2
cd frontend; npm start
```

## Production build (a single server)

```powershell
cd frontend; npm run build
cd ..\backend; go build -o adharis-api.exe .; .\adharis-api.exe
```

The Go server then serves both the API and the built Angular site at http://localhost:8080.

Environment variables: `PORT` (8080), `ALLOWED_ORIGIN` (http://localhost:4200), `DATA_DIR` (data), `STATIC_DIR` (../frontend/dist/frontend/browser).

## API

| Method | Path                | Notes                                                         |
|--------|---------------------|---------------------------------------------------------------|
| GET    | `/api/health`       |                                                               |
| GET    | `/api/services`     | Content lives in `backend/content.go`                          |
| GET    | `/api/packages`     | Plan 1 (₹75,000 one time) and Plan 2 (₹25,000 per month)       |
| GET    | `/api/testimonials` |                                                               |
| GET    | `/api/faqs`         |                                                               |
| GET    | `/api/brands`       | Client logos for the "Brands That Trust Us" strip              |

### Adding a client to "Brands That Trust Us"
1. Save the client's logo in `frontend/public/images/brands/`. A light-coloured logo or one on a dark background looks best, because the strip is black.
2. Add one line to the `brands` list in `backend/content.go`:
   ```go
   {Name: "New Client", Logo: "images/brands/new-client.png", URL: "https://newclient.in/"},
   ```
3. Rebuild the frontend (`npm run build`) and restart the Go server.

### Featuring client Instagram posts ("Content We Create, Live on Instagram")
These use Instagram's official embeds, so nothing is downloaded. In `backend/content.go`, edit the `showcases` list:
- **Add or swap a post:** copy the code from the post's link and add `{Type: "reel", Code: "..."}` or `{Type: "p", Code: "..."}`. For example, the code in `instagram.com/reel/DeowsI1NVvB/` is `DeowsI1NVvB`.
- **Add another client:** add a new block with `Brand`, `Handle`, `Profile`, `Logo`, `Bio` and `Posts`.

Restart the Go server after editing (no frontend rebuild needed).
| POST   | `/api/contact`      | Validated (Indian mobile, email), rate limited, honeypot spam filter |

Contact enquiries are saved to `backend/data/enquiries.jsonl` and, when email is configured, sent to the company inbox.

### Getting consultation forms in your company email
Set these environment variables (on Render: **Service → Environment**). Without them the site still works, but enquiries only go to the file above.

| Variable | Example | Notes |
|---|---|---|
| `SMTP_HOST` | `smtp.gmail.com` / `smtp.zoho.in` | Your email provider's SMTP server |
| `SMTP_PORT` | `587` | STARTTLS port (default 587) |
| `SMTP_USER` | `hello@yourdomain.com` | Login, usually the full address |
| `SMTP_PASS` | *(app password)* | Gmail/Workspace: create an **App Password** (needs 2-step verification). Zoho: an app-specific password |
| `NOTIFY_TO` | `hello@yourdomain.com` | Where enquiries arrive; comma-separate several |
| `NOTIFY_FROM` | *(optional)* | Sender address, defaults to `SMTP_USER` |

Each email has the customer's details, a **Reply on WhatsApp** button, and **Reply** goes straight to the customer's email.

## Before going live: replace the placeholders

- **`frontend/src/app/site.config.ts`**: the **phone, WhatsApp number and email are placeholders**. The social links are real.
- **`backend/content.go`**: add real client testimonials, then put `<app-testimonials />` back on the Home page
- Optional: add YouTube and Pinterest links to `SITE.social` once those accounts exist
- Later: send an email or WhatsApp alert for each new enquiry, and store leads in a database
