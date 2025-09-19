// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  });
});

// Contador de tiempo en formato HH:MM:SS
// contador funcionando igual si la pagina se encuentra en segundo plano
/*
let segundos = 0;
const tiempoEl = document.getElementById('tiempo');

// Formatea segundos a "HH:MM:SS"
function formatHMS(s) {
  const hrs  = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Actualiza el display cada segundo
const contadorInterval = setInterval(() => {
  segundos++;
  tiempoEl.textContent = formatHMS(segundos);
}, 1000);
*/

//Contador funcionando solo si el usuario se encuentra dentro de la pagina
let segundos = 0;
const tiempoEl = document.getElementById('tiempo');
function formatHMS(s) {
  const hrs  = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
tiempoEl.textContent = formatHMS(segundos);

let tick = null;
function startTick() {
  if (tick) return;
  tick = setInterval(() => {
    if (document.visibilityState === 'visible') {
      segundos++;
      tiempoEl.textContent = formatHMS(segundos);
    }
  }, 1000);
}
function stopTick() {
  if (!tick) return;
  clearInterval(tick);
  tick = null;
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') startTick();
  else stopTick();
});

// iniciar
startTick();



// Animación al hacer scroll
const bloques = document.querySelectorAll('.bloque');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});
bloques.forEach(b => observer.observe(b));

// Botón volver arriba
const btnArriba = document.getElementById('btnArriba');
window.addEventListener('scroll', () => {
  btnArriba.style.display = window.scrollY > 200 ? 'block' : 'none';
});
btnArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Barra de progreso
window.addEventListener('scroll', () => {
  const alto = document.documentElement.scrollHeight - window.innerHeight;
  const scroll = window.scrollY;
  const porcentaje = (scroll / alto) * 100;
  document.getElementById('progreso').style.width = porcentaje + "%";
});


// Quiz interactivo
const botones = document.querySelectorAll('.opcion');
const resultado = document.getElementById('resultado');

botones.forEach(btn => {
  btn.addEventListener('click', () => {
    const eleccion = btn.dataset.respuesta;
    let mensaje = "";

    switch(eleccion) {
      case "comparacion":
        mensaje = "🔍 La comparación constante puede hacerte olvidar tus propios logros. ¡Valorá tus avances personales!";
        break;
      case "validacion":
        mensaje = "💙 Recordá que tu valor no depende de los 'me gusta'. Tu autoestima es más que las redes.";
        break;
      case "algoritmos":
        mensaje = "⚙️ Los algoritmos buscan tu atención, no tu bienestar. ¡Tomá el control de lo que consumís!";
        break;
      case "salud":
        mensaje = "🧠 Si sentís ansiedad o tristeza por las redes, es válido desconectarse y priorizar tu salud mental.";
        break;
      case "uso":
        mensaje = "🌱 El uso consciente es clave: pequeños cambios pueden marcar una gran diferencia en tu bienestar.";
        break;
    }

    resultado.textContent = mensaje;
    resultado.style.display = "block";
  });
});


/* =========================
   Rompecabezas deslizante 3×3
   ========================= */
