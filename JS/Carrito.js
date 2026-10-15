/* ====== CONFIG ====== */
const CONFIG = {
  moneda:           '$',
  emailjsPublicKey: 'i9wNPC1s1HG3lpqbi',
  emailjsServiceID: 'service_o9z44cr',
  emailjsTemplateID:'template_y2yxpep',
};

(function () {
  if (typeof emailjs !== 'undefined') emailjs.init(CONFIG.emailjsPublicKey);
})();

/* ====== ESTADO ====== */
const STORAGE_KEY = 'gringas_carrito';
let carrito = [];

const PRODUCT_INFO = {
  'la-ternerita':      { emoji: '🌮', grad: 'g1' },
  'la-chicken-little': { emoji: '🍗', grad: 'g2' },
  'la-bipolar':        { emoji: '🧀', grad: 'g3' },
  'tu-gringa-ideal':   { emoji: '✨', grad: 'g4' },
  'jamaica':           { emoji: '🌺', grad: 'b1' },
  'tamarindo':         { emoji: '🥤', grad: 'b2' },
};

function getVisual(id) {
  return PRODUCT_INFO[id] || { emoji: '🍽️', grad: 'g1' };
}

/* ====== PERSISTENCIA ====== */
function guardarCarrito() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}
function cargarCarrito() {
  try { const d = localStorage.getItem(STORAGE_KEY); carrito = d ? JSON.parse(d) : []; }
  catch (e) { carrito = []; }
  actualizarVistaCarrito();
}

/* ====== OPERACIONES ====== */
function agregarAlCarrito(id, nombre, precio) {
  const ex = carrito.find(i => i.id === id);
  if (ex) { ex.cantidad++; }
  else     { carrito.push({ id, nombre, precio: parseFloat(precio), cantidad: 1 }); }
  guardarCarrito();
  actualizarVistaCarrito();
  mostrarNotificacion(`${nombre} añadido ✓`);
  animarContador();
}

function addToCart(nombre, precio) {
  const id = nombre
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  agregarAlCarrito(id, nombre, precio);
}

function quitarUnoDelCarrito(id) {
  const idx = carrito.findIndex(i => i.id === id);
  if (idx === -1) return;
  if (carrito[idx].cantidad > 1) carrito[idx].cantidad--;
  else carrito.splice(idx, 1);
  guardarCarrito();
  actualizarVistaCarrito();
}

function eliminarProductoCompleto(id) {
  carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  actualizarVistaCarrito();
}

function calcularTotal()  { return carrito.reduce((t,i) => t + i.precio * i.cantidad, 0); }
function totalArticulos() { return carrito.reduce((s,i) => s + i.cantidad, 0); }

/* ====== ACTUALIZAR UI ====== */
function actualizarVistaCarrito() {
  actualizarContadorHeader();
  actualizarModalCarrito();
  renderizarPaginaCarrito();
}

function actualizarContadorHeader() {
  const n = totalArticulos();
  document.querySelectorAll('#cartCount,#cartCountMobile').forEach(el => { if(el) el.textContent = n; });
}

function animarContador() {
  document.querySelectorAll('#cartCount,#cartCountMobile').forEach(el => {
    if (!el) return;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 200);
  });
}

/* ====== MODAL ====== */
function actualizarModalCarrito() {
  const lista    = document.getElementById('listaCarrito');
  const totalEl  = document.getElementById('totalCarrito');
  const btnPagar = document.getElementById('btnPagar');
  if (!lista) return;

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="modal-vacio">Tu carrito está vacío 🛒</li>`;
    if (totalEl)  totalEl.textContent = `${CONFIG.moneda}0.00`;
    if (btnPagar) btnPagar.disabled   = true;
    return;
  }
  if (btnPagar) btnPagar.disabled = false;

  lista.innerHTML = carrito.map(item => {
    const vis = getVisual(item.id);
    const sub = (item.precio * item.cantidad).toFixed(2);
    return `<li class="modal-item-simple">
      <div>
        <div class="modal-item-nombre">${vis.emoji} ${item.nombre}</div>
        <div class="modal-item-detalle">×${item.cantidad} · ${CONFIG.moneda}${item.precio.toFixed(2)} c/u</div>
      </div>
      <span class="modal-item-sub">${CONFIG.moneda}${sub}</span>
    </li>`;
  }).join('');

  if (totalEl) totalEl.textContent = `${CONFIG.moneda}${calcularTotal().toFixed(2)}`;
}

function abrirModalCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) { modal.classList.add('open'); actualizarModalCarrito(); }
}
function cerrarModalCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) modal.classList.remove('open');
}

/* ====== RENDER CARRITO ====== */
function renderizarPaginaCarrito() {
  const vacioEl  = document.getElementById('carritoVacioState');
  const itemsEl  = document.getElementById('carritoItemsState');
  const gridEl   = document.getElementById('carritoGrid');
  const totalEl  = document.getElementById('carritoTotalPage');
  const checkout = document.getElementById('checkoutPage');
  if (!vacioEl || !itemsEl) return;

  if (carrito.length === 0) {
    vacioEl.classList.add('visible');
    itemsEl.classList.remove('visible');
    return;
  }

  vacioEl.classList.remove('visible');
  itemsEl.classList.add('visible');
  if (checkout) checkout.classList.remove('visible');
  const msgEl = document.getElementById('mensajeEnvio');
  if (msgEl) msgEl.textContent = '';

  if (gridEl) {
    gridEl.innerHTML = carrito.map(item => {
      const vis   = getVisual(item.id);
      const total = (item.precio * item.cantidad).toFixed(2);
      return `
      <div class="cc-card">
        <div class="cc-img ${vis.grad}">${vis.emoji}</div>
        <div class="cc-info">
          <div class="cc-top-row">
            <span class="cc-nombre">${item.nombre}</span>
            <span class="cc-cantidad">×${item.cantidad}</span>
          </div>
          <div class="cc-bot-row">
            <span class="cc-precio">${CONFIG.moneda}${total}</span>
            <div class="cc-acciones">
              <button class="cc-btn cc-btn-menos" data-id="${item.id}">− Uno</button>
              <button class="cc-btn cc-btn-todo"  data-id="${item.id}">🗑️ Todo</button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    gridEl.querySelectorAll('.cc-btn-menos').forEach(b =>
      b.addEventListener('click', () => quitarUnoDelCarrito(b.dataset.id)));
    gridEl.querySelectorAll('.cc-btn-todo').forEach(b =>
      b.addEventListener('click', () => eliminarProductoCompleto(b.dataset.id)));
  }

  if (totalEl) totalEl.textContent = `${CONFIG.moneda}${calcularTotal().toFixed(2)}`;
}

