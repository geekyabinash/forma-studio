# Database Scripts

## Files

- **seed.ts** - Populate database with static data from `src/data/`
- **seed-admin.ts** - Create admin user with hashed password

## Usage

```bash
# Seed initial data (services, positions, benefits, values)
npx tsx scripts/seed.ts

# Create admin user
npx tsx scripts/seed-admin.ts
```

Requires `DATABASE_URL` in `.env.local`.
