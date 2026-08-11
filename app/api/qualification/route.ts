type RespostaDaPlanilha = {
  ok?: boolean;
  erro?: string;
  id?: string;
  score?: number;
};

/** Quando o Apps Script falha, devolve uma página HTML. Pega só a frase útil. */
function mensagemDoHtml(html: string): string {
  const alvos = [
    /max-width:600px[^>]*>([^<]{3,200})</,
    /class="errorMessage"[^>]*>([^<]{3,200})</,
    /<title>([^<]{3,120})<\/title>/,
  ];
  for (const alvo of alvos) {
    const achado = html.match(alvo);
    if (achado) return achado[1].trim();
  }
  return html.slice(0, 200);
}

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

    // O Apps Script responde 200 mesmo quando falha: em vez do JSON, devolve
    // uma página HTML ("Função de script não encontrada", "Não foi possível
    // abrir o arquivo"). Conferir só o status deixaria o candidato ver
    // "enviado com sucesso" sem nada ter sido gravado.
    const corpo = await response.text();
    let resultado: RespostaDaPlanilha | null = null;
    try {
      resultado = JSON.parse(corpo) as RespostaDaPlanilha;
    } catch {
      resultado = null;
    }

    if (!response.ok || resultado?.ok !== true) {
      console.error("Qualificação não foi gravada na planilha", {
        status: response.status,
        contentType: response.headers.get("content-type"),
        urlFinal: response.url,
        motivo: resultado?.erro ?? mensagemDoHtml(corpo),
      });
      return Response.json({ error: "Falha ao enviar a qualificação." }, { status: 502 });
    }

    return Response.json({ ok: true, id: resultado.id });
  } catch {
    return Response.json({ error: "Não foi possível processar o envio." }, { status: 500 });
  }
}
