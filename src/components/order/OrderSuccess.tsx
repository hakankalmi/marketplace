'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Props {
  companyName: string;
  orderCode: string;
}

export function OrderSuccess({ companyName, orderCode }: Props) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Konfeti benzeri animasyonlu ikon */}
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-success/10 flex items-center justify-center"
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

      <motion.h2
        className="text-2xl font-heading font-bold text-brand-text"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Siparişiniz Alındı!
      </motion.h2>

      <motion.p
        className="mt-2 text-brand-text-muted max-w-sm mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <strong>{companyName}</strong> en kısa sürede sizinle iletişime geçecek.
      </motion.p>

      {orderCode && (
        <motion.div
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-surface rounded-brand border border-brand-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm text-brand-text-muted">Sipariş Kodu:</span>
          <span className="font-mono font-medium text-brand-text">
            {orderCode}
          </span>
        </motion.div>
      )}

      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/hesabim/siparislerim">
          <Button variant="primary">
            Siparişlerimi Gör
            <ArrowRight size={16} />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="secondary">Anasayfaya Dön</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
