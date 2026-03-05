export async function onRequestPost(context) {
    try {
        const body = await context.request.json();

        // Basic honeypot
        if (body["bot-field"]) {
            return json({ ok: false, error: "Spam blocked." }, 400);
        }

        const required = ["name", "email", "message"];
        for (const field of required) {
            if (!String(body[field] || "").trim()) {
                return json({ ok: false, error: `Missing required field: ${field}` }, 400);
            }
        }

        const email = String(body.email || "").trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return json({ ok: false, error: "Invalid email address." }, 400);
        }

        // Build clean submission object
        const submission = {
            receivedAt: new Date().toISOString(),
            name: String(body.name || "").trim(),
            email,
            phone: String(body.phone || "").trim(),
            propertyArea: String(body.propertyArea || "").trim(),
            propertyType: String(body.propertyType || "").trim(),
            timeframe: String(body.timeframe || "").trim(),
            servicesRequired: String(body.servicesRequired || "").trim(),
            selectedPackage: String(body.selectedPackage || "").trim(),
            quoteEstimate: String(body.quoteEstimate || "").trim(),
            selectedServicesJson: String(body.selectedServicesJson || "").trim(),
            message: String(body.message || "").trim()
        };

        // TODO (recommended next step): send email via Resend / Mailgun / Postmark
        // Example:
        // const RESEND_API_KEY = context.env.RESEND_API_KEY;
        // if (RESEND_API_KEY) { ...send email... }

        // For now: log to Cloudflare function logs (visible in dashboard)
        console.log("Contact submission:", submission);

        return json({ ok: true, message: "Enquiry received." }, 200);
    } catch (err) {
        return json({ ok: false, error: "Invalid request body." }, 400);
    }
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8"
        }
    });
}