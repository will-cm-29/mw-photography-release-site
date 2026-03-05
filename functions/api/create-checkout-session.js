export async function onRequestPost(context) {
    try {
        const STRIPE_SECRET_KEY = context.env.STRIPE_SECRET_KEY;
        const SITE_URL = context.env.SITE_URL; // e.g. https://www.mw-photography.co.uk

        if (!STRIPE_SECRET_KEY) {
            return json({ ok: false, error: "Stripe secret key not configured." }, 500);
        }
        if (!SITE_URL) {
            return json({ ok: false, error: "SITE_URL not configured." }, 500);
        }

        const body = await context.request.json();

        // You can customise this logic:
        // mode "deposit" charges a fixed booking deposit.
        const mode = String(body.mode || "deposit");
        const selectedPackage = String(body.selectedPackage || "Photography Booking");
        const estimate = Number(body.estimate || 0);

        // Safer backend-controlled pricing:
        // Example fixed deposit (recommended)
        let amountInPence = 5000; // £50 deposit

        // Optional: if you later want full payment from package, validate server-side and set amountInPence here.
        if (mode === "deposit") {
            amountInPence = 5000; // £50 deposit
        }

        // Optional metadata for your records
        const metadata = {
            selectedPackage: selectedPackage.slice(0, 500),
            estimate: String(estimate || ""),
            propertyType: String(body.propertyType || "").slice(0, 100),
            sizeBand: String(body.sizeBand || "").slice(0, 100)
        };

        // Stripe Checkout Session via REST API
        const form = new URLSearchParams();
        form.set("mode", "payment");
        form.set("success_url", `${SITE_URL}/?payment=success`);
        form.set("cancel_url", `${SITE_URL}/?payment=cancel`);

        form.set("line_items[0][price_data][currency]", "gbp");
        form.set("line_items[0][price_data][product_data][name]", "MW Photography Booking Deposit");
        form.set("line_items[0][price_data][product_data][description]", `Deposit for ${selectedPackage}`);
        form.set("line_items[0][price_data][unit_amount]", String(amountInPence));
        form.set("line_items[0][quantity]", "1");

        for (const [key, value] of Object.entries(metadata)) {
            form.set(`metadata[${key}]`, value);
        }

        const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: form
        });

        const stripeData = await stripeRes.json();

        if (!stripeRes.ok) {
            console.error("Stripe error:", stripeData);
            return json({ ok: false, error: stripeData?.error?.message || "Stripe session creation failed." }, 500);
        }

        return json({
            ok: true,
            id: stripeData.id,
            url: stripeData.url
        });
    } catch (err) {
        console.error(err);
        return json({ ok: false, error: "Could not create checkout session." }, 500);
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