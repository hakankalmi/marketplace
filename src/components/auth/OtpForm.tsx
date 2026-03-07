'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowLeft, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { requestOtp, verifyOtp, saveAuth } from '@/lib/api/auth';
import { BRAND_CODE } from '@/lib/constants';

type Step = 'phone' | 'otp';

export function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Geçerli bir telefon numarası girin.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await requestOtp({ phone: cleaned, brandCode: BRAND_CODE });
      setStep('otp');
      setCountdown(120);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'SMS gönderilemedi. Lütfen tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async (code: string) => {
    const cleaned = phone.replace(/\D/g, '');
    setLoading(true);
    setError('');
    try {
      const auth = await verifyOtp({
        phone: cleaned,
        code,
        brandCode: BRAND_CODE,
      });
      saveAuth(auth);
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Kod doğrulanamadı. Lütfen tekrar deneyin.'
      );
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [phone, redirect, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when 6 digits entered
    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      handleVerifyOtp(paste);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md p-8 bg-brand-surface rounded-brand-lg border border-brand-border shadow-brand"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Phone size={24} className="text-brand-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-brand-text">
                Giriş Yap
              </h1>
              <p className="text-sm text-brand-text-muted mt-1">
                Telefon numaranızı girin, SMS ile doğrulama kodu göndereceğiz.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Telefon Numarası"
                icon={<Phone size={18} />}
                type="tel"
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                error={error || undefined}
              />

              <Button
                size="lg"
                className="w-full"
                loading={loading}
                onClick={handleSendOtp}
              >
                Doğrulama Kodu Gönder
              </Button>
            </div>

            <p className="mt-4 text-xs text-brand-text-muted text-center">
              Devam ederek{' '}
              <a href="/kullanim-kosullari" className="text-brand-primary hover:underline">
                Kullanım Koşulları
              </a>
              &apos;nı kabul etmiş olursunuz.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <button
              onClick={() => {
                setStep('phone');
                setError('');
                setOtp(['', '', '', '', '', '']);
              }}
              className="flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-text transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              Geri
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Shield size={24} className="text-brand-primary" />
              </div>
              <h2 className="text-xl font-heading font-bold text-brand-text">
                Doğrulama Kodu
              </h2>
              <p className="text-sm text-brand-text-muted mt-1">
                <strong>{phone}</strong> numarasına gönderilen 6 haneli kodu girin.
              </p>
            </div>

            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-mono font-bold bg-brand-bg border border-brand-border rounded-brand text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-brand-error text-center mb-4">
                {error}
              </p>
            )}

            {loading && (
              <p className="text-sm text-brand-text-muted text-center mb-4">
                Doğrulanıyor...
              </p>
            )}

            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-brand-text-muted">
                  Yeni kod gönder ({Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, '0')})
                </p>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-sm text-brand-primary hover:underline"
                >
                  Tekrar Kod Gönder
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
