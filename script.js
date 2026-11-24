const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Subtle pointer glow on project and skill cards.
document.querySelectorAll(".skill-card, .project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  });
});


// Live Matrix-style code rain. Pauses in hidden tabs to save resources.
(() => {
  const canvas = document.getElementById("matrix-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;
  const glyphs = "アイウエオカキクケコサシスセソタチツテトナニヌネノ012345789ABCDEF<>/{}[]$#";
  const fontSize = 14;
  let drops = [], width = 0, height = 0, raf = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drops = Array.from({length: Math.ceil(width / fontSize)}, () => Math.random() * (height / fontSize));
  }
  function draw() {
    ctx.fillStyle = "rgba(3, 8, 10, 0.075)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px "DM Mono", monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > .985 ? "#c6fff1" : "#42dcb5";
      ctx.globalAlpha = Math.random() > .96 ? .9 : .42;
      ctx.fillText(char, i * fontSize, y);
      ctx.globalAlpha = 1;
      if (y > height && Math.random() > .975) drops[i] = 0;
      else drops[i] += .55 + Math.random() * .42;
    }
    raf = requestAnimationFrame(draw);
  }
  function start() { if (!reduced && !document.hidden && !raf) raf = requestAnimationFrame(draw); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  resize(); ctx.clearRect(0, 0, width, height); start();
  window.addEventListener("resize", () => { resize(); ctx.clearRect(0, 0, width, height); }, {passive:true});
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
})();