(function initSlidingPuzzles() {
  const contenedores = document.querySelectorAll('.puzzle');
  if (!contenedores.length) return;

  const LIMITE_INTENTOS = 25; // 👉 Cambiá acá el máximo permitido
  const usoMensaje = document.getElementById("usoMensaje");

  contenedores.forEach(initPuzzle);

  function initPuzzle(root) {
    const size = parseInt(root.dataset.size || '3', 10);
    const img  = root.dataset.image;
    const concepto = root.dataset.concepto || 'Concepto';

    const grid = document.createElement('div');
    grid.className = 'puzzle__grid';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows    = `repeat(${size}, 1fr)`;

    const hud = document.createElement('div');
    hud.className = 'puzzle__hud';
    hud.textContent = 'Movimientos: 0';

    const overlay = document.createElement('div');
    overlay.className = 'puzzle__overlay';
    overlay.innerHTML = `
      <div>
        ✅ ¡Bien hecho! Completaste el rompecabezas.
        <div class="puzzle__concepto">${concepto}</div>
      </div>
    `;

    root.appendChild(grid);
    root.appendChild(hud);
    root.appendChild(overlay);

    const total = size * size;
    const objetivo = Array.from({ length: total }, (_, i) => i);
    let estado = objetivo.slice();
    let movimientos = 0;
    let bloqueadoPorUso = false;

    const tiles = [];
    for (let i = 0; i < total; i++) {
      const tile = document.createElement('button');
      tile.className = 'puzzle__tile';
      tile.type = 'button';
      if (i === total - 1) {
        tile.classList.add('puzzle__tile--vacia');
        tile.style.backgroundImage = 'none';
      } else {
        const fila = Math.floor(i / size);
        const col  = i % size;
        const bgX = (100 / (size - 1)) * col;
        const bgY = (100 / (size - 1)) * fila;
        tile.style.backgroundImage = `url("${img}")`;
        tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
        tile.style.backgroundPosition = `${bgX}% ${bgY}%`;
      }
      tiles.push(tile);
    }

    function mezclarResoluble() {
      let perm;
      do {
        perm = objetivo.slice();
        for (let i = total - 2; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [perm[i], perm[j]] = [perm[j], perm[i]];
        }
      } while (!esSoluble(perm));
      return perm;
    }

    function esSoluble(perm) {
      let inv = 0;
      const arr = perm.slice(0, total - 1);
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i] > arr[j]) inv++;
        }
      }
      return inv % 2 === 0;
    }

    function render() {
      grid.innerHTML = '';
      estado.forEach((indiceTile) => {
        grid.appendChild(tiles[indiceTile]);
      });
      hud.textContent = `Movimientos: ${movimientos}`;
    }

    function idxVacio() { return estado.indexOf(total - 1); }
    function coords(i) { return [Math.floor(i / size), i % size]; }
    function vecinos(i) {
      const [r, c] = coords(i);
      const res = [];
      if (r > 0) res.push(i - size);
      if (r < size - 1) res.push(i + size);
      if (c > 0) res.push(i - 1);
      if (c < size - 1) res.push(i + 1);
      return res;
    }

    function tryMove(indiceEnEstado) {
      if (bloqueadoPorUso) return; // 🚫 no permite mover más

      const posVacio = idxVacio();
      if (!vecinos(indiceEnEstado).includes(posVacio)) return false;

      [estado[indiceEnEstado], estado[posVacio]] = [estado[posVacio], estado[indiceEnEstado]];
      movimientos++;
      render();
      comprobarVictoria();
      comprobarUsoConsciente();
      return true;
    }

    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('.puzzle__tile');
      if (!tile || tile.classList.contains('puzzle__tile--vacia')) return;
      const indiceTile = tiles.indexOf(tile);
      const indiceEnEstado = estado.indexOf(indiceTile);
      tryMove(indiceEnEstado);
    });

    function comprobarVictoria() {
      const ok = estado.every((v, i) => v === i);
      if (ok) root.classList.add('puzzle--completo');
    }

    function comprobarUsoConsciente() {
      if (movimientos >= LIMITE_INTENTOS) {
        bloqueadoPorUso = true;
        usoMensaje.innerHTML = `⚠️ Has jugado demasiado tiempo. <br>
        Recuerda la importancia del <strong>uso consciente</strong>.`;
        grid.style.pointerEvents = "none"; // bloquea clicks
        grid.style.opacity = "0.5";        // efecto visual
      }
    }

    // Iniciar
    estado = mezclarResoluble();
    render();
  }
})();


