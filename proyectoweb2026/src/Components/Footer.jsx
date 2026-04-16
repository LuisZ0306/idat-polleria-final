import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <h4 className="fw-bold mb-3">Pollería D' Elí</h4>
            <p className="text-secondary">Dedicados a llevar el sabor tradicional de nuestra tierra a cada mesa.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h5 className="fw-bold mb-3">Contacto</h5>
            <ul className="list-unstyled text-secondary">
              <li className="mb-2">📍 Av. Arenal 123, Nauta</li>
              <li className="mb-2">📞 (01) 234-5678</li>
              <li className="mb-2">📱 +51 919723937</li>
              <li className="mb-2">✉️ contacto@delipolleria.com</li>
            </ul>
          </Col>
          <Col md={4} className="mb-4 text-center text-md-start">
            <h5 className="fw-bold mb-3">Redes Sociales</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="https://wa.me/51919723937" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-whatsapp fs-5"></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr className="mt-4 border-secondary" />
        <div className="text-center text-secondary small pt-3">
          &copy; {new Date().getFullYear()} Pollería D' Elí - Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
