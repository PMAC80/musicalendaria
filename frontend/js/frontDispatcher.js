// frontDispatcher.js
// Este script carga la cartelera de espectáculos desde la API y la muestra en la página principal

document.addEventListener('DOMContentLoaded', () => {
  cargarCartelera();
  const buscador = document.getElementById('buscador');
  if (buscador) buscador.addEventListener('input', filtrarCartelera);
});

let espectaculos = [];

// Mostrar metadatos solo si está activado por query param o localStorage
function shouldShowMeta() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') return true;
  } catch (e) { /* ignore */ }
  return localStorage.getItem('debug_show_meta') === '1';
}

function createMetaToggle() {
  const existing = document.getElementById('meta-toggle-btn');
  if (existing) return;
  const btn = document.createElement('button');
  btn.id = 'meta-toggle-btn';
  btn.textContent = shouldShowMeta() ? 'Ocultar meta' : 'Mostrar meta';
  btn.style.position = 'fixed';
  btn.style.right = '16px';
  btn.style.bottom = '16px';
  btn.style.zIndex = '9999';
  btn.style.padding = '8px 10px';
  btn.style.background = '#fff';
  btn.style.border = '1px solid #ccc';
  btn.style.borderRadius = '6px';
  btn.style.cursor = 'pointer';
  btn.addEventListener('click', () => {
    const cur = shouldShowMeta();
    localStorage.setItem('debug_show_meta', cur ? '0' : '1');
    btn.textContent = cur ? 'Mostrar meta' : 'Ocultar meta';
    mostrarCartelera(espectaculos);
  });
  document.body.appendChild(btn);
}

function cargarCartelera() {
  fetch('/api/eventos')
    .then(res => {
      if (!res.ok) throw new Error('Respuesta de la API no OK');
      return res.json();
    })
    .then(data => {
      espectaculos = Array.isArray(data) ? data : [];
      mostrarCartelera(espectaculos);
    })
    .catch(err => {
      console.error('Error cargando cartelera:', err);
      const cont = document.getElementById('cartelera');
      if (cont) cont.innerHTML = '<p>Error al cargar la cartelera.</p>';
    });
}