// Test interactivo de hábitos en redes
(function(){
  const preguntas = document.querySelectorAll('#testSalud .pregunta');
  const resultadoDiv = document.getElementById('resultadoTest');
  const btnReiniciar = document.getElementById('reiniciarTest');
  let puntaje = 0;

  preguntas.forEach(preg => {
    const botones = preg.querySelectorAll('button');
    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        const valor = parseInt(btn.dataset.valor);
        puntaje += valor;

        // Ocultar la pregunta actual y mostrar la siguiente
        preg.style.display = 'none';
        const siguiente = preg.nextElementSibling;
        if (siguiente && siguiente.classList.contains('pregunta')) {
          siguiente.style.display = 'block';
        } else {
          mostrarResultado();
        }
      });
    });
  });

  function mostrarResultado() {
    let mensaje = '';
    let color = '';
    if (puntaje <= 4) {
      mensaje = '🟢 ¡Excelente! Tu uso de redes es equilibrado y positivo para tu bienestar.';
      color = '#3ee74683'; // verde
    } else if (puntaje <= 6) {
      mensaje = '🟡 Moderado: Podés sentir algo de estrés o ansiedad. Considerá tomar pausas.';
      color = '#ffea2885'; // amarillo
    } else {
      mensaje = '🔴 Riesgo alto: El uso de redes podría estar afectando tu salud mental. Es recomendable desconectarse y cuidar tu bienestar.';
      color = '#f33c3c8f'; // rojo
    }
    resultadoDiv.textContent = mensaje;
    resultadoDiv.style.backgroundColor = color;
    resultadoDiv.style.display = 'block';
  }

  btnReiniciar.addEventListener('click', () => {
    puntaje = 0;
    resultadoDiv.style.display = 'none';
    preguntas.forEach((preg, i) => {
      preg.style.display = i === 0 ? 'block' : 'none';
    });
  });

})();


// Personaje Validación Externa con contadores
const cara = document.getElementById('cara');
const btnLike = document.querySelector('#personaje .like');
const btnDislike = document.querySelector('#personaje .dislike');
const contadorLikes = document.getElementById('contadorLikes');
const contadorDislikes = document.getElementById('contadorDislikes');

let likes = 0;
let dislikes = 0;

btnLike.addEventListener('click', () => {
  likes++;
  contadorLikes.textContent = `👍 Likes: ${likes}`;
  cara.textContent = "😊";
  cara.style.color = "#81c784"; // verde alegre
  cara.style.transform = "scale(1.2)";
  setTimeout(() => cara.style.transform = "scale(1)", 200);
});

btnDislike.addEventListener('click', () => {
  dislikes++;
  contadorDislikes.textContent = `👎 Dislikes: ${dislikes}`;
  cara.textContent = "😞";
  cara.style.color = "#e57373ff"; // rojo triste
  cara.style.transform = "scale(0.9)";
  setTimeout(() => cara.style.transform = "scale(1)", 200);
});


