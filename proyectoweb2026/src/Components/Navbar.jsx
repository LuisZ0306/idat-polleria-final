import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Badge, Dropdown, Modal, ListGroup, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobal } from '../Context/GlobalContext';

const CustomNavbar = () => {
  const { 
    usuarioActual, 
    logout, 
    carrito, 
    agregarAlCarrito, 
    restarDelCarrito, 
    eliminarDelCarrito, 
    finalizarPago, 
    tema, 
    toggleTema,
    showCarrito,
    setShowCarrito
  } = useGlobal();
  
  const [paso, setPaso] = useState(1); 
  const [metodo, setMetodo] = useState('tarjeta');
  const [procesando, setProcesando] = useState(false);
  
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const totalCarrito = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  const alConfirmarPago = async () => {
    if (!usuarioActual) {
        alert("Debes iniciar sesión para realizar la compra.");
        navigate('/login');
        setShowCarrito(false);
        return;
    }
    setProcesando(true);
    const res = await finalizarPago(metodo.toUpperCase());
    setProcesando(false);
    
    if (res.success) {
        alert("¡Pedido Verificado! Gracias por su compra.");
        setShowCarrito(false);
        setPaso(1);
    } else {
        alert(res.error);
    }
  };

  // Colores dinámicos para el Modal
  const modalBg = tema === 'dark' ? '#212529' : 'white';
  const modalText = tema === 'dark' ? 'white' : '#212529';

  return (
    <Navbar expand="lg" className="navbar-polleria sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src="/img/logo.png" alt="Logo" width="50" height="50" className="me-2" />
          <span className={`fw-bold fs-3 ${tema === 'light' ? 'text-dark' : 'text-white'}`} style={{ fontFamily: 'Oswald' }}>
            POLLERÍA <span style={{ color: 'var(--secondary-color)' }}>D' ELÍ</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto me-3 fw-semibold text-uppercase">
            <Nav.Link as={Link} to="/" className="nav-link-polleria">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/menu" className="nav-link-polleria">Menú</Nav.Link>
            <Nav.Link as={Link} to="/reservas" className="nav-link-polleria">Reservas</Nav.Link>
            {usuarioActual && (usuarioActual.rol === 'admin' || usuarioActual.rol === 'empleado') && (
              <Nav.Link as={Link} to="/admin" className="text-warning fw-bold nav-link-polleria">PANEL {usuarioActual.rol === 'admin' ? 'ADMIN' : 'PERSONAL'}</Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {/* BOTÓN TEMA */}
            <Button variant={tema === 'light' ? 'outline-dark' : 'outline-light'} onClick={toggleTema} className="rounded-circle p-2 border-0 shadow-sm" style={{ width: '40px', height: '40px' }}>
              {tema === 'light' ? <i className="bi bi-moon-stars-fill fs-5"></i> : <i className="bi bi-sun-fill fs-5 text-warning"></i>}
            </Button>

            <Button variant="outline-warning" className="rounded-pill position-relative px-3 border-2 fw-bold" onClick={() => { setShowCarrito(true); setPaso(1); }}>
              🛒 Carrito
              {carrito.length > 0 && <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">{carrito.reduce((a,b)=>a+b.cantidad,0)}</Badge>}
            </Button>

            {!usuarioActual ? (
              <Button as={Link} to="/login" className="btn-brasa px-4">Ingresar</Button>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="warning" className="rounded-pill px-4 fw-bold">👤 {usuarioActual.nombre}</Dropdown.Toggle>
                <Dropdown.Menu className="border-0 shadow-lg mt-2">
                  <Dropdown.Item as={Link} to="/perfil">Mi Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="text-danger">Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Navbar.Collapse>
      </Container>

      {/* MODAL DE COMPRA ADAPTATIVO */}
      <Modal show={showCarrito} onHide={() => !procesando && setShowCarrito(false)} centered size={paso === 2 ? 'lg' : 'md'}>
        <div style={{ backgroundColor: modalBg, color: modalText, borderRadius: '15px', overflow: 'hidden' }}>
            <Modal.Header closeButton closeVariant={tema === 'dark' ? 'white' : 'dark'} className="border-0">
            <Modal.Title className="fw-bold">{paso === 1 ? 'Tu Pedido 🍗' : 'Pasarela de Pago Seguro 🛡️'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
            {paso === 1 ? (
                <>
                {carrito.length === 0 ? <p className="text-center py-4">Carrito vacío.</p> : (
                    <ListGroup variant="flush">
                    {carrito.map((item, idx) => (
                        <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center px-0 border-light" style={{ backgroundColor: 'transparent', color: modalText }}>
                        <div><div className="fw-bold">{item.nombre}</div><div className="text-primary small">S/ {(item.precio * item.cantidad).toFixed(2)}</div></div>
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="outline-secondary" size="sm" onClick={() => restarDelCarrito(item.id)}>-</Button>
                            <span className="fw-bold">{item.cantidad}</span>
                            <Button variant="outline-secondary" size="sm" onClick={() => agregarAlCarrito(item)}>+</Button>
                        </div>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                )}
                <div className="mt-4 pt-3 border-top d-flex justify-content-between"><h5>Total:</h5><h4 className="fw-bold text-danger">S/ {totalCarrito.toFixed(2)}</h4></div>
                {carrito.length > 0 && <Button variant="danger" className="w-100 mt-3 py-3 fw-bold rounded-pill shadow" onClick={() => setPaso(2)}>Ir a Pagar</Button>}
                </>
            ) : (
                <Row>
                <Col md={6}>
                    <h6 className="fw-bold mb-3">Método de Pago</h6>
                    <div className="d-grid gap-2">
                    <Button variant={metodo === 'yape' ? 'primary' : 'outline-primary'} className="text-start py-3" onClick={() => setMetodo('yape')}>🟣 Yape / Plin</Button>
                    <Button variant={metodo === 'tarjeta' ? 'primary' : 'outline-primary'} className="text-start py-3" onClick={() => setMetodo('tarjeta')}>💳 Tarjeta Débito / Crédito</Button>
                    </div>
                    <Alert variant="info" className="mt-3 small py-2">Pago protegido.</Alert>
                </Col>
                <Col md={6} className={tema === 'dark' ? 'border-start border-secondary' : 'border-start'}>
                    <h6 className="fw-bold mb-3">Resumen de Compra</h6>
                    <div className={`p-3 rounded-3 mb-3 ${tema === 'dark' ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                        <div className="d-flex justify-content-between mb-2"><span>Productos:</span><span>S/ {totalCarrito.toFixed(2)}</span></div>
                        <div className="d-flex justify-content-between mb-2"><span>IGV:</span><span className="opacity-50">Incluido</span></div>
                        <hr />
                        <div className="d-flex justify-content-between fw-bold fs-5"><span>Total:</span><span className="text-danger">S/ {totalCarrito.toFixed(2)}</span></div>
                    </div>
                    
                    {metodo === 'tarjeta' ? (
                        <Form>
                            <Form.Control className={`mb-2 ${tema === 'dark' ? 'bg-dark text-white border-secondary' : ''}`} placeholder="Número de Tarjeta" maxLength="16" />
                            <Row><Col><Form.Control className={tema === 'dark' ? 'bg-dark text-white border-secondary' : ''} placeholder="MM/YY" /></Col><Col><Form.Control className={tema === 'dark' ? 'bg-dark text-white border-secondary' : ''} placeholder="CVV" /></Col></Row>
                        </Form>
                    ) : (
                        <div className={`text-center py-3 rounded-3 ${tema === 'dark' ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                            {/* TU QR REAL DE YAPE */}
                            <img src="/img/qr-yape.png" alt="Mi QR Yape" width="180" className="mb-2 rounded shadow-sm" 
                                onError={(e) => e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EsperandoQR"} />
                            <p className="small mb-0 fw-bold">Escanea para pagar con Yape</p>
                        </div>
                    )}
                    
                    <Button variant="success" className="w-100 mt-4 py-3 fw-bold rounded-pill shadow" disabled={procesando} onClick={alConfirmarPago}>
                    {procesando ? 'Procesando...' : 'CONFIRMAR PAGO'}
                    </Button>
                    <Button variant="link" className="w-100 mt-2 text-muted text-decoration-none" onClick={() => setPaso(1)}>← Volver al carrito</Button>
                </Col>
                </Row>
            )}
            </Modal.Body>
        </div>
      </Modal>
    </Navbar>
  );
};

export default CustomNavbar;
