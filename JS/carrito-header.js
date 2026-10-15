const CART_CONFIG = { moneda: '$' };
const CART_STORAGE_KEY = 'gringas_carrito';
let carrito = [];

const PRODUCT_INFO = {
  'la-ternerita':      { emoji: '🌮' },
  'la-chicken-little': { emoji: '🍗' },
  'la-bipolar':        { emoji: '🧀' },
  'tu-gringa-ideal':   { emoji: '✨' },
  'jamaica':           { emoji: '🌺' },
  'tamarindo':         { emoji: '🥤' },
};
function getVisual(id) { return PRODUCT_INFO[id] || { emoji: '🍽️' }; }

function guardarCarrito() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carrito));
}
function cargarCarrito() {
  try { const d = localStorage.getItem(CART_STORAGE_KEY); carrito = d ? JSON.parse(d) : []; }
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

function calcularTotal()  { return carrito.reduce((t,i) => t + i.precio * i.cantidad, 0); }
function totalArticulos() { return carrito.reduce((s,i) => s + i.cantidad, 0); }

/* ====== ACTUALIZAR UI ====== */
function actualizarVistaCarrito() {
  actualizarContadorHeader();
  actualizarModalCarrito();
}

function actualizarContadorHeader() {
  const n = totalArticulos();
  document.querySelectorAll('#cartCount,#cartCountMobile').forEach(el => { if (el) el.textContent = n; });
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
    if (totalEl)  totalEl.textContent = `${CART_CONFIG.moneda}0.00`;
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
        <div class="modal-item-detalle">×${item.cantidad} · ${CART_CONFIG.moneda}${item.precio.toFixed(2)} c/u</div>
      </div>
      <span class="modal-item-sub">${CART_CONFIG.moneda}${sub}</span>
    </li>`;
  }).join('');

  if (totalEl) totalEl.textContent = `${CART_CONFIG.moneda}${calcularTotal().toFixed(2)}`;
}

function abrirModalCarrito() {
  const modal = document.getElementById('cartModal');
  if (modal) { modal.classList.add('open'); actualizarModalCarrito(); }
}
function cerrarModalCarrito() {
  document.getElementById('cartModal')?.classList.remove('open');
}

/* ====== TOAST ====== */
function mostrarNotificacion(mensaje) {
  document.querySelectorAll('.toast-notificacion').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className  = 'toast-notificacion';
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

  /* Ir al carrito → página dedicada carrito.html */
  document.getElementById('btnPagar')?.addEventListener('click', () => {
    window.location.href = 'carrito.html';
  });

  /* Burger (menú mobile) */
  document.getElementById('burger')?.addEventListener('click', () => {
    document.getElementById('mobileNav')?.classList.toggle('open');
  });

});
