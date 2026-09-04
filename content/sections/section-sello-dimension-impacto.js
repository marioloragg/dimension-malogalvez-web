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
        function play() {
          stage.classList.add('sd2-play');
        }

        if (reduceMotion || !('IntersectionObserver' in window)) {
          play();
          return;
        }

        try {
          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  play();
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
          );
          observer.observe(stage);
        } catch (e) {
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
