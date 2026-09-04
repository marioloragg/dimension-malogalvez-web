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
        var played = false;
        function play() {
          if (played) return;
          played = true;
          stage.classList.add('sd2-play');
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
          play();
          return;
        }

        /* Red de seguridad: si el observer nunca dispara en esta página real
           (cabecera sticky, barra de anuncios y demás complejidad que una
           prueba aislada no reproduce), el contenido no se queda invisible
           para siempre — se revela igualmente a los 4s. */
        var safety = setTimeout(play, 4000);

        try {
          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  clearTimeout(safety);
                  play();
                  observer.unobserve(entry.target);
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
