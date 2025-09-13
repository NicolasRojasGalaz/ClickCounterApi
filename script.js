// ⚠️ Ajusta esta URL al puerto/URL real de tu API
const API_BASE = "https://clickcounterapi.onrender.com";cd
//const API_BASE = "http://localhost:5084";
//const API_BASE = "https://localhost:7082";

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
    const data = await res.json();
    document.getElementById("countLinkedIn").textContent = data.linkedin ?? 0;
    document.getElementById("countGitHub").textContent = data.github ?? 0;
  } catch (e) {
    console.warn("[stats] no se pudieron cargar:", e);
  }
}

function trackAndGo(target, url) {
  const endpoint = `${API_BASE}/api/track/${encodeURIComponent(target)}`;

  // 1) abrir el enlace inmediatamente (evita bloqueos)
  window.open(url, "_blank", "noopener");

  // 2) intentar con sendBeacon (enviar SIEMPRE algún cuerpo)
  const payload = new Blob([], { type: "text/plain" });
  const ok = navigator.sendBeacon(endpoint, payload);

  // 3) fallback con fetch keepalive
  if (!ok) {
    fetch(endpoint, { method: "POST", keepalive: true }).catch(() => {});
  }

  // 4) refrescar contadores tras un breve delay
  setTimeout(loadStats, 200);
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();

  const btnLinkedIn = document.getElementById("btnLinkedIn");
  const btnGitHub   = document.getElementById("btnGitHub");

  if (btnLinkedIn) {
    btnLinkedIn.addEventListener("click", (ev) => {
      ev.preventDefault();
      trackAndGo("linkedin", btnLinkedIn.href);
    });
  }
  if (btnGitHub) {
    btnGitHub.addEventListener("click", (ev) => {
      ev.preventDefault();
      trackAndGo("github", btnGitHub.href);
    });
  }

  // opcional: auto-actualizar cada 15s
  setInterval(loadStats, 15000);
});
