// URL pública de tu API en Render
const API_BASE = "https://clickcounterapi.onrender.com";

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/api/stats`, { cache: "no-store" });
    const data = await res.json();
    const li = document.getElementById("countLinkedIn");
    const gh = document.getElementById("countGitHub");
    if (li) li.textContent = data.linkedin ?? 0;
    if (gh) gh.textContent = data.github ?? 0;
  } catch (e) {
    console.warn("[stats] no se pudieron cargar:", e);
  }
}

function trackAndGo(target, url) {
  const endpoint = `${API_BASE}/api/track/${encodeURIComponent(target)}`;

  // Enviar sin bloquear la navegación
  fetch(endpoint, { method: "POST", keepalive: true }).catch(() => {});

  // Pequeño delay para que el backend procese, luego abrir y refrescar
  setTimeout(() => {
    window.open(url, "_blank", "noopener");
    loadStats();
  }, 150);
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();

  // Delegación: cuenta cualquier <a data-track="...">
  document.body.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[data-track]');
    if (!a) return;
    ev.preventDefault();
    const target = a.getAttribute('data-track'); // "github" o "linkedin"
    trackAndGo(target, a.href);
  });

  // (Opcional) refrescar cada 15s
  setInterval(loadStats, 15000);
});
