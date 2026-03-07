'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CompanyCard } from './CompanyCard';
import { Button } from '@/components/ui/button';
import type { CompanyListDto } from '@/lib/api/types';

interface FeaturedCompaniesProps {
  companies: CompanyListDto[];
}

export function FeaturedCompanies({ companies }: FeaturedCompaniesProps) {
  if (companies.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-3xl font-heading font-bold text-brand-text">
              Öne Çıkan Firmalar
            </h2>
            <p className="mt-2 text-brand-text-muted">
              En yüksek puanlı ve en çok tercih edilen firmalar
            </p>
          </div>
          <Link href="/firmalar" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Tümünü Gör
              <ArrowRight size={16} />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.slice(0, 6).map((company, i) => (
            <CompanyCard key={company.companyId} company={company} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/firmalar">
            <Button variant="outline">
              Tüm Firmaları Gör
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
