import type { Request, Response } from "express";

export async function handleTrigger(req, res) {
  try {
    const { merchantId } = req.body;

    console.log("Trigger called with:", merchantId);
    console.log("N8N URL:", process.env.N8N_WEBHOOK_URL);

    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ merchantId }),
    });

    console.log("N8N response status:", response.status);

    const text = await response.text();
    console.log("N8N response body:", text);

    res.json({ success: true });
  } catch (err) {
    console.error("Trigger error:", err);
    res.status(500).json({ error: "Failed to trigger n8n" });
  }
}
