import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobal } from '../Context/GlobalContext';

const RegisterPage = () => {
  const { registrarUsuario } = useGlobal();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: '', apellido: '', email: '', password: '', 
    tipo_doc: 'DNI', num_doc: '', rol: 'cliente'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datos.num_doc) {
        setError('Por favor, ingresa tu número de documento.');
        return;
    }
    await registrarUsuario(datos);
    alert("¡Bienvenido - Registro exitoso.");
    navigate('/');
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="bg-danger p-4 text-center text-white">
          <h2 className="fw-bold mb-0" style={{ fontFamily: 'Oswald' }}>ÚNETE A LA FAMILIA</h2>
          <p className="mb-0 opacity-75">Disfruta de los mejores pollos a la brasa</p>
        </div>
        <Card.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control required placeholder="Ej: Luis" onChange={e => setDatos({...datos, nombre: e.target.value})} />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control required placeholder="Ej: Pérez" onChange={e => setDatos({...datos, apellido: e.target.value})} />
              </Col>
            </Row>

            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Tipo Doc.</Form.Label>
                <Form.Select onChange={e => setDatos({...datos, tipo_doc: e.target.value})}>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                </Form.Select>
              </Col>
              <Col md={8} className="mb-3">
                <Form.Label>Número Documento</Form.Label>
                <Form.Control required placeholder="12345678" onChange={e => setDatos({...datos, num_doc: e.target.value})} />
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control required type="email" placeholder="nombre@correo.com" onChange={e => setDatos({...datos, email: e.target.value})} />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control required type="password" placeholder="Crea una clave segura" onChange={e => setDatos({...datos, password: e.target.value})} />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100 py-3 fw-bold rounded-pill shadow-sm mb-3">
              REGISTRARME AHORA
            </Button>
            
            <div className="text-center">
              <span className="text-muted">¿Ya tienes cuenta? </span>
              <Link to="/login" className="text-danger fw-bold text-decoration-none">Inicia Sesión</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
