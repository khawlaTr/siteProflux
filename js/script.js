/* ==========================================================================
   ProFlux Ingénierie — Scripts front (JavaScript vanilla, sans dépendance)
   --------------------------------------------------------------------------
   Modules :
   1. Menu mobile (burger) + sous-menu expertises
   2. Ombre du header au scroll
   3. Révélations au scroll (IntersectionObserver)
   4. Compteurs animés des chiffres clés
   5. Filtres de la page Références
   6. Formulaire de contact (Formspree + repli mailto)
   7. Année courante dans le footer

   Chaque module sort immédiatement si ses éléments ne sont pas présents :
   le même fichier peut donc être chargé sur toutes les pages.
   ========================================================================== */

(function () {
  "use strict";

  /* L'utilisateur préfère-t-il des animations réduites ? */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------------
     1. MENU MOBILE + SOUS-MENU
     ------------------------------------------------------------------ */
  function initNavigation() {
    var burger = document.querySelector("[data-burger]");
    var nav = document.querySelector("[data-nav]");
    if (!burger || !nav) return;

    /* Ouverture / fermeture du panneau mobile.
       On verrouille le défilement de la page derrière le panneau : sans cela,
       l'arrière-plan continue de défiler sous le menu sur mobile. */
    function setMenu(isOpen) {
      nav.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
      burger.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
      document.body.classList.toggle("is-locked", isOpen);
    }

    burger.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    /* Un clic sur un lien du panneau referme le menu (navigation interne
       vers une ancre : sans cela, le panneau resterait ouvert par-dessus). */
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) setMenu(false);
      });
    });

    /* Sous-menu « Notre expertise » :
       - en mobile, on l'ouvre au clic sur le bouton ;
       - en desktop (>= 1024px), le survol CSS suffit, mais le clic reste
         disponible pour la navigation au clavier. */
    var subToggles = nav.querySelectorAll("[data-sub-toggle]");
    Array.prototype.forEach.call(subToggles, function (toggle) {
      var parent = toggle.closest(".nav__item--has-sub");
      toggle.addEventListener("click", function () {
        var isOpen = parent.getAttribute("data-open") === "true";
        parent.setAttribute("data-open", String(!isOpen));
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });

    /* Fermeture du menu et des sous-menus avec la touche Échap.
       Le focus repart sur le bouton hamburger, pour ne pas le perdre dans la page. */
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (nav.classList.contains("is-open")) burger.focus();
      setMenu(false);
      Array.prototype.forEach.call(subToggles, function (toggle) {
        var parent = toggle.closest(".nav__item--has-sub");
        parent.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    /* Clic en dehors : referme le sous-menu ouvert en desktop */
    document.addEventListener("click", function (event) {
      if (nav.contains(event.target) || burger.contains(event.target)) return;
      Array.prototype.forEach.call(subToggles, function (toggle) {
        toggle.closest(".nav__item--has-sub").setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------
     2. HEADER AU SCROLL
     Gère d'un seul écouteur : l'état du header, la barre de progression
     de lecture et l'affichage du bouton « retour en haut ».
     ------------------------------------------------------------------ */
  function initStickyHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var progress = document.querySelector("[data-scroll-progress]");
    var toTop = document.querySelector("[data-to-top]");
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 12);

      if (progress) {
        var scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        var ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
        progress.style.width = (ratio * 100).toFixed(2) + "%";
      }

      if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);

      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------
     3. RÉVÉLATIONS AU SCROLL
     Fade-in léger déclenché une seule fois par élément.
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    /* Repli : navigateurs sans IntersectionObserver ou animations réduites */
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    Array.prototype.forEach.call(items, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     4. COMPTEURS ANIMÉS (chiffres clés)
     Chaque .stat porte data-value="98" ; la jauge se remplit en parallèle.
     ------------------------------------------------------------------ */
  function initCounters() {
    var stats = document.querySelectorAll("[data-counter]");
    if (!stats.length) return;

    function render(stat) {
      var target = parseInt(stat.getAttribute("data-counter"), 10) || 0;
      var output = stat.querySelector("[data-counter-value]");
      var bar = stat.querySelector("[data-counter-bar]");
      if (bar) bar.style.width = target + "%";
      if (!output) return;

      if (prefersReducedMotion) {
        output.textContent = String(target);
        return;
      }

      var duration = 1400;
      var start = null;
      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        /* easeOutCubic pour une fin douce */
        var eased = 1 - Math.pow(1 - progress, 3);
        output.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(stats, render);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          render(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    Array.prototype.forEach.call(stats, function (stat) {
      observer.observe(stat);
    });
  }

  /* ------------------------------------------------------------------
     5. FILTRES DES RÉFÉRENCES
     Filtrage purement client sur l'attribut data-category.
     ------------------------------------------------------------------ */
  function initFilters() {
    var buttons = document.querySelectorAll("[data-filter]");
    var projects = document.querySelectorAll("[data-category]");
    if (!buttons.length || !projects.length) return;

    var counter = document.querySelector("[data-filter-count]");

    function apply(filter) {
      var visible = 0;
      Array.prototype.forEach.call(projects, function (project) {
        var match =
          filter === "all" || project.getAttribute("data-category") === filter;
        project.hidden = !match;
        if (match) visible++;
      });
      if (counter) {
        counter.textContent =
          visible + (visible > 1 ? " projets affichés" : " projet affiché");
      }
    }

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        Array.prototype.forEach.call(buttons, function (other) {
          other.classList.remove("is-active");
          other.setAttribute("aria-pressed", "false");
        });
        button.classList.add("is-active");
        button.setAttribute("aria-pressed", "true");
        apply(button.getAttribute("data-filter"));
      });
    });
  }

  /* ------------------------------------------------------------------
     6. FORMULAIRE DE CONTACT
     Deux modes, choisis via l'attribut data-endpoint du <form> :
     - endpoint Formspree renseigné  -> envoi AJAX, pas de rechargement ;
     - endpoint vide ou en erreur    -> repli sur un mailto pré-rempli.
     ------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[data-form-submit]");
    var endpoint = form.getAttribute("data-endpoint") || "";
    var fallbackMail = form.getAttribute("data-fallback-mail") || "";

    function setStatus(message, type) {
      if (!status) return;
      status.textContent = message;
      status.className =
        "form-status is-visible form-status--" + (type === "ok" ? "ok" : "ko");
    }

    /* Validation légère, en complément de la validation native HTML5 */
    function validate() {
      var valid = true;
      var required = form.querySelectorAll("[required]");
      Array.prototype.forEach.call(required, function (input) {
        var field = input.closest(".field") || input.closest(".consent");
        var ok = input.checkValidity();
        if (field) field.classList.toggle("has-error", !ok);
        if (!ok && valid) {
          input.focus();
          valid = false;
        }
      });
      return valid;
    }

    /* Construit un lien mailto lisible à partir des champs du formulaire */
    function buildMailto() {
      var data = new FormData(form);
      var subject =
        "[Site ProFlux] Demande - " + (data.get("sujet") || "Contact");
      var lines = [
        "Nom : " + (data.get("nom") || ""),
        "Société : " + (data.get("societe") || "-"),
        "E-mail : " + (data.get("email") || ""),
        "Téléphone : " + (data.get("telephone") || "-"),
        "Sujet : " + (data.get("sujet") || "-"),
        "",
        "Message :",
        data.get("message") || ""
      ];
      return (
        "mailto:" +
        fallbackMail +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"))
      );
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate()) {
        setStatus("Merci de compléter les champs obligatoires.", "ko");
        return;
      }

      /* Aucun endpoint configuré : on ouvre directement le client mail */
      if (!endpoint || endpoint.indexOf("VOTRE_ID") !== -1) {
        window.location.href = buildMailto();
        setStatus(
          "Votre logiciel de messagerie s'ouvre avec le message pré-rempli. Si rien ne se passe, écrivez-nous directement à " +
            fallbackMail +
            ".",
          "ok"
        );
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Envoi en cours…";
      }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Réponse " + response.status);
          form.reset();
          setStatus(
            "Merci, votre demande est bien reçue. Nous revenons vers vous sous 48 h ouvrées.",
            "ok"
          );
        })
        .catch(function () {
          setStatus(
            "L'envoi automatique a échoué. Vous pouvez nous écrire directement à " +
              fallbackMail +
              ".",
            "ko"
          );
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = "Envoyer ma demande";
          }
        });
    });
  }

  /* ------------------------------------------------------------------
     7. ANNÉE COURANTE DANS LE FOOTER
     ------------------------------------------------------------------ */
  function initYear() {
    var slots = document.querySelectorAll("[data-year]");
    Array.prototype.forEach.call(slots, function (slot) {
      slot.textContent = String(new Date().getFullYear());
    });
  }

  /* ------------------------------------------------------------------
     8. RETOUR EN HAUT DE PAGE
     ------------------------------------------------------------------ */
  function initToTop() {
    var button = document.querySelector("[data-to-top]");
    if (!button) return;

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      /* Le focus repart en tête de page, sinon il resterait sur un bouton
         désormais masqué. */
      var main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    });
  }

  /* ------------------------------------------------------------------
     Initialisation
     ------------------------------------------------------------------ */
  function init() {
    initNavigation();
    initStickyHeader();
    initToTop();
    initReveal();
    initCounters();
    initFilters();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
