/* =========================================================
   Next Client — interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* stagger cards + config items */
  document.querySelectorAll(".cards .card").forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + "s";
  });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu");

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- navbar on scroll ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- pricing selector ---------- */
  var plans = Array.prototype.slice.call(document.querySelectorAll(".plan"));
  var pdDays = document.getElementById("pdDays");
  var pdOld = document.getElementById("pdOld");
  var pdNew = document.getElementById("pdNew");
  var pdOff = document.getElementById("pdOff");

  function formatPrice(value) {
    return Number(value).toLocaleString("ru-RU");
  }

  function labelFor(days, forever) {
    if (forever) return "Навсегда";
    if (Number(days) === 7) return "1 неделя";
    return days + " дней";
  }

  function selectPlan(plan) {
    plans.forEach(function (p) {
      p.classList.remove("active");
    });
    plan.classList.add("active");

    var forever = plan.dataset.forever === "1";
    var oldPrice = plan.dataset.old;
    var off = plan.dataset.off;

    if (pdDays) pdDays.textContent = labelFor(plan.dataset.days, forever);
    if (pdNew) pdNew.textContent = formatPrice(plan.dataset.price) + "₽";

    if (pdOld) {
      if (oldPrice) {
        pdOld.textContent = formatPrice(oldPrice) + "₽";
        pdOld.style.display = "";
      } else {
        pdOld.style.display = "none";
      }
    }

    if (pdOff) {
      if (off && off !== "0") {
        pdOff.textContent = "−" + off + "%";
        pdOff.style.display = "";
      } else {
        pdOff.style.display = "none";
      }
    }
  }

  plans.forEach(function (plan) {
    plan.addEventListener("click", function () {
      selectPlan(plan);
    });
  });

  /* sync the detail panel with the plan marked active in HTML */
  if (plans.length) {
    selectPlan(document.querySelector(".plan.active") || plans[0]);
  }

  /* ---------- bento cursor glow ---------- */
  var bentoEls = document.querySelectorAll("[data-bento]");
  bentoEls.forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - rect.left + "px");
      el.style.setProperty("--my", e.clientY - rect.top + "px");
    });
  });

  /* ---------- global spotlight + hero tilt ---------- */
  if (!reduceMotion) {
    var spotlight = document.getElementById("spotlight");
    if (spotlight) {
      window.addEventListener(
        "mousemove",
        function (e) {
          spotlight.style.transform =
            "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%, -50%)";
        },
        { passive: true }
      );
    }

    var tiltEl = document.querySelector("[data-tilt]");
    if (tiltEl && tiltEl.parentElement) {
      var wrap = tiltEl.parentElement;
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        tiltEl.style.transform =
          "perspective(1200px) rotateY(" + px * 6 + "deg) rotateX(" + -py * 6 + "deg)";
      });
      wrap.addEventListener("mouseleave", function () {
        tiltEl.style.transform = "perspective(1200px)";
      });
    }
  }

  /* ---------- smooth anchor offset handled by scroll-margin ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
})();
