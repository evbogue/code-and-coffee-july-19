const PORT = Number(Deno.env.get("PORT") ?? 8111);
const HOST = Deno.env.get("HOST") ?? "127.0.0.1";

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function qrPage(target: string, embed: boolean): string {
  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QR code</title>
<style>
  body { margin:0; min-height:100vh; display:flex; flex-direction:column; align-items:center;
    justify-content:center; gap:10px; overflow:hidden; background:#272822; color:#f8f8f2;
    font-family:system-ui,sans-serif; }
  canvas { image-rendering:pixelated; width:min(72vw,480px); height:min(72vw,480px); border-radius:8px; }
  body.embed { min-height:0; height:100vh; }
  body.embed canvas { width:min(72vw,220px); height:min(72vw,220px); }
  p { margin:0; max-width:95vw; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
</style>
<body class="${embed ? "embed" : ""}">
<canvas id="qr"></canvas>
<p id="url"></p>
<script type="module">
  const target = ${JSON.stringify(target)};
  document.getElementById("url").textContent = target;
  const { generate } = await import("https://esm.sh/lean-qr@2");
  generate(target).toCanvas(document.getElementById("qr"), {
    on: [248, 248, 242, 255], off: [39, 40, 34, 255],
  });
</script>`;
}

Deno.serve({ hostname: HOST, port: PORT }, async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/qr") {
    let target = url.searchParams.get("wifi") === "1"
      ? "WIFI:T:WPA;S:CIC Guest;P:1nnovation;;"
      : url.searchParams.get("url") ?? "";
    if (target !== "WIFI:T:WPA;S:CIC Guest;P:1nnovation;;") {
      try {
        const parsed = new URL(target);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          target = "";
        }
      } catch {
        target = "";
      }
    }
    if (!target) return new Response("invalid QR target", { status: 400 });
    return new Response(qrPage(target, url.searchParams.get("embed") === "1"), {
      headers: { "content-type": MIME[".html"] },
    });
  }

  const requested = url.pathname === "/" ? "/code-coffee.html" : url.pathname;
  if (
    requested.includes("..") ||
    !/^\/(code-coffee\.(html|css)|people\/[a-z0-9._-]+)$/i.test(requested)
  ) {
    return new Response("not found", { status: 404 });
  }
  try {
    const data = await Deno.readFile(new URL(`.${requested}`, import.meta.url));
    const extension = requested.slice(requested.lastIndexOf(".")).toLowerCase();
    return new Response(data, {
      headers: {
        "content-type": MIME[extension] ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
});

console.log(`Code & Coffee slides running on http://${HOST}:${PORT}`);
