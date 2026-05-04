import React, { useEffect, useRef } from 'react';

/**
 * Particle Class - Logic for individual nodes
 */
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.speedY = Math.random() * 0.8 - 0.4;
        this.density = (Math.random() * 25) + 1;
    }

    draw(ctx, opacity) {
        ctx.fillStyle = `rgba(0, 210, 255, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvas.width) this.x = 0;
        else if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        else if (this.y < 0) this.y = this.canvas.height;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density * 0.5;
                const directionY = forceDirectionY * force * this.density * 0.5;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }
}

/**
 * InteractiveParticles - Elite Global Generative Background
 */
const InteractiveParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const mouse = { x: null, y: null, radius: 180 };
        let scrollY = 0;

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 7000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle(canvas));
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        const handleScroll = () => {
            scrollY = window.scrollY;
        };

        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };

        const connect = (opacity) => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const lineOpacity = (1 - (distance / 150)) * opacity;
                        ctx.strokeStyle = `rgba(0, 210, 255, ${lineOpacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const globalOpacity = Math.max(0.15, 1 - (scrollY / 600));

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouse);
                particles[i].draw(ctx, globalOpacity);
            }

            if (globalOpacity > 0.2) {
                connect(globalOpacity);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: -1,
                background: 'transparent'
            }}
        />
    );
};

export default InteractiveParticles;
