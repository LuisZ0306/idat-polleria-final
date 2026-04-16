import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobal } from '../Context/GlobalContext';

const LoginPage = () => {
  const { manejarLogin } = useGlobal();
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const resultado = manejarLogin(datos.email, datos.password);
    
    if (resultado.success) {
      alert(`¡Bienvenido de nuevo, ${resultado.user.nombre}!`);
      navigate('/'); // Redirigir al inicio
    } else {
      setError(resultado.message);
    }
  };

  return (
    <Container className="py-5">
      <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
        <Row className="g-0">
          {/* Lado Izquierdo: Formulario */}
          <Col lg={5} className="p-5 bg-body d-flex flex-column justify-content-center border-end border-secondary border-opacity-25">
            <div className="mb-4 text-center text-lg-start">
              <h2 className="fw-bold display-5 mb-2 text-body" style={{ fontFamily: 'Oswald' }}>¡BIENVENIDO!</h2>
              <p className="text-secondary opacity-75">Ingresa tus datos para acceder a <span className="fw-bold text-primary">Pollería D' Elí</span>.</p>
            </div>

            {error && <Alert variant="danger" className="py-2 small border-0 shadow-sm">{error}</Alert>}

            <Form onSubmit={manejarEnvio}>
              <Form.Group className="mb-4" controlId="formEmail">
                <Form.Label className="fw-semibold text-body opacity-75">Correo Electrónico</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  placeholder="campero@correo.com" 
                  className="py-2 rounded-3 shadow-sm custom-input bg-body text-body"
                  required
                  onChange={manejarCambio}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formPassword">
                <div className="d-flex justify-content-between">
                  <Form.Label className="fw-semibold text-body opacity-75">Contraseña</Form.Label>
                  <span className="text-primary small cursor-pointer fw-bold" style={{ textDecoration: 'none' }}>¿La olvidaste?</span>
                </div>
                <Form.Control 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="py-2 rounded-3 shadow-sm custom-input bg-body text-body"
                  required
                  onChange={manejarCambio}
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formCheckbox">
                <Form.Check type="checkbox" label="Recordar mi sesión" className="text-secondary small opacity-75" />
              </Form.Group>

              <Button type="submit" className="btn-brasa w-100 py-3 mb-4">
                INGRESAR
              </Button>

              <div className="text-center">
                <p className="text-secondary small opacity-75">
                  ¿Aún no tienes cuenta? <Link to="/register" className="text-primary fw-bold text-decoration-none border-bottom border-primary">Regístrate aquí</Link>
                </p>
              </div>
            </Form>
          </Col>

          {/* Lado Derecho: Imagen Publicitaria */}
          <Col lg={7} className="d-none d-lg-block p-0">
            <div 
              style={{
                backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('/img/login-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100%',
                minHeight: '600px'
              }}
              className="d-flex align-items-end p-5 text-white"
            >
              <div className="p-4 rounded-4 backdrop-blur shadow-lg border-start border-warning border-5">
                <h3 className="fw-bold display-6" style={{ fontFamily: 'Oswald' }}>EL SABOR TRADICIONAL</h3>
                <p className="mb-0 opacity-75 fs-5">Accede a tus reservas y gestiona tus pedidos con la calidad que nos caracteriza.</p>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <style>{`
        .backdrop-blur { background: rgba(0, 0, 0, 0.23); backdrop-filter: blur(8px); }
        .custom-input:focus { 
          border-color: var(--primary-color) !important; 
          box-shadow: 0 0 0 0.25rem rgba(211, 47, 47, 0.2) !important; 
        }
      `}</style>
    </Container>
  );
};

export default LoginPage;
