import React from 'react';

const BookingInfo: React.FC = () => {
  return (
    <section className="booking-info" id="contact">
      <div className="booking-container">
        <div className="booking-form-side">
          <h3>Reserva tu mesa</h3>
          <form className="quick-booking-form">
            <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input type="date" id="date" required />
            </div>
            <div className="form-group">
              <label htmlFor="people">Personas</label>
              <select id="people" required>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Persona' : 'Personas'}</option>
                ))}
                <option value="9+">Más de 8</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="time">Hora</label>
              <input type="time" id="time" required />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2">Reservar ahora</button>
          </form>
        </div>
        
        <div className="info-side">
          <h3>Información Práctica</h3>
          <div className="info-content">
            <div className="info-item">
              <span className="info-label">Horario:</span>
              <p>Lunes a Domingo: 13:00 - 16:30 | 20:00 - 23:30</p>
            </div>
            <div className="info-item">
              <span className="info-label">Días de cierre:</span>
              <p>Martes (Excepto festivos)</p>
            </div>
            <div className="info-item">
              <span className="info-label">Bienvenidos:</span>
              <p>En el Mesón Marinero, cada reserva es una oportunidad para hacerte sentir como en casa. Te esperamos con los mejores productos del mar.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingInfo;
