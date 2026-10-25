package main

// Site content served by the API. Kept in Go so it can later move to a
// database or CMS without touching the frontend.

type Service struct {
	Slug     string   `json:"slug"`
	Title    string   `json:"title"`
	Icon     string   `json:"icon"`
	Summary  string   `json:"summary"`
	Features []string `json:"features"`
	Featured bool     `json:"featured"`
}

type FeatureGroup struct {
	Title string   `json:"title"`
	Icon  string   `json:"icon"`
	Items []string `json:"items"`
}

type Package struct {
	ID      string         `json:"id"`
	Label   string         `json:"label"` // e.g. "Plan 1"
	Name    string         `json:"name"`
	Price   int            `json:"price"` // INR
	Period  string         `json:"period"`
	Billing string         `json:"billing"` // "One time" / "Monthly"
	Tagline string         `json:"tagline"`
	Groups  []FeatureGroup `json:"groups"`
	Notes   []string       `json:"notes"`
	Popular bool           `json:"popular"`
}

type Testimonial struct {
	Name     string `json:"name"`
	Role     string `json:"role"`
	City     string `json:"city"`
	Quote    string `json:"quote"`
	Rating   int    `json:"rating"`
	Initials string `json:"initials"`
}

// Brand is a client shown in the "Brands That Trust Us" strip. Put the logo
// file in frontend/public/images/brands/ and add a line to brands below.
type Brand struct {
	Name string `json:"name"`
	Logo string `json:"logo"`
	URL  string `json:"url"`
}

// Showcase is a client Instagram account whose posts we feature, using
// Instagram's official embeds. Copy a post's code from its URL:
// instagram.com/reel/<code>/ or instagram.com/p/<code>/.
type Showcase struct {
	Brand   string          `json:"brand"`
	Handle  string          `json:"handle"`
	Profile string          `json:"profile"`
	Logo    string          `json:"logo"`
	Bio     string          `json:"bio"`
	Posts   []InstagramPost `json:"posts"`
}

type InstagramPost struct {
	Type  string `json:"type"` // "reel" or "p"
	Code  string `json:"code"`
	Label string `json:"label,omitempty"` // story highlight name, e.g. "Kitchen"
	Emoji string `json:"emoji,omitempty"`
	Image string `json:"image,omitempty"` // full-resolution copy in frontend/public/images/showcase/
}

type FAQ struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

var services = []Service{
	{
		Slug:     "website-development",
		Title:    "Website Development",
		Icon:     "web",
		Summary:  "Professional, modern websites that showcase your projects, services and portfolio — and turn visitors into enquiries.",
		Features: []string{"Custom, modern design for your brand", "Mobile & tablet responsive", "Projects, services & portfolio showcase", "Contact form, WhatsApp & call buttons", "Basic SEO setup for Google visibility", "Connected to your domain & business email"},
		Featured: true,
	},
	{
		Slug:     "mobile-app-development",
		Title:    "Mobile App Development",
		Icon:     "mobile",
		Summary:  "Android and iOS apps that put your business in your customers' pockets — designed, built and published for you.",
		Features: []string{"Android & iOS apps", "Clean, easy-to-use design", "Bookings, enquiries, catalogues & more", "Play Store & App Store publishing", "Admin panel to manage your content", "Updates & ongoing support"},
		Featured: true,
	},
	{
		Slug:     "social-media-marketing",
		Title:    "Social Media Setup & Marketing",
		Icon:     "instagram",
		Summary:  "Account setup, weekly maintenance and marketing. We create your official accounts and manage them every week — Instagram, Facebook, YouTube, Pinterest, X, Threads and LinkedIn.",
		Features: []string{"Account creation & complete branding", "Profile pictures, covers & descriptions", "4–5 posts every week with your branding", "Reels, video editing & festival posts", "Captions, hashtags & engagement support", "Monthly performance review meeting"},
		Featured: true,
	},
	{
		Slug:     "branding",
		Title:    "Branding Materials",
		Icon:     "branding",
		Summary:  "A consistent brand identity — from your logo to your business cards and letterhead.",
		Features: []string{"Company logo design", "Business card design", "Letterhead design", "Print-ready files for all"},
	},
	{
		Slug:     "email-domain-setup",
		Title:    "Business Email & Domain Setup",
		Icon:     "mail",
		Summary:  "Your own domain and professional email like name@yourbusiness.com — purchased, configured and ready on all your devices.",
		Features: []string{"Domain purchase & configuration", "Professional Gmail accounts on your domain", "Connected to your website", "Set up on your phone & computer"},
	},
	{
		Slug:     "digital-ledger",
		Title:    "Digital Ledger (Accounting)",
		Icon:     "ledger",
		Summary:  "A simple digital ledger to manage your business accounts — record, track and report from your computer or mobile.",
		Features: []string{"Record income, expenses, purchases & payments", "Track quotations, invoices & client details", "Monthly & annual reports", "Access from computer & mobile"},
	},
}

