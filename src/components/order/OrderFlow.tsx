'use client';

import { useState, useEffect, useCallback } from 'react';
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
  latitude?: number;
  longitude?: number;
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
const FORM_STORAGE_KEY = 'mp_order_form';

function saveFormToSession(step: number, data: OrderFormData) {
  try {
    sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ step, data }));
  } catch { /* quota exceeded etc */ }
}

function loadFormFromSession(): { step: number; data: OrderFormData } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearFormSession() {
  try {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
  } catch { /* ignore */ }
}

const defaultFormData = (city: string): OrderFormData => ({
  addressSnapshot: '',
  city,
  district: '',
  preferredPickupDate: '',
  preferredPickupTimeStart: '',
  preferredPickupTimeEnd: '',
  customerNotes: '',
});

export function OrderFlow({ company }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [formData, setFormData] = useState<OrderFormData>(() => defaultFormData(company.city ?? ''));
  const [restored, setRestored] = useState(false);

  // Restore from sessionStorage after hydration (client-side only)
  useEffect(() => {
    const saved = loadFormFromSession();
    if (saved?.data && saved.data.addressSnapshot) {
      setFormData(saved.data);
      setCurrentStep(saved.step);
      clearFormSession();
    }
    setRestored(true);
  }, []);

  const updateFormData = useCallback((data: Partial<OrderFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // Persist form data on every change so it survives login redirect
  useEffect(() => {
    if (restored && formData.addressSnapshot) {
      saveFormToSession(currentStep, formData);
    }
  }, [formData, currentStep, restored]);

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
                i <= currentStep
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
              serviceAreas={company.serviceAreas ?? []}
              companyCity={company.city ?? ''}
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
                clearFormSession();
                setOrderCode(code);
                setOrderCompleted(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
