import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './ReservationPage.css';
import Step1DateTime from '../components/reservation/Step1DateTime';
import Step2User from '../components/reservation/Step2User';
import Step3Success from '../components/reservation/Step3Success';
import type { ReservationConfirmation } from '../types';

type Step = 1 | 2 | 3;

export default function ReservationPage() {
  const [step, setStep] = useState<Step>(1);
  const [bookingData, setBookingData] = useState<{ date: string; time: string; pax: number } | null>(null);
  const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null);

  const handleStep1 = (data: { date: string; time: string; pax: number }) => {
    setBookingData(data);
    setStep(2);
  };

  const handleStep2 = (conf: ReservationConfirmation) => {
    setConfirmation(conf);
    setStep(3);
  };

  const handleRestart = () => {
    setStep(1);
    setBookingData(null);
    setConfirmation(null);
  };

  return (
    <div className="reservation-page">
      <Navbar isReservation={true} />

      {/* Main content */}
      <main className="reservation-container">
        <div className="reservation-card">
          {/* Left panel — image */}
          <div className="reservation-image-panel" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/img/Reserva.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="image-panel__decor">
              <div className="image-panel__decor-line" />
              <div className="image-panel__decor-line" style={{ width: '24px' }} />
            </div>
            <div>
              <div className="image-panel__quote">
                "El mar en tu mesa, la tradición en cada bocado."
              </div>
              <div className="image-panel__info">
                <span>📍 Calle del Puerto, 12 — Alicante</span>
                <span>🕐 Comidas: 13:30 – 16:00 · Cenas: 20:30 – 23:00</span>
                <span>📅 Martes a Domingo</span>
              </div>
            </div>
          </div>

          {/* Right panel — form */}
          <div className="reservation-form-panel">
            {/* Step indicator */}
            <div className="step-indicator">
              <div className={`step-dot ${step === 1 ? 'active' : 'done'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={`step-line ${step > 1 ? 'done' : ''}`} />
              <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <div className={`step-line ${step > 2 ? 'done' : ''}`} />
              <div className={`step-dot ${step === 3 ? 'active' : ''}`}>3</div>
            </div>

            {/* Step content */}
            {step === 1 && <Step1DateTime onNext={handleStep1} />}
            {step === 2 && bookingData && (
              <Step2User
                bookingData={bookingData}
                onNext={handleStep2}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && confirmation && (
              <Step3Success confirmation={confirmation} onRestart={handleRestart} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="res-footer">
        © 2026 Mesón Marinero · Alicante · Todos los derechos reservados
      </footer>
    </div>
  );
}
