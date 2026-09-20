const PROJECTS = [
  {
    title: "Ditzzx Snippets",
    description:
      "Library snippet Node.js dan JavaScript pribadi. Bisa telusuri per kategori, filter tag, lalu salin atau unduh langsung.",
    tech: ["Node.js", "JavaScript"],
    demo: "https://gist.ditzzzx.my.id/",
    repo: "",
  },
  {
    title: "COST — Club of Science and Technology",
    description:
      "Website resmi ekstrakurikuler sains & teknologi sekolah: profil klub, sejarah, kegiatan, dan galeri foto.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "Supabase"],
    demo: "https://cost.biz.id/",
    repo: "",
  },
  {
    title: "Segera Hadir",
    description:
      "Project berikutnya sedang dikerjakan. Nantikan detailnya di sini.",
    tech: [],
    demo: "",
    repo: "",
  },
];

(function renderProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;

  const frag = document.createDocumentFragment();

  const linkIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';

  PROJECTS.forEach((project, i) => {
    const isLink = Boolean(project.demo);
    const card = document.createElement(isLink ? "a" : "article");
    card.className = "project-card";
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--d", `${i * 80}ms`);

    if (isLink) {
      card.href = project.demo;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `Buka proyek ${project.title} di tab baru`);
    }

    const num = document.createElement("span");
    num.className = "p-num";
    num.textContent = String(i + 1).padStart(2, "0");

    const body = document.createElement("div");
    body.className = "p-body";

    const title = document.createElement("h3");
    title.className = "p-title";
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.className = "p-desc";
    desc.textContent = project.description;

    const tags = document.createElement("div");
    tags.className = "p-tags";
    (project.tech || []).forEach((t) => {
      const tag = document.createElement("span");
      tag.textContent = t;
      tags.appendChild(tag);
    });

    body.append(title, desc, tags);

    const links = document.createElement("div");
    links.className = "p-links";

    if (isLink) {

      const open = document.createElement("span");
      open.className = "p-link";
      open.innerHTML = `<span class="p-link-text">Lihat Project</span> <span class="p-link-icon">${linkIcon}</span>`;
      links.appendChild(open);
    } else {
      const soon = document.createElement("span");
      soon.className = "p-link disabled";
      soon.setAttribute("aria-disabled", "true");
      soon.textContent = "Segera";
      links.appendChild(soon);
    }

    card.append(num, body, links);
    frag.appendChild(card);
  });

  list.appendChild(frag);
})();

(function initMarquee() {
  const tracks = Array.from(document.querySelectorAll(".marquee-track"));
  if (!tracks.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const build = (track) => {
    const base = track.querySelector(".m-set:not([data-clone])");
    track.querySelectorAll(".m-set[data-clone]").forEach((node) => node.remove());
    if (!base || reduceMotion) return;

    const setWidth = base.getBoundingClientRect().width;
    if (!setWidth) return;

    // Satu paruh track harus menutupi seluruh lebar viewport supaya baris
    // marquee benar-benar penuh dari ujung ke ujung. Jumlah set dibuat genap
    // agar translateX(-50%) tetap presisi dan loop tidak melompat.
    const perHalf = Math.max(1, Math.ceil(window.innerWidth / setWidth));
    const totalSets = perHalf * 2;

    const frag = document.createDocumentFragment();
    for (let i = 1; i < totalSets; i += 1) {
      const clone = base.cloneNode(true);
      clone.setAttribute("data-clone", "");
      clone.setAttribute("aria-hidden", "true");
      frag.appendChild(clone);
    }
    track.appendChild(frag);

    // Kecepatan tetap sama seperti sebelumnya: satu lebar set per 32 detik.
    track.style.animationDuration = `${32 * perHalf}s`;
  };

  const sync = () => tracks.forEach(build);
  sync();

  let raf = 0;
  window.addEventListener(
    "resize",
    () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    },
    { passive: true }
  );
})();

(function initReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => io.observe(el));
})();

(function initParallax() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const layers = document.querySelectorAll("[data-parallax]");
  if (reduce || coarse || layers.length === 0) return;

  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    layers.forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translate3d(0, ${y * factor}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
})();

(function initNav() {
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

(function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("site-nav");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    panel.classList.toggle("open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  panel.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
})();