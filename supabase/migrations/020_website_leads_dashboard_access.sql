-- ============================================================
-- 020_website_leads_dashboard_access.sql
--
-- Lets authenticated CRM users view website enquiries and move them
-- through the small dashboard status workflow. Public submissions still
-- go through the service-role API route from migration 019.
--
-- UPDATE is column-scoped: dashboard users may change `status`, but not
-- rewrite the submitted lead details.
--
-- Idempotent - safe to re-run.
-- ============================================================

DROP POLICY IF EXISTS website_leads_select_authenticated ON website_leads;
CREATE POLICY website_leads_select_authenticated
  ON website_leads FOR SELECT
  TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS website_leads_update_authenticated ON website_leads;
CREATE POLICY website_leads_update_authenticated
  ON website_leads FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

REVOKE ALL ON TABLE website_leads FROM anon;
REVOKE UPDATE ON TABLE website_leads FROM authenticated;
GRANT SELECT ON TABLE website_leads TO authenticated;
GRANT UPDATE (status) ON TABLE website_leads TO authenticated;

