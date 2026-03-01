# Quick Start - Admin Panel Setup

**5 steps to get your admin panel running.**

---

## 1. Create accounts

- [Neon](https://neon.tech) - Create a project, copy the connection string
- [Uploadthing](https://uploadthing.com) - Create an app, copy the API token

## 2. Configure environment

Create `.env.local`:

```env
DATABASE_URL=your-neon-connection-string
AUTH_SECRET=run-npx-auth-secret-to-generate
ADMIN_EMAIL=admin@formastudio.in
ADMIN_PASSWORD=your-password
UPLOADTHING_TOKEN=your-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Set up database

```bash
npm run db:push
npm run db:seed
npm run db:seed-admin
```

## 4. Start dev server

```bash
npm run dev
```

## 5. Login

Go to `http://localhost:3000/login` and sign in with your admin credentials.

---

For detailed setup, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).