/* ====== navegarMenu: solo cierra el menú mobile (no cambia vistas) ====== */
function navegarMenu() {
  document.getElementById('mobileNav')?.classList.remove('open');
}

/* ====== TIMESTAMP ====== */
function obtenerFechaPedido() {
  return new Date().toLocaleString('es-SV', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

/* ====== EMAILJS ====== */
function enviarConfirmacion() {
  const nombre = document.getElementById('checkoutNombre')?.value.trim();
  const email  = document.getElementById('checkoutEmail')?.value.trim();
  const msgEl  = document.getElementById('mensajeEnvio');
  const finBtn = document.getElementById('btnFinalizar');

  if (!nombre) { msgEl.textContent = '⚠️ Por favor ingresá tu nombre.'; msgEl.style.color = 'orange'; return; }
  if (!email)  { msgEl.textContent = '⚠️ Por favor ingresá tu correo.'; msgEl.style.color = 'orange'; return; }
  if (typeof emailjs === 'undefined') {
    msgEl.textContent = '❌ EmailJS no disponible. Verificá tu conexión.'; msgEl.style.color = '#C0392B'; return;
  }

  // Email enviado formato HTML
  const productosHTML = `
    <table style="border-collapse:collapse;width:100%" border="1" cellspacing="0" cellpadding="8">
      <thead style="background-color:deeppink;color:white">
        <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
      </thead>
      <tbody>
        ${carrito.map(item=>`
        <tr>
          <td>${item.nombre}</td>
          <td style="text-align:center">${CONFIG.moneda}${item.precio.toFixed(2)}</td>
          <td style="text-align:center">${item.cantidad}</td>
          <td style="text-align:center">${CONFIG.moneda}${(item.precio*item.cantidad).toFixed(2)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  finBtn.disabled   = true;
  msgEl.textContent = '⏳ Enviando tu factura...';
  msgEl.style.color = '#888';

  emailjs.send(CONFIG.emailjsServiceID, CONFIG.emailjsTemplateID, {
    nemail:          email,
    ndireccion:      nombre,
    fecha_compra:    obtenerFechaPedido(),
    contadoricono:   totalArticulos().toString(),
    productos_lista: productosHTML,
    total_pedido:    `${CONFIG.moneda}${calcularTotal().toFixed(2)}`
  })
  .then(() => {
    msgEl.textContent = `✅ ¡Factura enviada a ${email}! Gracias, ${nombre} 🌮`;
    msgEl.style.color = '#27AE60';
    carrito = [];
    guardarCarrito();
    setTimeout(() => actualizarVistaCarrito(), 3500);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    msgEl.textContent = '❌ Error al enviar. Intentá de nuevo.';
    msgEl.style.color = '#C0392B';
    finBtn.disabled   = false;
  });
}

/* ====== TOAST ====== */
function mostrarNotificacion(mensaje, tipo = 'success') {
  document.querySelectorAll('.toast-notificacion').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className  = `toast-notificacion ${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

/* ====== DOMCONTENTLOADED ====== */
document.addEventListener('DOMContentLoaded', () => {

  cargarCarrito();

  /* Header cart */
  document.getElementById('cartBtn')?.addEventListener('click', abrirModalCarrito);
  document.getElementById('cartBtnMobile')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.remove('open');
    abrirModalCarrito();
  });

  /* Cerrar modal */
  document.getElementById('closeCartBtn')?.addEventListener('click', cerrarModalCarrito);
  document.getElementById('cartModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('cartModal')) cerrarModalCarrito();
  });

  /* Botón Pagar del modal → cierra modal (ya estamos en la página del carrito) */
  document.getElementById('btnPagar')?.addEventListener('click', () => {
    cerrarModalCarrito();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Proceder al pago */
  document.getElementById('btnProcederPago')?.addEventListener('click', () => {
    const checkout = document.getElementById('checkoutPage');
    if (checkout) {
      checkout.classList.add('visible');
      setTimeout(() => checkout.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
    }
  });

  /* Confirmar pedido */
  document.getElementById('btnFinalizar')?.addEventListener('click', enviarConfirmacion);

  /* Burger */
  document.getElementById('burger')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.toggle('open');
  });

});