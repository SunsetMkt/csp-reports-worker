# csp-reports-worker
Cloudflare worker to collect CSP reports using D1 database.

## Setup

### 1. Create a D1 Database

```bash
wrangler d1 create csp-reports
```

This will output a database ID. Copy it and update the `database_id` in `wrangler.toml`.

### 2. Run Migrations

Apply the database schema:

```bash
wrangler d1 execute csp-reports --file=./migrations/0001_create_csp_reports_table.sql
```

For local development:

```bash
wrangler d1 execute csp-reports --local --file=./migrations/0001_create_csp_reports_table.sql
```

### 3. Deploy

```bash
wrangler deploy
```

## Usage

POST CSP violation reports to `/csp-reports` endpoint:

```bash
curl -X POST https://your-worker.workers.dev/csp-reports \
  -H "Content-Type: application/json" \
  -d '{"type": "csp-violation", "body": {...}}'
```

## Database Schema

The worker stores reports in the `csp_reports` table:

- `id`: Unique identifier (UUID-timestamp combination)
- `report_data`: JSON string of the CSP report
- `created_at`: Timestamp when the report was stored

