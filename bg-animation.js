// MIT-Style Dark Theme Particle Network with Waving Turkish Flag
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    let time = 0;

    const CONFIG = {
        particleCount: 110,      // Biraz daha fazla parçacık
        particleRadius: 2.0,
        lineDistance: 170,
        mouseDistance: 200,
        speed: 1.8,              // HIZLANDIRILDI (Eskiden 0.4'tü)
        colorPrimary: '255, 255, 255',
        colorSecondary: '6, 182, 212',
        colorTertiary: '148, 163, 184',
    };

    let flagCanvas = document.createElement('canvas');
    let flagCtx = flagCanvas.getContext('2d');

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = document.body.scrollHeight || window.innerHeight;
        flagCanvas.width = W;
        flagCanvas.height = H;
        renderStaticFlag();
    }

    function renderStaticFlag() {
        flagCtx.clearRect(0, 0, W, H);
        const size = Math.min(W, H) * 0.45;
        const cx = W * 0.28;
        const cy = H * 0.38;

        flagCtx.save();
        flagCtx.globalAlpha = 0.08; // Biraz daha belirgin
        
        const r = size * 0.27;
        
        // Beyaz Hilal
        flagCtx.fillStyle = '#FFFFFF';
        flagCtx.beginPath();
        flagCtx.arc(cx - size * 0.05, cy, r, 0, Math.PI * 2);
        flagCtx.fill();

        // İç kısmı kes
        flagCtx.globalCompositeOperation = 'destination-out';
        flagCtx.beginPath();
        flagCtx.arc(cx + r * 0.25, cy, r * 0.8, 0, Math.PI * 2);
        flagCtx.fill();
        flagCtx.globalCompositeOperation = 'source-over';

        // Yıldız
        const starX = cx + r * 0.95;
        const starY = cy;
        const starR = r * 0.35;
        
        flagCtx.fillStyle = '#FFFFFF';
        flagCtx.beginPath();
        for (let i = 0; i < 10; i++) {
            const rad = i % 2 === 0 ? starR : starR * 0.4;
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const x = starX + rad * Math.cos(angle);
            const y = starY + rad * Math.sin(angle);
            i === 0 ? flagCtx.moveTo(x, y) : flagCtx.lineTo(x, y);
        }
        flagCtx.closePath();
        flagCtx.fill();
        
        flagCtx.restore();
    }

    function drawWavingFlag() {
        // Koyu arkaplan ve parlama
        ctx.fillStyle = '#070b15';
        ctx.fillRect(0, 0, W, H);
        
        const gradient = ctx.createRadialGradient(W / 2, H / 3, 10, W / 2, H / 3, Math.max(W, H) * 0.8);
        gradient.addColorStop(0, '#0f1b35');
        gradient.addColorStop(1, '#070b15');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Dalgalanma Efekti (Waving Effect)
        const sliceWidth = 4;
        const amplitude = 12;   // Dalga yüksekliği
        const frequency = 0.012; // Dalga sıklığı
        
        for (let i = 0; i < W; i += sliceWidth) {
            const yOffset = Math.sin(i * frequency + time) * amplitude;
            ctx.drawImage(
                flagCanvas, 
                i, 0, sliceWidth, H, 
                i, yOffset, sliceWidth, H
            );
        }
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;
            this.radius = Math.random() * CONFIG.particleRadius + 0.8;
            const r = Math.random();
            if (r < 0.5) this.color = CONFIG.colorPrimary;
            else if (r < 0.8) this.color = CONFIG.colorSecondary;
            else this.color = CONFIG.colorTertiary;
            this.baseAlpha = Math.random() * 0.35 + 0.15;
            this.alpha = this.baseAlpha;
            this.pulseSpeed = Math.random() * 0.04 + 0.01; // Daha hızlı parlama
            this.pulseAngle = Math.random() * Math.PI * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.12;

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONFIG.mouseDistance) {
                const force = (CONFIG.mouseDistance - dist) / CONFIG.mouseDistance * 0.05;
                this.vx += dx * force * 0.08;
                this.vy += dy * force * 0.08;
            }

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > CONFIG.speed * 2.5) {
                this.vx = (this.vx / speed) * CONFIG.speed * 2.5;
                this.vy = (this.vy / speed) * CONFIG.speed * 2.5;
            }

            if (this.x < -20) this.x = W + 20;
            if (this.x > W + 20) this.x = -20;
            if (this.y < -20) this.y = H + 20;
            if (this.y > H + 20) this.y = -20;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    function drawLine(p1, p2, dist) {
        const alpha = (1 - dist / CONFIG.lineDistance) * 0.2;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    function drawMouseLines(p) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseDistance) {
            const alpha = (1 - dist / CONFIG.mouseDistance) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        time += 0.04; // Dalga hızı
        drawWavingFlag();

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.lineDistance) {
                    drawLine(particles[i], particles[j], dist);
                }
            }
            drawMouseLines(particles[i]);
        }

        for (const p of particles) {
            p.update();
            p.draw();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX + window.scrollX;
        mouse.y = e.clientY + window.scrollY;
    });

    window.addEventListener('resize', () => {
        resize();
        for (const p of particles) {
            if (p.x > W || p.y > H) p.reset();
        }
    });

    document.addEventListener('scroll', () => {
        const newH = document.body.scrollHeight;
        if (newH !== H) {
            H = canvas.height = newH;
        }
    });

    init();
    animate();
})();
