document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year & Live Clock
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const hudClock = document.getElementById('hud-clock');
  const updateClock = () => {
    if (!hudClock) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    hudClock.textContent = `IST ${timeStr} // SYNCED`;
  };
  updateClock();
  setInterval(updateClock, 1000);

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

  // 3. Interactive Spotlight Effect on Cards
  const spotlightCards = document.querySelectorAll('.spotlight-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // 4. Live Terminal Log Stream in Bottom-Left HUD
  const hudFeed = document.getElementById('hud-feed');
  const logPool = [
    '> handshake TLSv1.3 verified',
    '> spotify_api.sync() -> 200 OK',
    '> pubsub stream: 0 packet loss',
    '> decrypting payload [AES-256]',
    '> daemon clubby_audio active',
    '> routing node: IN-KL-01',
    '> memory integrity: OPTIMAL'
  ];
  let logIndex = 0;
  setInterval(() => {
    if (!hudFeed) return;
    const nextLog = logPool[logIndex % logPool.length];
    logIndex++;
    const line = document.createElement('span');
    line.textContent = nextLog;
    hudFeed.appendChild(line);
    if (hudFeed.children.length > 2) {
      hudFeed.removeChild(hudFeed.firstChild);
    }
  }, 3600);

  // 5. Hacker's Lab Interactive Canvas
  const canvas = document.getElementById('hacker-lab-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: -9999, y: -9999, active: false };
  const hudCoords = document.getElementById('hud-coords');

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    if (hudCoords) {
      const xStr = String(Math.round(e.clientX)).padStart(4, '0');
      const yStr = String(Math.round(e.clientY)).padStart(4, '0');
      hudCoords.textContent = `X:${xStr} Y:${yStr}`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Click Sonar Shockwaves
  const pulses = [];
  window.addEventListener('click', (e) => {
    pulses.push({
      x: e.clientX,
      y: e.clientY,
      radius: 4,
      maxRadius: 340,
      alpha: 0.65
    });
  });

  // Subtle Hex/Katakana Rain Columns
  const glyphs = '01アイウエオカキクケコABCDEF<>/{}[]$#';
  const fontSize = 12;
  let columns = Math.floor(width / 32);
  let drops = Array.from({ length: columns }, () => Math.random() * -60);

  // Neural Circuit Nodes & Packets
  const nodeCount = Math.min(60, Math.floor((width * height) / 22000));
  const nodes = [];
  const packets = [];

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.34;
      this.vy = (Math.random() - 0.5) * 0.34;
      this.radius = Math.random() * 1.5 + 1.1;
      this.isEmerald = Math.random() > 0.7;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += 0.04;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const glow = 0.5 + Math.sin(this.pulsePhase) * 0.25;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isEmerald
        ? `rgba(16, 185, 129, ${glow + 0.2})`
        : `rgba(0, 240, 255, ${glow + 0.15})`;
      ctx.fill();

      // Outer halo ring on accent nodes
      if (this.radius > 2.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }

  class DataPacket {
    constructor(a, b) {
      this.a = a;
      this.b = b;
      this.t = 0;
      this.speed = 0.016 + Math.random() * 0.018;
      this.color = Math.random() > 0.4 ? '#00f0ff' : '#10b981';
    }

    update() {
      this.t += this.speed;
      return this.t >= 1;
    }

    draw() {
      const x = this.a.x + (this.b.x - this.a.x) * this.t;
      const y = this.a.y + (this.b.y - this.a.y) * this.t;

      ctx.beginPath();
      ctx.arc(x, y, 2.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
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
    columns = Math.floor(width / 32);
    drops = Array.from({ length: columns }, () => Math.random() * -60);
    initNodes();
  });

  let frame = 0;
  function animate() {
    frame++;
    ctx.clearRect(0, 0, width, height);

    // 1. Calm Peripheral Code Rain
    ctx.font = `${fontSize}px "DM Mono", monospace`;
    for (let i = 0; i < drops.length; i++) {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * 32;
      const y = drops[i] * fontSize;

      ctx.fillStyle = i % 4 === 0
        ? 'rgba(16, 185, 129, 0.11)'
        : 'rgba(0, 240, 255, 0.07)';
      ctx.fillText(char, x, y);

      if (frame % 3 === 0) {
        if (y > height && Math.random() > 0.978) drops[i] = 0;
        drops[i]++;
      }
    }

    // 2. Sonar Click Shockwaves
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.radius += 5.5;
      p.alpha *= 0.965;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      if (p.radius >= p.maxRadius || p.alpha < 0.02) {
        pulses.splice(i, 1);
      }
    }

    // 3. Node Network & Cursor Tether
    const maxDist = 160;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.update();
      a.draw();

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          if (packets.length < 18 && Math.random() < 0.0009) {
            packets.push(new DataPacket(a, b));
          }
        }
      }

      if (mouse.active) {
        const mDist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (mDist < 200) {
          const mAlpha = (1 - mDist / 200) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // 4. Glowing Data Packets
    for (let i = packets.length - 1; i >= 0; i--) {
      if (packets[i].update()) packets.splice(i, 1);
      else packets[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
});
