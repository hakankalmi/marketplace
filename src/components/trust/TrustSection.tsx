'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Shield, Award, Clock, ThumbsUp } from 'lucide-react';

function AnimatedCounter({
  target,
  suffix = '',
  duration = 2,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString('tr-TR')}
      {suffix}
    </span>
  );
}

const stats = [
  {
    icon: Shield,
    value: 500,
    suffix: '+',
    label: 'Doğrulanmış Firma',
    description: 'Tüm firmalar kontrol edilmiştir',
  },
  {
    icon: ThumbsUp,
    value: 10000,
    suffix: '+',
    label: 'Tamamlanan Sipariş',
    description: 'Müşteri memnuniyeti garantili',
  },
  {
    icon: Award,
    value: 4.8,
    suffix: '',
    label: 'Ortalama Puan',
    description: 'Gerçek müşteri değerlendirmesi',
  },
  {
    icon: Clock,
    value: 15,
    suffix: ' dk',
    label: 'Ortalama Yanıt Süresi',
    description: 'Hızlı geri dönüş',
  },
];

export function TrustSection() {
  return (
    <section className="py-16 lg:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-text">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="mt-3 text-brand-text-muted text-lg max-w-2xl mx-auto">
            Güvenilir firmalar, şeffaf fiyatlar, kolay sipariş
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-brand-surface rounded-brand border border-brand-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-brand bg-brand-primary/10 flex items-center justify-center">
                <stat.icon size={24} className="text-brand-primary" />
              </div>
              <div className="text-3xl font-heading font-bold text-brand-text">
                {typeof stat.value === 'number' && stat.value >= 1 ? (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={stat.value > 100 ? 2 : 1}
                  />
                ) : (
                  <>
                    {stat.value}
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="mt-1 font-medium text-brand-text">
                {stat.label}
              </div>
              <p className="mt-1 text-sm text-brand-text-muted">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
