// Canvas decorativo local: se crea al entrar, se detiene fuera de la región.
export class RegionEffects {
  constructor(canvas, theme, win) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.theme = theme;
    this.win = win;
    this.frame = null;
    this.particles = [];
    this.previous = 0;
    this.resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      this.width = width; this.height = height;
      const ratio = Math.min(win.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      this.particles = Array.from({ length: Math.min(180, Math.max(35, Math.round(width * height / 9000))) }, () => this.createParticle(true));
    };
    this.observer = new win.ResizeObserver(this.resize);
    this.observer.observe(canvas);
    this.resize();
  }

  createParticle(randomY = false) {
    const ember = this.theme === 'embers' && Math.random() > 0.43;
    return { x: Math.random() * this.width, y: randomY ? Math.random() * this.height : ember ? this.height + 15 : -15, size: Math.random() * (ember ? 2.4 : 2.1) + 0.5, speed: 12 + Math.random() * (ember ? 72 : 32), drift: Math.random() * 28 - 14, phase: Math.random() * Math.PI * 2, opacity: Math.random() * 0.55 + 0.2, ember };
  }

  draw(time) {
    if (this.frame === null) return;
    const delta = this.previous ? Math.min((time - this.previous) / 1000, 0.05) : 0;
    this.previous = time;
    const ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y += (p.ember || this.theme === 'arcane' ? -1 : 1) * p.speed * delta;
      p.x += (p.drift + Math.sin(time / 1700 + p.phase) * 13) * delta;
      if (p.y < -25 || p.y > this.height + 25 || p.x < -25 || p.x > this.width + 25) { this.particles[i] = this.createParticle(); if (this.theme === 'arcane') this.particles[i].y = this.height + 10; continue; }
      ctx.globalAlpha = p.opacity * (this.theme === 'arcane' ? 0.65 + Math.sin(time / 1300 + p.phase) * 0.35 : 1);
      ctx.fillStyle = p.ember ? '#ffb262' : this.theme === 'snow' ? '#e9f2ff' : this.theme === 'arcane' ? '#d9bcff' : this.theme === 'embers' ? '#b6aaa1' : '#e9d79c';
      ctx.shadowBlur = p.ember || this.theme === 'arcane' ? 9 : 0;
      ctx.shadowColor = ctx.fillStyle;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, this.theme === 'leaves' ? p.size * 0.38 : p.ember ? p.size * 1.8 : p.size, Math.sin(time / 3000 + p.phase), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    this.frame = this.win.requestAnimationFrame(next => this.draw(next));
  }

  start() {
    if (this.frame !== null || !this.context) return;
    this.previous = 0;
    this.frame = this.win.requestAnimationFrame(time => this.draw(time));
  }

  stop() {
    if (this.frame !== null) this.win.cancelAnimationFrame(this.frame);
    this.frame = null;
    this.previous = 0;
    this.context?.clearRect(0, 0, this.width, this.height);
  }

  destroy() { this.stop(); this.observer.disconnect(); }
}