function ensureHttp(href) {
  if (!href) return href;
  if (!/^https?:\/\//i.test(href)) return 'http://' + href;
  return href;
}

function crearCard(evento) {
  const card = document.createElement('div');
  card.className = 'evento-card';

  const flyerDiv = document.createElement('div');
  flyerDiv.className = 'flyer';
  flyerDiv.style.position = 'relative';

  const url = (evento.enlace_flyer || '').trim();
  if (url) {
    const lower = url.toLowerCase();
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/)) {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Flyer';
      flyerDiv.appendChild(img);
    } else if (lower.match(/\.(mp4|webm|ogg)(\?|$)/)) {
      const thumb = document.createElement('img');
      thumb.src = url;
      thumb.alt = 'Video preview';
      thumb.style.cursor = 'pointer';
      thumb.width = 240;
      thumb.height = 135;
      flyerDiv.appendChild(thumb);
      const playVideo = () => {
        const video = document.createElement('video');
        video.src = url;
        video.width = 240;
        video.height = 135;
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.playsInline = true;
        try { flyerDiv.replaceChild(video, thumb); } catch (e) { flyerDiv.appendChild(video); thumb.remove(); }
        video.focus();
      };
      thumb.addEventListener('click', (ev) => { ev.stopPropagation(); playVideo(); });
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      let videoId = null;
      const ytMatch = url.match(/(?:v=|youtu\.be\/)\s*([A-Za-z0-9_-]{11})/);
      if (ytMatch) videoId = ytMatch[1];
      if (videoId) {
        const thumb = document.createElement('img');
        thumb.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        thumb.alt = 'Video preview';
        thumb.style.cursor = 'pointer';
        flyerDiv.appendChild(thumb);
        const playYouTube = () => {
          const iframe = document.createElement('iframe');
          iframe.width = '240';
          iframe.height = '135';
          iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&controls=1&autoplay=1&loop=1&playlist=${videoId}`;
          iframe.frameBorder = '0';
          iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          try { flyerDiv.replaceChild(iframe, thumb); } catch (e) { flyerDiv.appendChild(iframe); thumb.remove(); }
        };
        thumb.addEventListener('click', (ev) => { ev.stopPropagation(); playYouTube(); });
      } else {
        const a = document.createElement('a');
        a.href = ensureHttp(url);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Ver multimedia';
        flyerDiv.appendChild(a);
      }
    } else {
      const a = document.createElement('a');
      a.href = ensureHttp(url);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Ver multimedia';
      flyerDiv.appendChild(a);
    }
  }

  card.appendChild(flyerDiv);

  const title = document.createElement('h2');
  title.textContent = evento.titulo || 'Sin título';
  const lugarP = document.createElement('p');
  lugarP.innerHTML = `<strong>Lugar:</strong> ${evento.lugar || ''}`;
  const fechaP = document.createElement('p');
  fechaP.innerHTML = `<strong>Fecha:</strong> ${evento.fecha ? new Date(evento.fecha).toLocaleDateString() : ''}`;
  const horaP = document.createElement('p');
  horaP.innerHTML = `<strong>Hora:</strong> ${evento.hora || 'Hora no disponible'}`;
  const etiquetasDiv = document.createElement('div');
  etiquetasDiv.className = 'etiquetas';
  const etiquetas = evento.etiquetas || [];
  etiquetasDiv.innerHTML = etiquetas.map(e => `<span class="etiqueta">${e}</span>`).join(' ');

  const entradasBtn = document.createElement('button');
  entradasBtn.className = 'btn-entradas';
  entradasBtn.textContent = 'Entradas';
  if (evento.enlace_entradas && evento.enlace_entradas.trim() !== '') {
    entradasBtn.addEventListener('click', (ev) => { ev.stopPropagation(); window.open(ensureHttp(evento.enlace_entradas), '_blank', 'noopener'); });
  } else {
    entradasBtn.disabled = true;
    entradasBtn.title = 'No hay enlace de entradas';
  }

  card.appendChild(title);
  card.appendChild(lugarP);
  card.appendChild(fechaP);
  card.appendChild(horaP);
  card.appendChild(etiquetasDiv);
  card.appendChild(entradasBtn);

  if (shouldShowMeta()) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'evento-meta';
    metaDiv.style.fontSize = '0.8em';
    metaDiv.style.color = '#666';
    metaDiv.style.marginTop = '6px';
    const idVal = evento.id || evento.evento_id || 'N/A';
    const artistaVal = evento.artista_id || (evento.artista && evento.artista.id) || 'N/A';
    const habilitadoVal = (typeof evento.habilitado !== 'undefined') ? (evento.habilitado ? 'Sí' : 'No') : 'N/D';
    const entradasVal = evento.enlace_entradas ? evento.enlace_entradas : 'sin enlace';
    metaDiv.textContent = `ID: ${idVal}  |  Artista: ${artistaVal}  |  Habilitado: ${habilitadoVal}  |  Entradas: ${entradasVal}`;
    card.appendChild(metaDiv);
  }

  return card;
}

function mostrarCartelera(lista) {
  const contenedor = document.getElementById('cartelera');
  if (!contenedor) return;
  try {
    contenedor.innerHTML = '';

    if (!lista || lista.length === 0) {
      contenedor.innerHTML = '<p>No hay espectáculos programados.</p>';
      createMetaToggle();
      return;
    }

    // Renderizar cada evento como una tarjeta dentro del grid (CSS controla 3 columnas)
    lista.forEach(ev => {
      const card = crearCard(ev);
      contenedor.appendChild(card);
    });

    createMetaToggle();
  } catch (err) {
    console.error('Error mostrando cartelera:', err);
    contenedor.innerHTML = '<p>Error al cargar la cartelera.</p>';
  }
}

function filtrarCartelera(e) {
  const texto = (e.target.value || '').toLowerCase();
  const filtrados = espectaculos.filter(ev =>
    (ev.titulo || '').toLowerCase().includes(texto) ||
    (ev.lugar || '').toLowerCase().includes(texto)
  );
  mostrarCartelera(filtrados);
}

