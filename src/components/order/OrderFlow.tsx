'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { AddressStep } from './AddressStep';
import { ScheduleStep } from './ScheduleStep';
import { ConfirmStep } from './ConfirmStep';
import { OrderSuccess } from './OrderSuccess';
import type { CompanyDetailDto } from '@/lib/api/types';

export interface OrderFormData {
  // Adres
  addressId?: number;
  addressSnapshot: string;
  city: string;
  district: string;
  // Tarih
  preferredPickupDate: string;
  preferredPickupTimeStart: string;
  preferredPickupTimeEnd: string;
  // Not
  customerNotes: string;
}

interface Props {
  company: CompanyDetailDto;
}

const steps = ['Adres', 'Tarih & Not', 'Onay'];

export function OrderFlow({ company }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [formData, setFormData] = useState<OrderFormData>({
    addressSnapshot: '',
    city: company.city ?? '',
    district: '',
    preferredPickupDate: '',
    preferredPickupTimeStart: '',
    preferredPickupTimeEnd: '',
    customerNotes: '',
  });

  const updateFormData = (data: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  if (orderCompleted) {
    return <OrderSuccess companyName={company.companyName} orderCode={orderCode} />;
  }

  return (
    <div>
      {/* Firma Bilgisi */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-brand bg-brand-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-heading font-bold text-brand-primary">
            {company.companyName[0]}
          </span>
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-brand-text">
            Sipariş Oluştur
          </h1>
          <p className="text-sm text-brand-text-muted">{company.companyName}</p>
        </div>
      </div>

      {/* İlerleme Çubuğu */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                i < currentStep
                  ? 'bg-brand-primary text-white'
                  : i === currentStep
                    ? 'bg-brand-primary text-white'
                    : 'bg-brand-surface border border-brand-border text-brand-text-muted'
              }`}
            >
              {i < currentStep ? (
                <CheckCircle size={16} />
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                i <= currentStep
                  ? 'text-brand-text font-medium'
                  : 'text-brand-text-muted'
              }`}
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  i < currentStep ? 'bg-brand-primary' : 'bg-brand-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Adım İçerikleri */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 0 && (
            <AddressStep
              formData={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 1 && (
            <ScheduleStep
              formData={formData}
              onUpdate={updateFormData}
              onNext={() => setCurrentStep(2)}
              onBack={() => setCurrentStep(0)}
            />
          )}
          {currentStep === 2 && (
            <ConfirmStep
              company={company}
              formData={formData}
              onBack={() => setCurrentStep(1)}
              onSuccess={(code) => {
                setOrderCode(code);
                setOrderCompleted(true);
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
