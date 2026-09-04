(function () {
  try {
    document.documentElement.classList.add('sd2-js');
  } catch (e) {}

  function init() {
    try {
      var stages = document.querySelectorAll('[data-sd2-stage]');
      if (!stages.length) return;

      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      stages.forEach(function (stage) {
        var everPlayed = false;

        /* Reinicia la animación de verdad (quitar+añadir la misma clase no
           basta: hace falta forzar un reflow entre medias para que el
           navegador la vuelva a reproducir desde el principio). */
        function play() {
          everPlayed = true;
          stage.classList.remove('sd2-play');
          void stage.offsetWidth;
          requestAnimationFrame(function () {
            stage.classList.add('sd2-play');
          });
        }
        function reset() {
          stage.classList.remove('sd2-play');
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
          stage.classList.add('sd2-play');
          return;
        }

        /* Red de seguridad SOLO para el primer disparo: si el observer nunca
           llega a marcar la sección como visible (cabecera sticky, barra de
           anuncios y demás complejidad que una prueba aislada no reproduce),
           el contenido no se queda invisible para siempre. */
        var safety = setTimeout(play, 4000);

        try {
          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  clearTimeout(safety);
                  play();
                } else if (everPlayed) {
                  /* Se sale de la vista: se reinicia para que el efecto se
                     reproduzca de nuevo la próxima vez que entre. */
                  reset();
                }
              });
            },
            { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
          );
          observer.observe(stage);
        } catch (e) {
          clearTimeout(safety);
          play();
        }
      });
    } catch (e) {
      document.querySelectorAll('[data-sd2-stage]').forEach(function (stage) {
        stage.classList.add('sd2-play');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
