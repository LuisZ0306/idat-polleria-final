import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div 
      className="p-5 text-center bg-image hero-section"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/img/banner-publicidad.jpg')",
        width: '100%',
        aspectRatio: '1078 / 708', 
        maxHeight: '85vh', 
        backgroundSize: '100% 100%', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container>
        <div className="d-flex flex-column align-items-center animate-fade-in">
          <h1 className="display-1 fw-bold mb-3" style={{ fontFamily: 'Oswald', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
            Sabor Único en <span style={{ color: 'var(--secondary-color)' }}>Cada Brasa</span>
          </h1>
          <p className="lead mb-5 fs-3 fw-light" style={{ maxWidth: '700px' }}>
            Descubre por qué somos la pollería favorita. Tradición, calidad y el punto exacto de sabor.
          </p>
          <div className="d-flex gap-4 flex-wrap justify-content-center">
            <Button as={Link} to="/menu" className="btn-brasa px-5 py-3 fs-5">
              🔥 Ver Carta
            </Button>
            <Button as={Link} to="/reservas" variant="outline-light" className="px-5 py-3 fs-5 rounded-pill border-2 fw-bold shadow-lg" style={{ transition: 'all 0.3s' }}>
              📅 Reservar Mesa
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Estilos locales para la animación del hero */}
      <style>{`
        .hero-section {
          animation: bgZoom 20s infinite alternate ease-in-out;
        }
        @keyframes bgZoom {
          from { background-size: 100% 100%; }
          to { background-size: 110% 110%; }
        }
        @media (max-width: 768px) {
          .hero-section {
            aspect-ratio: auto;
            min-height: 50vh !important;
            background-size: cover !important;
            animation: none;
          }
          .display-1 {
            font-size: 2.5rem !important;
          }
          .fs-3 {
            font-size: 1.1rem !important;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};


export default HeroBanner;
