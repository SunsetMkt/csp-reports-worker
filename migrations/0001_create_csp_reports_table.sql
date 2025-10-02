-- Migration: Create csp_reports table
-- This table stores CSP violation reports

CREATE TABLE IF NOT EXISTS csp_reports (
  id TEXT PRIMARY KEY,
  report_data TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Create index on created_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS idx_created_at ON csp_reports(created_at);
