import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useReveal } from '../services/useReveal';

const testimonials = [
  {
    id: 1,
    name: 'Marta García',
    quote: 'La mejor paella que he probado en años. El servicio impecable y las vistas al mar son el complemento perfecto.',
    rating: 5
  },
  {
    id: 2,
    name: 'Juan Pérez',
    quote: 'Un lugar con alma. El pulpo estaba en su punto exacto. Repetiremos sin duda.',
    rating: 5
  },
  {
    id: 3,
    name: 'Elena Rodríguez',
    quote: 'Tradición y calidad. Se nota el cariño en cada plato. Muy recomendado para cenas románticas.',
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useReveal();

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev: number) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev: number) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (isPaused || isDragging) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, isDragging]);

  // Drag Handlers
  const handleDragStart = (x: number) => {
    setIsDragging(true);
    setStartX(x);
    setDragOffset(0);
  };

  const handleDragMove = (x: number) => {
    if (!isDragging) return;
    const diff = x - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 50;
    if (dragOffset < -threshold) {
      nextSlide();
    } else if (dragOffset > threshold) {
      prevSlide();
    }
    setDragOffset(0);
  };

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.pageX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.pageX);
  const onMouseUp = () => handleDragEnd();

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].pageX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].pageX);
  const onTouchEnd = () => handleDragEnd();

  const getTranslateX = () => {
    const baseTranslate = -(currentIndex * 100);
    if (!containerRef.current || !isDragging) return `${baseTranslate}%`;
    
    const containerWidth = containerRef.current.offsetWidth;
    const offsetPercent = (dragOffset / containerWidth) * 100;
    return `calc(${baseTranslate}% + ${offsetPercent}%)`;
  };

  return (
    <section className="testimonials" ref={revealRef}>
      <div className="section-header reveal">
        <h2>Lo que dicen nuestros clientes</h2>
      </div>
      
      <div 
        className={`carousel-container ${isDragging ? 'dragging' : ''}`}
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          if (isDragging) handleDragEnd();
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="carousel-track" 
          style={{ 
            transform: `translateX(${getTranslateX()})`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {testimonials.map((item) => (
            <div key={item.id} className="carousel-slide">
              <div className="testimonial-card">
                <div className="rating">
                  {'⭐'.repeat(item.rating)}
                </div>
                <p className="quote">"{item.quote}"</p>
                <p className="customer-name">- {item.name}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-nav prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Anterior">‹</button>
        <button className="carousel-nav next" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Siguiente">›</button>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              aria-label={`Ir a reseña ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
