import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';

const Recomendaciones = () => {
  const { agregarAlCarrito, menu, tema } = useGlobal();

  // FILTRAMOS SOLO LOS PLATOS MARCADOS COMO RECOMENDADOS EN LA BD
  const platosRecomendados = menu.filter(p => p.es_recomendado === 1 || p.es_recomendado === true);

  return (
    <Container className="py-5" id="menu">
      <div className="text-center mb-5">
        <h2 className="display-4 fw-bold section-title" style={{ color: 'var(--primary-color)' }}>Nuestras Recomendaciones</h2>
        <p className="text-muted">Los favoritos de nuestros clientes, seleccionados para ti.</p>
      </div>

      <Row className="justify-content-center">
        {platosRecomendados.length === 0 ? (
            <Col className="text-center py-5 opacity-50">Pronto añadiremos nuevas recomendaciones...</Col>
        ) : (
            platosRecomendados.map((plato) => (
            <Col lg={4} md={6} key={plato.id} className="mb-4">
                <Card className={`h-100 border border-primary border-opacity-10 shadow-lg rounded-4 overflow-hidden transition-all hover-lift bg-body`}>
                <div className="position-relative overflow-hidden">
                    <Card.Img 
                    variant="top" 
                    src={plato.img} 
                    style={{ height: '250px', objectFit: 'cover' }}
                    onError={(e) => e.target.src = "https://placehold.co/600x400?text=Especial+D'Elí"}
                    />
                    <div className="position-absolute bottom-0 start-0 bg-warning text-dark px-4 py-2 fw-bold fs-5 shadow">
                    S/ {parseFloat(plato.precio).toFixed(2)}
                    </div>
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-3 p-2 rounded-pill shadow-sm">⭐ RECOMENDADO</Badge>
                </div>
                <Card.Body className="text-center p-4">
                    <Card.Title className={`fw-bold fs-3 mb-3 ${tema === 'dark' ? 'text-white' : 'text-dark'}`} style={{ fontFamily: 'Oswald' }}>{plato.nombre}</Card.Title>
                    <Card.Text className={`${tema === 'dark' ? 'text-light opacity-75' : 'text-muted'} mb-4 small`}>
                    {plato.desc || "Ven y disfruta del sabor tradicional que te encanta, preparado con nuestra receta secreta."}
                    </Card.Text>
                    <Button 
                    className="btn-brasa w-100 py-3 rounded-pill fw-bold shadow-sm"
                    onClick={() => agregarAlCarrito(plato)}
                    >
                    🛒 Añadir al Carrito
                    </Button>
                </Card.Body>
                </Card>
            </Col>
            ))
        )}
      </Row>
      <style>{`
        .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important; }
        .transition-all { transition: all 0.3s ease; }
      `}</style>
    </Container>
  );
};

export default Recomendaciones;
