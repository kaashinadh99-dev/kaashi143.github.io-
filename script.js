document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });
  }

  // 3. Hacker's Lab Canvas Engine
  const canvas = document.getElementById('hacker-lab-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: -9999, y: -9999, active: false };
  const hudCoords = document.getElementById('hud-coords');
  const hudPacket = document.getElementById('hud-packet');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    if (hudCoords) {
      const xStr = String(Math.round(e.clientX)).padStart(4, '0');
      const yStr = String(Math.round(e.clientY)).padStart(4, '0');
      hudCoords.textContent = `CURSOR: ${xStr}.${yStr}`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // --- Layer A: Subtle Hex/Code Stream ---
  const glyphs = '01アイウエオカキクケコABCDEF<>/{}[]$#';
  const fontSize = 13;
  let columns = Math.floor(width / 28);
  let drops = Array.from({ length: columns }, () => Math.random() * -50);

  // --- Layer B: Interactive Network Nodes & Data Packets ---
  const nodeCount = Math.min(55, Math.floor((width * height) / 24000));
  const nodes = [];
  const packets = [];

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.38;
      this.vy = (Math.random() - 0.5) * 0.38;
      this.radius = Math.random() * 1.6 + 1.1;
      this.isAccent = Math.random() > 0.72;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isAccent
        ? 'rgba(16, 185, 129, 0.75)'
        : 'rgba(0, 240, 255, 0.65)';
      ctx.fill();
    }
  }

  class DataPacket {
    constructor(startNode, endNode) {
      this.start = startNode;
      this.end = endNode;
      this.progress = 0;
      this.speed = 0.018 + Math.random() * 0.02;
    }

    update() {
      this.progress += this.speed;
      return this.progress >= 1;
    }

    draw() {
      const x = this.start.x + (this.end.x - this.start.x) * this.progress;
      const y = this.start.y + (this.end.y - this.start.y) * this.progress;

      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initNodes() {
    nodes.length = 0;
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
  }
  initNodes();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 28);
    drops = Array.from({ length: columns }, () => Math.random() * -50);
    initNodes();
  });

  // Cycle subtle HUD status messages
  const telemetryStates = [
    'ENCRYPTED // 256-BIT',
    'SOCKET // LISTENING',
    'API.GATEWAY // READY',
    'FIREWALL // ACTIVE'
  ];
  let stateIdx = 0;
  setInterval(() => {
    if (hudPacket) {
      stateIdx = (stateIdx + 1) % telemetryStates.length;
      hudPacket.textContent = telemetryStates[stateIdx];
    }
  }, 4200);

  // Main Animation Loop
  let frame = 0;
  function animate() {
    frame++;
    ctx.clearRect(0, 0, width, height);

    // 1. Render subtle matrix/hex code rain (updated every 3 frames for smooth, calm speed)
    ctx.font = `${fontSize}px "DM Mono", monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * 28;
      const y = drops[i] * fontSize;

      ctx.fillStyle = i % 5 === 0
        ? 'rgba(16, 185, 129, 0.13)'
        : 'rgba(0, 240, 255, 0.08)';
      ctx.fillText(char, x, y);

      if (frame % 3 === 0) {
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    // 2. Update & connect lab nodes
    const maxDist = 155;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.update();
      a.draw();

      // Connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Occasionally spawn a glowing data packet along an active link
          if (packets.length < 14 && Math.random() < 0.0008) {
            packets.push(new DataPacket(a, b));
          }
        }
      }

      // Connect nodes to user's cursor
      if (mouse.active) {
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < 190) {
          const mAlpha = (1 - mDist / 190) * 0.45;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 3. Render traveling data packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const done = packets[i].update();
      packets[i].draw();
      if (done) packets.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  animate();
});
