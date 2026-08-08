export async function POST(request: Request) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  try {
    const payload = await request.json();
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!response.ok) {
      return Response.json({ error: "Falha ao enviar a qualificação." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Não foi possível processar o envio." }, { status: 500 });
  }
}
