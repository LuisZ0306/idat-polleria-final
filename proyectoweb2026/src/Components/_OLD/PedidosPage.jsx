import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../Context/GlobalContext';

const PedidosPage = () => {
  const { carrito, eliminarDelCarrito, finalizarPedido } = useGlobal();
  const navigate = useNavigate();
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '', telefono: '', direccion: '', referencia: '', metodoPago: 'Efectivo'
  });

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);

  const manejarCambio = (e) => {
    setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
  };

  const confirmarPedido = (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;
    
    finalizarPedido(datosEnvio);
    alert("¡Pedido enviado con éxito! Puedes verlo en tu perfil.");
    navigate('/perfil');
  };

  return (
    <Container className="py-5">
      <h2 className="display-5 fw-bold text-center text-primary mb-5" style={{ fontFamily: 'Oswald' }}>🛵 MI PEDIDO DE DELIVERY</h2>
      <Row>
        <Col lg={5} className="mb-4">
          <Card className="shadow-sm border-0 rounded-4 bg-body">
            <Card.Header className="bg-primary text-white fw-bold py-3 fs-5 rounded-top-4 text-center">Resumen de Compra</Card.Header>
            <Card.Body className="p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-secondary opacity-75 mb-4">Tu carrito está vacío.</p>
                  <Button variant="outline-primary" className="rounded-pill" onClick={() => navigate('/menu')}>Ver Menú</Button>
                </div>
              ) : (
                <>
                  <ListGroup variant="flush">
                    {carrito.map((item, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0 bg-transparent text-body">
                        <span className="fw-bold">{item.nombre}</span>
                        <div className="d-flex align-items-center gap-2">
                          <span>S/ {item.precio.toFixed(2)}</span>
                          <Button variant="link" className="text-primary p-0" onClick={() => eliminarDelCarrito(index)}>❌</Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <hr className="my-4 border-secondary opacity-25" />
                  <div className="d-flex justify-content-between fs-4 fw-bold text-primary">
                    <span>Total:</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-4 bg-body">
            <Card.Header className="bg-dark text-white fw-bold py-3 fs-5 rounded-top-4 text-center">Datos de Entrega</Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={confirmarPedido}>
                <Row>
                  <Col md={6} className="mb-3"><Form.Label className="fw-semibold text-body opacity-75">Nombre</Form.Label><Form.Control required name="nombre" className="bg-body text-body" placeholder="Juan Pérez" onChange={manejarCambio} /></Col>
                  <Col md={6} className="mb-3"><Form.Label className="fw-semibold text-body opacity-75">Teléfono</Form.Label><Form.Control required name="telefono" className="bg-body text-body" placeholder="999 000 000" onChange={manejarCambio} /></Col>
                </Row>
                <Form.Group className="mb-3"><Form.Label className="fw-semibold text-body opacity-75">Dirección Exacta</Form.Label><Form.Control required name="direccion" className="bg-body text-body" placeholder="Av. Los Pinos 123" onChange={manejarCambio} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label className="fw-semibold text-body opacity-75">Referencia</Form.Label><Form.Control name="referencia" className="bg-body text-body" placeholder="Frente al parque" onChange={manejarCambio} /></Form.Group>
                <Form.Group className="mb-4"><Form.Label className="fw-semibold text-body opacity-75">Pago</Form.Label><Form.Select name="metodoPago" className="bg-body text-body" onChange={manejarCambio}><option>Efectivo</option><option>Yape/Plin</option><option>Tarjeta</option></Form.Select></Form.Group>
                <Button type="submit" variant="primary" size="lg" className="w-100 py-3 rounded-pill fw-bold shadow-sm btn-brasa" disabled={carrito.length === 0}>🚀 Confirmar Pedido</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PedidosPage;
