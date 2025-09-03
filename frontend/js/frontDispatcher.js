// frontDispatcher.js
// Este script carga la cartelera de espectáculos desde la API y la muestra en la página principal

document.addEventListener('DOMContentLoaded', () => {
  cargarCartelera();

  document.getElementById('buscador').addEventListener('input', filtrarCartelera);
});

let espectaculos = [];

function cargarCartelera() {
  fetch('/api/eventos')
    .then(res => res.json())
    .then(data => {
      espectaculos = data;
      mostrarCartelera(espectaculos);
    })
    .catch(err => {
      document.getElementById('cartelera').innerHTML = '<p>Error al cargar la cartelera.</p>';
    });
}

function mostrarCartelera(lista) {
  const contenedor = document.getElementById('cartelera');
  contenedor.innerHTML = '';
  lista.forEach(evento => {
    const card = document.createElement('div');
    card.className = 'evento-card';
    card.innerHTML = `
      <img src="${evento.imagen || 'img/default.jpg'}" alt="${evento.titulo}" class="evento-img">
      <h2>${evento.titulo}</h2>
      <p><strong>Lugar:</strong> ${evento.lugar}</p>
      <p><strong>Fecha:</strong> ${evento.fecha}</p>
      <p><strong>Hora:</strong> ${evento.hora}</p>
      <div class="etiquetas">
        ${evento.etiquetas.map(e => `<span class="etiqueta">${e}</span>`).join(' ')}
      </div>
      <button class="btn-entradas">Entradas</button>
    `;
    contenedor.appendChild(card);
  });
}

function filtrarCartelera(e) {
  const texto = e.target.value.toLowerCase();
  const filtrados = espectaculos.filter(ev =>
    ev.titulo.toLowerCase().includes(texto) ||
    ev.lugar.toLowerCase().includes(texto)
  );
  mostrarCartelera(filtrados);
}
