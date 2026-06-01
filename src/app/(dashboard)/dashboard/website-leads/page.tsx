"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Archive,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Loader2,
  MessageSquareText,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const LEAD_STATUSES = ["new", "contacted", "qualified", "archived"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

interface WebsiteLead {
  id: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  business_type: string | null;
  current_website: string | null;
  location: string | null;
  package_interest: string | null;
  timeline: string | null;
  message: string | null;
  wants_whatsapp_crm: boolean;
  lead_source: string | null;
  pipeline_stage: string | null;
  status: string;
  created_at: string;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  contacted: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  qualified: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  archived: "border-slate-600 bg-slate-800 text-slate-400",
};

function normalizeStatus(status: string): LeadStatus {
  return LEAD_STATUSES.includes(status as LeadStatus)
    ? (status as LeadStatus)
    : "new";
}

function cleanWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = `27${cleaned.slice(1)}`;
  return cleaned;
}

function valueOrDash(value: string | null) {
  return value || <span className="text-slate-600">-</span>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-300">{children}</dd>
    </div>
  );
}

export default function WebsiteLeadsPage() {
  const supabase = createClient();
  const [leads, setLeads] = useState<WebsiteLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<WebsiteLead | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("website_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[website-leads] fetch failed:", error);
      toast.error("Failed to load website leads");
    } else {
      setLeads((data ?? []) as WebsiteLead[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (!term) return true;

      return [
        lead.full_name,
        lead.business_name,
        lead.phone,
        lead.email,
        lead.package_interest,
      ].some((value) => value?.toLowerCase().includes(term));
    });
  }, [leads, search, statusFilter]);

  async function updateStatus(lead: WebsiteLead, status: LeadStatus) {
    setUpdatingLeadId(lead.id);
    const { error } = await supabase
      .from("website_leads")
      .update({ status })
      .eq("id", lead.id);

    if (error) {
      console.error("[website-leads] status update failed:", error);
      toast.error("Failed to update lead status");
    } else {
      setLeads((current) =>
        current.map((item) => (item.id === lead.id ? { ...item, status } : item)),
      );
      setSelectedLead((current) =>
        current?.id === lead.id ? { ...current, status } : current,
      );
      toast.success(`Lead marked ${status}`);
    }
    setUpdatingLeadId(null);
  }

  async function copyPhone(phone: string | null) {
    if (!phone) {
      toast.error("This lead does not have a phone number");
      return;
    }

    await navigator.clipboard.writeText(phone);
    toast.success("Phone number copied");
  }

  function openWhatsApp(phone: string | null) {
    if (!phone) {
      toast.error("This lead does not have a phone number");
      return;
    }

    const cleaned = cleanWhatsAppPhone(phone);
    if (!cleaned) {
      toast.error("This lead does not have a valid phone number");
      return;
    }

    window.open(`https://wa.me/${cleaned}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Website Leads</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enquiries submitted through the Veneer Digital Studio website.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, business, phone, email, or package..."
            className="border-slate-700 bg-slate-900 pl-8 text-white placeholder:text-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-slate-300 outline-none focus:border-primary"
          aria-label="Filter leads by status"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
          <MessageSquareText className="mb-3 size-10 text-slate-600" />
          <p className="text-sm font-medium text-white">No website leads found</p>
          <p className="mt-1 text-xs text-slate-400">
            New website enquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredLeads.map((lead) => {
            const status = normalizeStatus(lead.status);
            const isUpdating = updatingLeadId === lead.id;

            return (
              <article
                key={lead.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-white">
                      {lead.full_name || "Unnamed lead"}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-400">
                      {lead.business_name || "No business name"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
                  >
                    {status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Phone">{valueOrDash(lead.phone)}</Field>
                  <Field label="Email">{valueOrDash(lead.email)}</Field>
                  <Field label="Business Type">{valueOrDash(lead.business_type)}</Field>
                  <Field label="Location">{valueOrDash(lead.location)}</Field>
                  <Field label="Package">{valueOrDash(lead.package_interest)}</Field>
                  <Field label="Timeline">{valueOrDash(lead.timeline)}</Field>
                  <Field label="Current Website">{valueOrDash(lead.current_website)}</Field>
                  <Field label="WhatsApp CRM">
                    {lead.wants_whatsapp_crm ? "Interested" : "Not requested"}
                  </Field>
                  <Field label="Lead Source">{valueOrDash(lead.lead_source)}</Field>
                  <Field label="Pipeline Stage">{valueOrDash(lead.pipeline_stage)}</Field>
                  <Field label="Created">
                    {new Date(lead.created_at).toLocaleString()}
                  </Field>
                </dl>

                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <p className="line-clamp-2 text-sm text-slate-300">
                    {lead.message || "No message provided."}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                    className="mt-1 h-auto px-0 text-primary"
                  >
                    View details
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => updateStatus(lead, "contacted")}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Mark Contacted
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => updateStatus(lead, "qualified")}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <CheckCircle2 className="size-3.5" />
                    Mark Qualified
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => updateStatus(lead, "archived")}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Archive className="size-3.5" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyPhone(lead.phone)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <Clipboard className="size-3.5" />
                    Copy Phone
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openWhatsApp(lead.phone)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <ExternalLink className="size-3.5" />
                    Open WhatsApp
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={selectedLead !== null} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="border-slate-700 bg-slate-900 text-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedLead?.full_name || "Website lead"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedLead?.business_name || "Veneer Digital Studio website enquiry"}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
              {selectedLead?.message || "No message provided."}
            </p>
          </div>
          <DialogFooter className="border-slate-700 bg-slate-900">
            <Button
              variant="outline"
              onClick={() => setSelectedLead(null)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

