-- ============================================================
-- 019_website_leads.sql
--
-- Stores public enquiries submitted by the Veneer Digital Studio
-- website. Inserts go through the server-only public API route, which
-- uses the Supabase service role. No browser client gets direct table
-- access.
--
-- Idempotent - safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS website_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  business_name TEXT,
  phone TEXT,
  email TEXT,
  business_type TEXT,
  current_website TEXT,
  location TEXT,
  package_interest TEXT,
  timeline TEXT,
  message TEXT,
  wants_whatsapp_crm BOOLEAN DEFAULT FALSE,
  lead_source TEXT DEFAULT 'Veneer Digital Studio Website',
  pipeline_stage TEXT DEFAULT 'New Enquiry',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE website_leads ENABLE ROW LEVEL SECURITY;

-- Intentionally no anon or authenticated policies. Public submissions
-- are accepted only by the server route using SUPABASE_SERVICE_ROLE_KEY.

