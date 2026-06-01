export interface VdsAutomationPlanningTemplate {
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  message: string;
  tags: string[];
  pipelineMovement: string;
}

export const VDS_AUTOMATION_PLANNING_TEMPLATES: VdsAutomationPlanningTemplate[] =
  [
    {
      name: "New Website Enquiry Follow-Up",
      trigger: "A new website enquiry is captured.",
      conditions: [
        "Lead source is Veneer Digital Studio Website.",
        "A valid phone number is available before sending WhatsApp.",
      ],
      actions: [
        "Review the enquiry details.",
        "Assign an owner for personal follow-up.",
        "Prepare a WhatsApp acknowledgement after approval.",
      ],
      message:
        "Hi {{fullName}}, thanks for contacting Veneer Digital Studio. We received your enquiry and will review the details shortly. Is there anything else you would like us to know before we get in touch?",
      tags: ["Website Enquiry", "Needs Follow-Up"],
      pipelineMovement: "New Enquiry -> Discovery Needed",
    },
    {
      name: "Kitchen Remodeller Lead Qualification",
      trigger: "A lead is tagged as a kitchen renovation enquiry.",
      conditions: [
        "Business or project type relates to kitchen renovation.",
        "The lead still needs scope, location, or timeline details.",
      ],
      actions: [
        "Ask for the project location.",
        "Ask whether measurements or inspiration images are available.",
        "Route the lead for a discovery call after qualification.",
      ],
      message:
        "Hi {{fullName}}, thanks for your kitchen renovation enquiry. To help us understand the project, could you share your location, ideal timeline, and whether you already have measurements or inspiration images?",
      tags: ["Kitchen Renovation", "Qualification Needed"],
      pipelineMovement: "Discovery Needed -> Quote Requested",
    },
    {
      name: "Quote Sent Follow-Up",
      trigger: "An opportunity moves to Quote Sent.",
      conditions: [
        "A quote has been sent to the client.",
        "No reply has been recorded after the chosen follow-up period.",
      ],
      actions: [
        "Wait for the agreed follow-up period.",
        "Send a polite WhatsApp check-in after manual approval.",
        "Flag the opportunity for personal follow-up if there is no reply.",
      ],
      message:
        "Hi {{fullName}}, just checking that you received the quote from Veneer Digital Studio. I am happy to answer any questions or talk through the next steps with you.",
      tags: ["Quote Sent", "Follow-Up Needed"],
      pipelineMovement: "Quote Sent -> Follow-Up Needed",
    },
    {
      name: "Cold Lead Reactivation",
      trigger: "A lead has had no response for the chosen reactivation period.",
      conditions: [
        "The lead is not archived.",
        "The client has not opted out of follow-up.",
      ],
      actions: [
        "Review the previous conversation.",
        "Confirm that reactivation is appropriate.",
        "Send one low-pressure follow-up after manual approval.",
      ],
      message:
        "Hi {{fullName}}, I wanted to check whether your project is still on the horizon. If the timing has changed, no problem at all. We are here when you are ready.",
      tags: ["Cold Lead", "Reactivation"],
      pipelineMovement: "Follow-Up Needed -> Discovery Needed, if the lead replies",
    },
    {
      name: "Review Request After Project Completion",
      trigger: "A completed project is ready for a review request.",
      conditions: [
        "The client has confirmed that the project is complete.",
        "A team member has approved the review request.",
      ],
      actions: [
        "Send a thank-you message.",
        "Share the approved review link when integrations are configured.",
        "Tag the lead so duplicate requests are avoided.",
      ],
      message:
        "Hi {{fullName}}, thank you for trusting Veneer Digital Studio with your project. If you have a moment, we would really appreciate your feedback. It helps future clients understand what it is like to work with us.",
      tags: ["Project Complete", "Review Requested"],
      pipelineMovement: "No automatic movement. Confirm project completion manually.",
    },
  ];
