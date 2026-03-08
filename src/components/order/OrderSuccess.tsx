'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Copy, Check, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  companyName: string;
  orderCode: string;
}

/** Lightweight confetti using CSS keyframes + random particles */
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; angle: number; spin: number; life: number }[] = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -10 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.vy += 0.25; // gravity
        p.y += p.vy;
        p.angle += p.spin;
        p.life -= 0.012;
        p.vx *= 0.99;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (alive) frame = requestAnimationFrame(animate);
    };

    // Start after brief delay for dramatic effect
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 10 }}
    />
  );
}

export function OrderSuccess({ companyName, orderCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Siparisim',
          text: `${companyName} firmasina siparis verdim! Siparis kodu: ${orderCode}`,
        });
      } catch { /* user cancelled */ }
    }
  };

  return (
    <motion.div
      className="text-center py-12 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <ConfettiCanvas />

      {/* Pulsing ring effect behind icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-full bg-brand-success/20"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
          transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-brand-success/10 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          >
            <CheckCircle size={40} className="text-brand-success" />
          </motion.div>
        </motion.div>
      </div>

      <motion.h2
        className="text-2xl font-heading font-bold text-brand-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Siparissiniz Alindi!
      </motion.h2>

      <motion.p
        className="mt-2 text-brand-text-muted max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <strong>{companyName}</strong> en kisa surede sizinle iletisime gececek.
      </motion.p>

      {orderCode && (
        <motion.div
          className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-brand-surface rounded-brand border border-brand-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm text-brand-text-muted">Siparis Kodu:</span>
          <span className="font-mono font-bold text-brand-primary text-lg tracking-wider">
            {orderCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-brand-primary/10 transition-colors"
            title="Kopyala"
          >
            {copied ? (
              <Check size={16} className="text-brand-success" />
            ) : (
              <Copy size={16} className="text-brand-text-muted" />
            )}
          </button>
        </motion.div>
      )}

      {/* Info cards */}
      <motion.div
        className="mt-6 max-w-sm mx-auto space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-brand text-left">
          <p className="text-sm text-blue-800 font-medium">Sirada ne var?</p>
          <p className="text-xs text-blue-600 mt-0.5">
            Firma siparisinizi inceleyecek ve size geri donecek.
            Bildirimlerle sizi haberdar edecegiz.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/hesabim/siparislerim">
          <Button variant="primary">
            Siparislerimi Gor
            <ArrowRight size={16} />
          </Button>
        </Link>
        {'share' in navigator && (
          <Button variant="secondary" onClick={handleShare}>
            <Share2 size={16} />
            Paylas
          </Button>
        )}
        <Link href="/">
          <Button variant="secondary">Anasayfaya Don</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
