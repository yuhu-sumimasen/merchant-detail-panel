import type { Request, Response } from "express";

export async function handleTrigger(req: Request, res: Response) {
  try {
    const { merchantId } = req.body;

    if (!merchantId) {
      return res.status(400).json({ error: "merchantId is required" });
    }

    await fetch(process.env.N8N_WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId,
        source: "internal-admin-panel",
        triggeredAt: new Date().toISOString(),
      }),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to trigger n8n:", error);
    return res.status(500).json({ error: "Failed to trigger workflow" });
  }
}