// Algoritmos y Manipulación
(function() {
  const tarjetaActual = document.getElementById('tarjetaActual');
  const btns = document.querySelectorAll('#accionesHistorial .histBtn');
  const resetBtn = document.getElementById('resetHistorial');
  const historialDiv = document.getElementById('historial');
  const mensaje = document.getElementById('mensajeHistorial');

  // Contenido
  const contenidos = [
    { tipo: 'diversion', etiqueta: 'meme', texto: '😄 Meme divertido del día' },
    { tipo: 'diversion', etiqueta: 'video', texto: '🎵 Video musical trending' },
    { tipo: 'diversion', etiqueta: 'mascotas', texto: '🐶 Videos de mascotas' },
    { tipo: 'noticia', etiqueta: 'internacional', texto: '🌍 Noticias internacionales' },
    { tipo: 'noticia', etiqueta: 'estadistica', texto: '📈 Estadísticas curiosas' },
    { tipo: 'noticia', etiqueta: 'impactante', texto: '📰 Noticia impactante' },
    { tipo: 'politica', etiqueta: 'debate', texto: '🏛️ Debate político relevante' },
    { tipo: 'politica', etiqueta: 'analisis', texto: '⚖️ Análisis político semanal' },
    { tipo: 'politica', etiqueta: 'opinion', texto: '🗳️ Opinión electoral' }
  ];

  // Parámetros de aprendizaje
  const PESO_MIN = 1;
  const PESO_MAX = 15;
  const PESO_STEP_LIKE = 3;   // subida fuerte
  const PESO_STEP_DISLIKE = 1; // bajada más suave
  const DECAY = 0.95;         // decaimiento global (5%)
  const EXPLORACION = 0.15;   // % de mostrar random

  // Pesos
  const pesosTipo = { diversion: 3, noticia: 3, politica: 3 };
  const pesosEtiqueta = {};
  contenidos.forEach(c => pesosEtiqueta[c.etiqueta] = 3);

  // Historial de likes
  const historialLikes = [];

  // Generador de tarjeta ponderada
  function contenidoAlgoritmo() {
    // 15% chance de exploración (ignora pesos)
    if (Math.random() < EXPLORACION) {
      return contenidos[Math.floor(Math.random() * contenidos.length)];
    }

    // Crear pool ponderado
    const pool = [];
    contenidos.forEach(item => {
      let peso = pesosEtiqueta[item.etiqueta] + pesosTipo[item.tipo];

      // Refuerzo extra si está en historial de likes recientes
      if (historialLikes.includes(item.etiqueta)) {
        peso += 2;
      }

      peso = Math.max(PESO_MIN, Math.min(PESO_MAX, peso));
      for (let i = 0; i < peso; i++) pool.push(item);
    });

    return pool[Math.floor(Math.random() * pool.length)];
  }

  function mostrarTarjeta() {
    const item = contenidoAlgoritmo();
    tarjetaActual.textContent = item.texto;
    tarjetaActual.dataset.tipo = item.tipo;
    tarjetaActual.dataset.etiqueta = item.etiqueta;
    tarjetaActual.style.transform = 'translate(0,0)';
    tarjetaActual.style.opacity = '1';
  }

  function actualizarHistorial(tipo, etiqueta, accion) {
    const elem = document.createElement('div');
    elem.className = `histElemento ${tipo}`;
    elem.textContent = `${accion === 'like' ? '👍' : '👎'} ${etiqueta}`;
    historialDiv.appendChild(elem);
    historialDiv.scrollTop = historialDiv.scrollHeight;
  }

  function swipeTarjeta(direccion, callback) {
    tarjetaActual.style.transform =
      direccion === 'like' ? 'translateY(-120px) rotate(-5deg)' : 'translateX(-200px) rotate(-10deg)';
    tarjetaActual.style.opacity = '0';
    setTimeout(callback, 500);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const accion = btn.dataset.accion;
      const tipo = tarjetaActual.dataset.tipo;
      const etiqueta = tarjetaActual.dataset.etiqueta;

      swipeTarjeta(accion, () => {
        // Decaimiento global (simula paso del tiempo)
        Object.keys(pesosEtiqueta).forEach(k => {
          pesosEtiqueta[k] = Math.max(PESO_MIN, pesosEtiqueta[k] * DECAY);
        });

        if (accion === 'like') {
          pesosEtiqueta[etiqueta] = Math.min(PESO_MAX, pesosEtiqueta[etiqueta] + PESO_STEP_LIKE);
          pesosTipo[tipo] = Math.min(PESO_MAX, pesosTipo[tipo] + 1);
          historialLikes.push(etiqueta);
          if (historialLikes.length > 5) historialLikes.shift(); // memoria corta
        } else {
          pesosEtiqueta[etiqueta] = Math.max(PESO_MIN, pesosEtiqueta[etiqueta] - PESO_STEP_DISLIKE);
          pesosTipo[tipo] = Math.max(PESO_MIN, pesosTipo[tipo] - 1);
        }

        actualizarHistorial(tipo, etiqueta, accion);

        mensaje.textContent = accion === 'like'
          ? `📌 El algoritmo refuerza: más de "${etiqueta}" (${tipo}).`
          : `⚠️ El algoritmo baja la prioridad de "${etiqueta}" (${tipo}).`;

        mostrarTarjeta();
      });
    });
  });

  resetBtn.addEventListener('click', () => {
    historialDiv.innerHTML = '';
    Object.keys(pesosTipo).forEach(k => pesosTipo[k] = 3);
    Object.keys(pesosEtiqueta).forEach(k => pesosEtiqueta[k] = 3);
    historialLikes.length = 0;
    mensaje.textContent = '🔄 Reiniciado. El algoritmo olvida tus preferencias.';
    mostrarTarjeta();
  });

  mostrarTarjeta();
})();