var packages = []Package{
	{
		ID: "digital-setup", Label: "Plan 1", Name: "Digital Setup Package", Price: 75000, Period: "one time", Billing: "One time",
		Tagline: "Everything your business needs to go digital — website, branding, email and all social accounts.",
		Groups: []FeatureGroup{
			{Title: "Website Development", Icon: "web", Items: []string{"Professional, modern website", "Mobile & tablet responsive design", "Showcase your projects, services & portfolio", "Contact form & enquiry setup", "SEO basic setup for better visibility"}},
			{Title: "Social Media Account Creation", Icon: "social", Items: []string{"Instagram, Facebook, YouTube, Pinterest, X & Threads", "Complete branding with your logo & details", "Login credentials for all accounts"}},
			{Title: "Account Setup & Configuration", Icon: "target", Items: []string{"Profile pictures, cover images & descriptions", "Linked with website & business email", "Initial optimisation & settings"}},
			{Title: "Ledger (Accounting Management)", Icon: "chart", Items: []string{"Digital ledger system for your business", "Record income, expenses, purchases & payments", "Track quotations, invoices & client details", "Monthly / annual reports, on computer & mobile"}},
			{Title: "Domain & Business Email", Icon: "mail", Items: []string{"Domain purchase & configuration", "Professional Gmail accounts on your domain", "Configured on your devices"}},
			{Title: "Branding Materials", Icon: "branding", Items: []string{"Company logo design", "Business card & letterhead design", "Print-ready files for all"}},
		},
		Notes: []string{"Domain charges extra (actual cost)"},
	},
	{
		ID: "social-maintenance", Label: "Plan 2", Name: "Social Media Maintenance Package", Price: 25000, Period: "per month", Billing: "Monthly", Popular: true,
		Tagline: "We manage all your social media platforms every week so your brand stays active, consistent and growing.",
		Groups: []FeatureGroup{
			{Title: "Platform Management", Icon: "users", Items: []string{"Manage all your social media platforms", "Design & post high-quality images and videos", "Weekly content planning & scheduling", "Consistent branding & engagement"}},
			{Title: "Weekly Posting Plan", Icon: "clock", Items: []string{"4 or 5 posts every week", "5 posts in weeks with events or holidays, 4 in regular weeks", "Mix of transformational & informative content", "2 posts from your own content (projects, events, site photos/videos)"}},
			{Title: "Content Includes", Icon: "instagram", Items: []string{"Project highlights, work videos & photos", "Educational & transformational content", "Festival & event posts with special messages", "Custom designs with your logo, captions & hashtags"}},
			{Title: "Ongoing Support", Icon: "chart", Items: []string{"Content planning & strategy", "Designing, video editing & posting", "Account monitoring & engagement support", "Monthly performance review + one review meeting every month"}},
		},
		Notes: []string{"Content needs to be provided by you for 2 days a week (2 posts — 1 video + 1 photo)"},
	},
}

var brands = []Brand{
	{Name: "VSN Interiors", Logo: "images/brands/vsn-interiors.webp", URL: "https://www.vsninteriors.in/"},
	{Name: "Kalki's InchX Interio", Logo: "images/brands/inchx-interio.png", URL: "https://inchxinterio.com/"},
	{Name: "Mirai", Logo: "images/brands/mirai.png", URL: "https://www.instagram.com/one.mirai/"},
}

var showcases = []Showcase{
	{
		Brand:   "Kalki's InchX Interio",
		Handle:  "inchxinterio",
		Profile: "https://www.instagram.com/inchxinterio/",
		Logo:    "images/brands/inchx-interio.png",
		Bio:     "Transforming spaces inch by inch. Homes, villas, offices, malls & showrooms — pan-India.",
		// Photo posts only, one per story highlight. Images are full-resolution
		// copies of the posts; tapping a story opens the post on Instagram.
		Posts: []InstagramPost{
			{Type: "p", Code: "De4EWu-FNS-", Label: "Living Room", Emoji: "🛋️", Image: "images/showcase/inchx-living-room.jpg"},
			{Type: "p", Code: "De1wX3Sn58O", Label: "Bedroom", Emoji: "🛏️", Image: "images/showcase/inchx-bedroom.jpg"},
			{Type: "p", Code: "Dej7jdqH5z3", Label: "Kitchen", Emoji: "🍳", Image: "images/showcase/inchx-kitchen.jpg"},
			{Type: "p", Code: "DeRtefoFFfk", Label: "Dining", Emoji: "🍽️", Image: "images/showcase/inchx-dining.jpg"},
			{Type: "p", Code: "DeuOHFqHzCu", Label: "Colour Themes", Emoji: "🎨", Image: "images/showcase/inchx-colour-themes.jpg"},
			{Type: "p", Code: "Deb9-EalLq3", Label: "Traditional & Modern", Emoji: "🏛️", Image: "images/showcase/inchx-traditional-modern.jpg"},
		},
	},
}

// Sample testimonials — replace with real client reviews before showing
// them on the site (the Testimonials section is currently not on any page).
var testimonials = []Testimonial{
	{Name: "Client Name", Role: "Business Owner", City: "Hyderabad", Rating: 5, Initials: "CN",
		Quote: "Replace this with a real review from one of your clients."},
}

var faqs = []FAQ{
	{Question: "What is included in the Digital Setup Package?",
		Answer: "A complete professional website, creation and setup of all your social media accounts (Instagram, Facebook, YouTube, Pinterest, X and Threads), domain and business email setup, a digital ledger for accounting, and branding materials — logo, business card and letterhead."},
	{Question: "Are domain charges included in the ₹75,000?",
		Answer: "No. The domain is purchased in your name and charged at actual cost, separately from the package price."},
	{Question: "How many posts do you publish every month?",
		Answer: "We post 4 or 5 times every week — 5 posts in weeks with festivals, events or holidays and 4 posts in regular weeks."},
	{Question: "What content do I need to provide?",
		Answer: "For 2 days a week we use your own content — 1 video and 1 photo from your projects, events or site. We create everything else: designs, festival posts, educational and informative content."},
	{Question: "Do we get a performance report?",
		Answer: "Yes. Every month you receive a performance review with basic insights, plus one review meeting to plan the next month."},
	{Question: "Which areas do you serve?",
		Answer: "We serve businesses across Andhra Pradesh & Telangana and are expanding all over India — working with clients over WhatsApp, phone and video calls."},
}
