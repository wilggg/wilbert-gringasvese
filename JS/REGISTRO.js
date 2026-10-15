/*
  GRINGAS VERSE — REGISTRO.js
  El burger ahora lo maneja JS/carrito-header.js (para evitar que
  se registren dos listeners y el menú "no abra" por doble toggle).
*/

// Formulario de Registro
(function () {
  const form = document.getElementById('registroForm');
  if (!form) return;

  // Mostrar / ocultar contraseña
  form.querySelectorAll('.pass-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = document.getElementById(btn.dataset.target);
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.textContent = isPass ? '🙈' : '👁️';
    });
  });

  function setError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById('err-' + fieldId.replace('reg-', ''));
    if (message) {
      input.classList.add('invalid');
      if (error) error.textContent = message;
    } else {
      input.classList.remove('invalid');
      if (error) error.textContent = '';
    }
    return !message;
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const pass2 = document.getElementById('reg-pass2').value;
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let ok = true;
    ok = setError('reg-nombre', nombre.length < 2 ? 'Escribe tu nombre completo' : '') && ok;
    ok = setError('reg-correo', !correoRegex.test(correo) ? 'Ingresa un correo válido' : '') && ok;
    ok = setError('reg-pass', pass.length < 6 ? 'Mínimo 6 caracteres' : '') && ok;
    ok = setError('reg-pass2', pass2 !== pass ? 'Las contraseñas no coinciden' : '') && ok;

    if (!ok) return;

    showToast('🎉 ¡Cuenta creada con éxito, ' + nombre.split(' ')[0] + '!');
    form.reset();
  });
})();
