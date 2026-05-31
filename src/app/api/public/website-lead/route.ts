import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_ALLOWED_ORIGINS = [
  'https://veneerdigital.co.za',
  'https://www.veneerdigital.co.za',
]

let _adminClient: SupabaseClient | null = null

function supabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    _adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }

  return _adminClient
}

function addOrigin(origins: Set<string>, value?: string) {
  if (!value) return

  const trimmed = value.trim().replace(/\/$/, '')
  if (!trimmed) return

  try {
    origins.add(new URL(trimmed).origin)
  } catch {
    console.warn('[website-lead] ignoring invalid allowed origin:', trimmed)
  }
}

function allowedOrigins(): Set<string> {
  const origins = new Set(DEFAULT_ALLOWED_ORIGINS)

  for (const origin of (process.env.WEBSITE_LEAD_ALLOWED_ORIGINS ?? '').split(',')) {
    addOrigin(origins, origin)
  }

  // Vercel supplies these automatically. Including them makes testing
  // from the active CRM deployment work without hardcoding its URL.
  addOrigin(origins, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
  addOrigin(
    origins,
    process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  )

  return origins
}

function corsHeaders(origin: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  }

  if (origin && allowedOrigins().has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  return headers
}

function json(
  origin: string | null,
  body: { ok: true; leadId: string } | { ok: false; error: string },
  status: number,
) {
  return Response.json(body, { status, headers: corsHeaders(origin) })
}

function isAllowedRequestOrigin(origin: string | null): boolean {
  // Keep server-to-server calls and local curl checks usable. Browser
  // cross-origin calls always send Origin and are restricted below.
  return !origin || allowedOrigins().has(origin)
}

function optionalString(
  body: Record<string, unknown>,
  field: string,
): string | null {
  const value = body[field]
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') throw new Error(`${field} must be a string`)

  const trimmed = value.trim()
  return trimmed || null
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin')

  if (!isAllowedRequestOrigin(origin)) {
    return json(origin, { ok: false, error: 'Origin not allowed' }, 403)
  }

  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')

  if (!isAllowedRequestOrigin(origin)) {
    return json(origin, { ok: false, error: 'Origin not allowed' }, 403)
  }

  let body: Record<string, unknown>
  try {
    const parsed: unknown = await request.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return json(origin, { ok: false, error: 'Request body must be a JSON object' }, 400)
    }
    body = parsed as Record<string, unknown>
  } catch {
    return json(origin, { ok: false, error: 'Invalid JSON body' }, 400)
  }

  try {
    const fullName = optionalString(body, 'fullName')
    const businessName = optionalString(body, 'businessName')
    const phone = optionalString(body, 'phone')
    const email = optionalString(body, 'email')
    const businessType = optionalString(body, 'businessType')
    const currentWebsite = optionalString(body, 'currentWebsite')
    const location = optionalString(body, 'location')
    const packageInterest = optionalString(body, 'packageInterest')
    const timeline = optionalString(body, 'timeline')
    const message = optionalString(body, 'message')
    const leadSource =
      optionalString(body, 'leadSource') ?? 'Veneer Digital Studio Website'
    const pipelineStage = optionalString(body, 'pipelineStage') ?? 'New Enquiry'
    const createdAt = optionalString(body, 'createdAt')

    if (!fullName) {
      return json(origin, { ok: false, error: 'fullName is required' }, 400)
    }
    if (!phone && !email) {
      return json(origin, { ok: false, error: 'phone or email is required' }, 400)
    }
    if (!message && !packageInterest) {
      return json(
        origin,
        { ok: false, error: 'message or packageInterest is required' },
        400,
      )
    }

    if (
      body.wantsWhatsappCrm !== undefined &&
      typeof body.wantsWhatsappCrm !== 'boolean'
    ) {
      return json(
        origin,
        { ok: false, error: 'wantsWhatsappCrm must be a boolean' },
        400,
      )
    }

    if (createdAt && Number.isNaN(Date.parse(createdAt))) {
      return json(origin, { ok: false, error: 'createdAt must be a valid date' }, 400)
    }

    const row = {
      full_name: fullName,
      business_name: businessName,
      phone,
      email,
      business_type: businessType,
      current_website: currentWebsite,
      location,
      package_interest: packageInterest,
      timeline,
      message,
      wants_whatsapp_crm: body.wantsWhatsappCrm ?? false,
      lead_source: leadSource,
      pipeline_stage: pipelineStage,
      ...(createdAt ? { created_at: new Date(createdAt).toISOString() } : {}),
    }

    const { data, error } = await supabaseAdmin()
      .from('website_leads')
      .insert(row)
      .select('id')
      .single()

    if (error || !data) {
      console.error('[website-lead] insert failed:', error)
      return json(origin, { ok: false, error: 'Failed to save website lead' }, 500)
    }

    // Future CRM automation hooks:
    // - create a CRM contact
    // - create a pipeline deal
    // - assign a stage
    // - trigger WhatsApp follow-up
    // - tag the lead by package interest

    return json(origin, { ok: true, leadId: data.id }, 201)
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('must be a string')) {
      return json(origin, { ok: false, error: error.message }, 400)
    }

    console.error('[website-lead] unexpected error:', error)
    return json(origin, { ok: false, error: 'Internal server error' }, 500)
  }
}
