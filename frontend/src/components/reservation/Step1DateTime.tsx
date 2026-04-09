import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAvailableTimes, getPublicConfig } from '../../services/api';
import type { TimeSlot } from '../../types';

interface Props {
  onNext: (data: { date: string; time: string; pax: number }) => void;
}

export default function Step1DateTime({ onNext }: Props) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState('');
  const [pax, setPax] = useState(2);
  const [maxPax, setMaxPax] = useState(12); // Default to 12
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicConfig().then(data => {
      if (data.maxPax) setMaxPax(data.maxPax);
    }).catch(err => console.error('Error fetching public config:', err));
  }, []);

  useEffect(() => {
    if (!date || !pax) return;
    setSelectedTime('');
    setSlots([]);
    setSlotsError('');
    setLoadingSlots(true);
    getAvailableTimes(date, pax)
      .then((data) => {
        const available = data.filter((s: TimeSlot) => s.available);
        if (available.length === 0) {
          setSlotsError(t('reservation.errorNoSlots'));
        }
        setSlots(data);
      })
      .catch(() => setSlotsError(t('reservation.errorLoadSlots')))
      .finally(() => setLoadingSlots(false));
  }, [date, pax, t]);

  const handleSubmit = () => {
    if (!date) { setError(t('reservation.errorNoDate')); return; }
    if (!selectedTime) { setError(t('reservation.errorNoTime')); return; }
    setError('');
    onNext({ date, time: selectedTime, pax });
  };

  return (
    <div>
      <h2 className="form-title">{t('reservation.step1Title')}</h2>
      <p className="form-subtitle">{t('reservation.step1Subtitle')}</p>

      <div className="form-grid">
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label htmlFor="res-date">{t('reservation.dateLabel')}</label>
            <input
              id="res-date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => { setDate(e.target.value); setError(''); }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="res-pax">{t('reservation.paxLabel')}</label>
            <select
              id="res-pax"
              value={pax}
              onChange={(e) => setPax(Number(e.target.value))}
            >
              {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? t('reservation.person') : t('reservation.persons')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time slots */}
        {date && (
          <div>
            <span className="time-slots-label">{t('reservation.timeLabel')}</span>
            {loadingSlots && (
              <div className="time-slots-loading">
                <span>⏳</span> {t('reservation.loadingSlots')}
              </div>
            )}
            {!loadingSlots && slotsError && (
              <div className="time-slots-empty">{slotsError}</div>
            )}
            {!loadingSlots && !slotsError && slots.length > 0 && (
              <div className="time-slots-grid">
                {slots
                  .filter((s) => s.available)
                  .map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      className={`time-slot-btn${selectedTime === s.time ? ' selected' : ''}`}
                      onClick={() => { setSelectedTime(s.time); setError(''); }}
                    >
                      {s.time}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={!date || !selectedTime}
          style={{ marginTop: '0.5rem' }}
        >
          {t('reservation.nextBtn')}
        </button>
      </div>
    </div>
  );
}
