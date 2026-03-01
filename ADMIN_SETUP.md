# Forma Studio Admin Panel - Setup Guide

Complete guide to set up the admin CMS panel with Neon PostgreSQL, NextAuth, and Uploadthing.

---

## Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- An [Uploadthing](https://uploadthing.com) account
- A Gmail account (for password reset & MFA emails)

---

## 1. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

---

## 2. Create Uploadthing App

1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy the API token from settings

---

## 3. Set Up Gmail SMTP

Gmail is used to send password reset links and MFA verification codes.

1. Use or create a Gmail account for sending admin emails
2. Enable 2-Step Verification on the Gmail account:
   - Go to [myaccount.google.com/security](https://myaccount.google.com/security)
   - Under "Signing in to Google", enable **2-Step Verification**
3. Generate an App Password:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select app: **Mail**, device: **Other** (enter "Forma Studio")
   - Click **Generate**
   - Copy the 16-character password (formatted as `xxxx xxxx xxxx xxxx`)
4. You'll use the Gmail address and app password in your `.env.local`

---

## 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Auth (NextAuth.js)
AUTH_SECRET=generate-a-random-32-char-secret

# Admin Credentials (used only during initial seed)
ADMIN_EMAIL=admin@formastudio.in
ADMIN_PASSWORD=your-secure-password

# Uploadthing
UPLOADTHING_TOKEN=your-uploadthing-token

# Gmail SMTP (for password reset & MFA emails)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Encryption key for MFA secrets (64-character hex string)
ENCRYPTION_KEY=generate-using-command-below

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

Generate `ENCRYPTION_KEY` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 5. Set Up Database

```bash
# Push schema to Neon
npm run db:push

# Seed with initial data
npm run db:seed

# Create admin user
npm run db:seed-admin
```

---

## 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/login` and sign in with your admin credentials.

---

## Admin Features

- **Dashboard** (`/admin`) - Overview stats and quick actions
- **Projects** (`/admin/projects`) - Manage portfolio projects (CRUD)
- **Services** (`/admin/services`) - Manage architecture services (CRUD)
- **Careers** (`/admin/careers`) - Manage job positions, benefits, and values
- **Gallery** (`/admin/gallery`) - Upload and manage project images
- **Inbox** (`/admin/inbox`) - View contact form submissions and career applications
- **About** (`/admin/about`) - Edit about page content
- **Contact** (`/admin/contact`) - Update contact information
- **Settings** (`/admin/settings`) - Change password and manage MFA

---

## Security Features

### Change Password

1. Go to **Settings** in the admin sidebar
2. Enter your current password, then your new password
3. Password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number

### Forgot Password

1. On the login page, click **"Forgot password?"**
2. Enter your admin email address
3. Check your Gmail inbox for a reset link (expires in 1 hour)
4. Click the link and set a new password

### Two-Factor Authentication (MFA)

MFA adds a second verification step when signing in. Two methods are available:

**Email OTP:**
1. Go to **Settings** > **Two-Factor Authentication**
2. Click **Enable**, then choose **Email Verification**
3. Enter the 6-digit code sent to your admin email
4. Save the 8 backup codes shown (one-time display)

**Authenticator App (TOTP):**
1. Go to **Settings** > **Two-Factor Authentication**
2. Click **Enable**, then choose **Authenticator App**
3. Scan the QR code with Google Authenticator (or any TOTP app)
4. Enter the 6-digit code from the app to verify
5. Save the 8 backup codes shown (one-time display)

**Backup Codes:**
- 8 single-use backup codes are generated when MFA is enabled
- Use a backup code if you lose access to your email or authenticator app
- Each code can only be used once
- Store them somewhere safe — they are shown only once during setup

**Disable MFA:**
- Go to **Settings**, click **Disable Two-Factor Authentication**, and confirm with your password

---

## Database Management

```bash
npm run db:generate   # Generate migration files
npm run db:push       # Push schema changes to database
npm run db:studio     # Open Drizzle Studio (visual DB browser)
npm run db:seed       # Seed initial data
npm run db:seed-admin # Create/reset admin user
```

---

## Tech Stack

- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5 (Credentials + JWT + MFA)
- **Email**: Nodemailer (Gmail SMTP)
- **File Storage**: Uploadthing
- **Validation**: Zod
- **UI**: Tailwind CSS, Lucide Icons, Sonner (toasts)