// Comparacion constante
// Comparacion constante - secuencia 8 influencers aleatorios + usuario en 9
(function(){
  const influencersBase = [
    { nombre: "Sofía Trendy", foto: "https://randomuser.me/api/portraits/women/68.jpg" },
    { nombre: "Lucas Fitness", foto: "https://randomuser.me/api/portraits/men/75.jpg" },
    { nombre: "Mía Creativa", foto: "https://randomuser.me/api/portraits/women/65.jpg" },
    { nombre: "Tom Gamer", foto: "https://randomuser.me/api/portraits/men/66.jpg" },
    { nombre: "Valen Lifestyle", foto: "https://randomuser.me/api/portraits/women/50.jpg" },
    { nombre: "Ana Travel", foto: "https://randomuser.me/api/portraits/women/47.jpg" },
    { nombre: "Max Tech", foto: "https://randomuser.me/api/portraits/men/45.jpg" },
    { nombre: "Luna Food", foto: "https://randomuser.me/api/portraits/women/12.jpg" },
    { nombre: "Ciro Foto", foto: "https://randomuser.me/api/portraits/men/32.jpg" }
  ];

  // elementos DOM
  const btnEmpezar = document.getElementById("btnEmpezar");
  const mensajeError = document.getElementById("mensajeError");
  const inicioDiv = document.getElementById("inicioComparacion");
  const testDiv = document.getElementById("testComparacion");
  const fotoEl = document.getElementById('fotoInfluencer');
  const nombreEl = document.getElementById('nombreInfluencer');
  const contadorEl = document.getElementById('contadorSecuencia');
  const botones = document.querySelectorAll('#accionesComparacion button');
  const mensajeDiv = document.getElementById('mensajeTest');
  const barra = document.getElementById('barraAutoestima');

  let secuencia = [];      // array con los 9 elementos (8 random + user)
  let indiceActual = 0;
  let autoestima = 100;

  // Fisher-Yates shuffle
  function mezclar(a){
    const arr = a.slice();
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generarSecuenciaConUsuario(nombreU, fotoU){
    // mezclar base y tomar 8 distintos (si base < 8, se reutilizan tras mezclar)
    let pool = mezclar(influencersBase);
    if(pool.length < 8){
      // si hay menos de 8 en base, repetir mezcla hasta tener 8 (raro)
      while(pool.length < 8){
        pool = pool.concat(mezclar(influencersBase));
      }
    }
    const seleccion = pool.slice(0, 8);
    // añadir usuario al final
    seleccion.push({ nombre: nombreU, foto: fotoU, esUsuario: true });
    return seleccion;
  }

  function mostrarActual(){
    const item = secuencia[indiceActual];
    fotoEl.src = item.foto;
    fotoEl.alt = item.nombre;
    nombreEl.textContent = item.nombre;
    contadorEl.textContent = `Perfil ${indiceActual + 1} / ${secuencia.length}`;
    mensajeDiv.textContent = '';
  }

  function finalizarTest(){
    mensajeDiv.textContent = "✅ Test finalizado. Gracias por participar.";
    botones.forEach(b => b.disabled = true);
  }

  // manejar respuestas
  botones.forEach(btn => {
    btn.addEventListener('click', () => {
      if(!secuencia.length) return;
      const accion = btn.dataset.accion;
      const actual = secuencia[indiceActual];

      // Si llegó al perfil del usuario (último)
      if(actual.esUsuario){
        if(accion === 'si'){
          mensajeDiv.textContent = "💖 No hay mejor influencer que vos mismo/a. ¡Valorá tu autenticidad!";
        } else if(accion === 'no'){
          mensajeDiv.textContent = "🤔 Te das cuenta que te acabás de ignorar a vos mismo/a. ¡Valorá tu autenticidad!";
        } else {
          mensajeDiv.textContent = "⚖️ Es normal tener dudas. Recordá que tu valor no depende de comparaciones.";
        }
        // mantener autoestima completa al final
        autoestima = 100;
        barra.style.width = autoestima + "%";
        // terminar test (no avanzar más)
        setTimeout(finalizarTest, 5000);
        return;
      }

      // Si no es usuario, ajustar autoestima según respuesta
      if(accion === 'si'){         // comparar = malo (disminuye)
        autoestima = Math.max(0, autoestima - 15);
        mensajeDiv.textContent = "😟 Comparar puede bajar tu autoestima. Recordá tus logros.";
      } else if(accion === 'no'){  // ignorar = bueno (sube)
        autoestima = Math.min(100, autoestima + 10);
        mensajeDiv.textContent = "💪 Bien: estás priorizando tu bienestar.";
      } else if(accion === 'talvez'){ // tal vez = leve impacto
        autoestima = Math.max(0, autoestima - 5);
        mensajeDiv.textContent = "⚖️ Tu duda es válida; cuidá tu autoimagen.";
      }

      barra.style.width = autoestima + "%";

      // avanzar a siguiente elemento (pequeño delay para ver el mensaje)
      setTimeout(() => {
        indiceActual++;
        if(indiceActual < secuencia.length){
          mostrarActual();
        } else {
          finalizarTest();
        }
      }, 500);
    });
  });

  // botón empezar: validar y generar secuencia
  btnEmpezar.addEventListener('click', () => {
    const nombreU = document.getElementById("nombreUsuario").value.trim();
    const imagenU = document.getElementById("imagenUsuario").value.trim();

    if(!nombreU || !imagenU){
      mensajeError.style.display = "block";
      return;
    }
    mensajeError.style.display = "none";

    // crear secuencia: 8 aleatorios sin repetirse + usuario al final
    secuencia = generarSecuenciaConUsuario(nombreU, imagenU);
    indiceActual = 0;
    autoestima = 100;
    barra.style.width = autoestima + "%";
    botones.forEach(b => b.disabled = false);

    // ocultar form y mostrar test
    inicioDiv.style.display = "none";
    testDiv.style.display = "block";

    // mostrar primer influencer
    mostrarActual();
  });

})();



/* Uso consciente: desbloqueo por tiempo activo + widgets (Pomodoro 5min, respirar 60s, pacto) */
// Desbloqueo de "Uso consciente" después de tiempo activo (HH:MM:SS display)
// Uso consciente + Juego anti-scroll integrado
(function(){
  const UNLOCK_AFTER = 3; // segundos de uso activo necesarios; cambia aquí (ej. 120 = 2 minutos)
  const usoSection = document.getElementById('uso');
  if(!usoSection) return;

  const overlayTimerEl = document.getElementById('unlockTimerDisplay');
  const targetDisplay = document.getElementById('unlockTargetDisplay');
  const content = usoSection.querySelector('.uso-content');

  // elementos del juego
  const antiGame = document.getElementById('antiScrollGame');
  const gameContainer = antiGame ? antiGame.querySelector('.game-container') : null;
  const scrollBar = antiGame ? antiGame.querySelector('.scroll-bar') : null;
  const targetZone = antiGame ? antiGame.querySelector('.target-zone') : null;
  const stopBtn = document.getElementById('stopBtn');
  const retryBtn = document.getElementById('retryBtn');
  const gameMessage = document.getElementById('gameMessage');

  // formatea segundos a mm:ss (o hh:mm:ss si necesario)
  function formatTime(s){
    const hrs = Math.floor(s/3600);
    const mins = Math.floor((s%3600)/60);
    const secs = s%60;
    if(hrs > 0) {
      return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    } else {
      return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
  }

  if(targetDisplay) targetDisplay.textContent = formatTime(UNLOCK_AFTER);
  if(overlayTimerEl) overlayTimerEl.textContent = formatTime(UNLOCK_AFTER);

  // contador de tiempo activo (sólo cuenta si la pestaña está visible)
  let activeSeconds = 0;
  let tickInterval = null;

  function updateOverlayTimer(){
    if(overlayTimerEl) overlayTimerEl.textContent = formatTime(Math.max(0, UNLOCK_AFTER - activeSeconds));
  }

  function startTick(){
    if(tickInterval) return;
    tickInterval = setInterval(() => {
      if(document.visibilityState === 'visible'){
        activeSeconds++;
        updateOverlayTimer();
        if(activeSeconds >= UNLOCK_AFTER){
          unlockUso();
        }
      }
    }, 1000);
  }

  function stopTick(){
    if(tickInterval){ clearInterval(tickInterval); tickInterval = null; }
  }

  function unlockUso(){
    stopTick();
    usoSection.classList.remove('locked');
    usoSection.classList.add('unlocked');
    if(content){
      content.style.display = 'block';
      content.setAttribute('aria-hidden','false');
    }
    // mostrar el juego (si existe)
    if(antiGame){
      antiGame.setAttribute('aria-hidden','false');
      antiGame.style.display = 'block';
      initAntiScrollGame(); // inicializa el juego
    }
    // llevar la vista al bloque
  
  }

  // iniciar contador
  updateOverlayTimer();
  startTick();
  document.addEventListener('visibilitychange', () => {
    if(document.visibilityState === 'visible') startTick();
    else stopTick();
  });

  // --- Juego anti-scroll ---
  // Variables de animación
  let animId = null;
  let position = 0;
  let direction = 1; // 1 = baja, -1 = sube (en este juego sólo baja y reinicia)
  let speed = 1.6;   // píxeles por frame, ajustable
  let running = false;
  let canAttempt = false;

  function initAntiScrollGame(){
    if(!gameContainer || !scrollBar || !targetZone || !stopBtn || !gameMessage) return;
    // reset visual
    position = 0;
    running = true;
    canAttempt = true;
    gameMessage.textContent = '';
    scrollBar.style.top = position + 'px';
    stopBtn.disabled = false;
    retryBtn.style.display = 'none';
    // start animation
    cancelAnimationFrame(animId);
    animLoop();
  }

  function animLoop(){
    if(!running) return;
    // actualizar posición
    position += speed;
    // si llega al fondo, reinicia arriba (loop infinito)
    const maxPos = gameContainer.clientHeight - scrollBar.offsetHeight - 2;
    if(position > maxPos) position = 0;
    scrollBar.style.top = position + 'px';
    animId = requestAnimationFrame(animLoop);
  }

  function checkSuccess(){
    const barRect = scrollBar.getBoundingClientRect();
    const targetRect = targetZone.getBoundingClientRect();
    // Comprobar si barra está completamente dentro de la target zone
    const inside = (barRect.top >= targetRect.top && barRect.bottom <= targetRect.bottom);
    return inside;
  }

  // stop button listener
  if(stopBtn){
    stopBtn.addEventListener('click', () => {
      if(!canAttempt) return;
      // pause animation
      running = false;
      cancelAnimationFrame(animId);
      const success = checkSuccess();
      if(success){
        gameMessage.style.color = '#4caf50';
        gameMessage.textContent = "✅ ¡Lo lograste! Así como detuviste el scroll, podés frenar tu tiempo online.";
        stopBtn.disabled = true;
        retryBtn.style.display = 'inline-block';
        canAttempt = false;
      } else {
        gameMessage.style.color = '#ff5252';
        gameMessage.textContent = "❌ Fallaste. Reintentá para mejorar tu puntería.";
        stopBtn.disabled = true;
        retryBtn.style.display = 'inline-block';
        canAttempt = false;
      }
    });
  }

  // retry button listener
  if(retryBtn){
    retryBtn.addEventListener('click', () => {
      // reiniciar y permitir intento
      position = 0;
      scrollBar.style.top = position + 'px';
      gameMessage.textContent = '';
      stopBtn.disabled = false;
      retryBtn.style.display = 'none';
      canAttempt = true;
      running = true;
      cancelAnimationFrame(animId);
      animLoop();
    });
  }

  // permitir desbloqueo manual en consola para pruebas
  window.debugUnlockUso = unlockUso;

})();

//boton ver mas ver menos.
// Selecciona todos los botones "Ver más"
document.querySelectorAll('.ver-mas-btn').forEach(boton => {
  boton.addEventListener('click', () => {
    // Busca el id del texto extra desde el data-target del botón
    const idTexto = boton.dataset.target;
    const extraText = document.getElementById(idTexto);

    // Alterna visibilidad y texto del botón
    if (extraText.style.display === 'none' || extraText.style.display === '') {
      extraText.style.display = 'inline';
      boton.textContent = 'Ver menos';
    } else {
      extraText.style.display = 'none';
      boton.textContent = 'Leer más';
    }
  });
});
