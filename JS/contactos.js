/* ============================================================
   GRINGAS VERSE — contactos.js
   El burger y el carrito ahora los maneja JS/carrito-header.js.
   Este archivo solo conserva el toast propio y el formulario
   de contacto.
============================================================ */

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(80px)';
  }, 2400);
}

// ── Formulario ──
function enviarForm() {
  const n = document.getElementById('nombre').value.trim();
  const e = document.getElementById('email').value.trim();
  const m = document.getElementById('mensaje').value.trim();
  if (!n || !e || !m) { showToast('⚠️ Por favor completa todos los campos'); return; }
  showToast('✉️ ¡Mensaje enviado! Te contactamos pronto 🙌');
  document.getElementById('nombre').value  = '';
  document.getElementById('email').value   = '';
  document.getElementById('mensaje').value = '';
}
