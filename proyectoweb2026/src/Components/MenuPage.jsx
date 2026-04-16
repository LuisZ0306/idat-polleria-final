import React from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab, Badge } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';

const MenuPage = () => {
  const { agregarAlCarrito, restarDelCarrito, carrito, menu, cargando, tema } = useGlobal();

  // Agrupar platos por categoría y obtener lista de categorías únicas
  const menuData = menu.reduce((acc, plato) => {
    const catNombre = plato.categoria_nombre || plato.categoria || 'Otros'; 
    if (!acc[catNombre]) acc[catNombre] = [];
    acc[catNombre].push(plato);
    return acc;
  }, {});

  const listaCategorias = Object.keys(menuData).map(cat => ({
    key: cat,
    label: cat.toUpperCase()
  })).sort((a, b) => a.label.localeCompare(b.label));

  const obtenerCantidad = (id) => {
    const item = carrito.find(i => i.id === id);
    return item ? item.cantidad : 0;
  };

  if (cargando) return <div className="text-center py-5">Cargando nuestra carta...</div>;

  return (
    <Container className="py-5 min-vh-100">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold section-title" style={{ color: 'var(--primary-color)' }}>Nuestra Carta</h1>
        <p className="lead text-muted mt-3">Explora los sabores tradicionales de Pollería D' Elí</p>
      </div>

      {listaCategorias.length === 0 ? (
        <div className="text-center py-5">
           <h3 className="text-muted">Pronto añadiremos nuevos platos a nuestra carta.</h3>
           <p>¡Vuelve pronto!</p>
        </div>
      ) : (
        <Tab.Container id="menu-tabs" defaultActiveKey={listaCategorias[0]?.key}>
          <Nav className="justify-content-center mb-5 gap-3 flex-wrap">
            {listaCategorias.map(cat => (
              <Nav.Item key={cat.key}>
                <Nav.Link eventKey={cat.key} className="rounded-pill px-4 fw-bold shadow-sm nav-link-menu">
                  {cat.label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {listaCategorias.map((cat) => (
              <Tab.Pane eventKey={cat.key} key={cat.key}>
                <Row>
                  {menuData[cat.key].map((plato) => {
                    const cant = obtenerCantidad(plato.id);
                    return (
                      <Col lg={3} md={4} sm={6} key={plato.id} className="mb-4">
                        {/* ESTILO INSPIRADO EN RESERVAS: shadow-lg, border-opacity, rounded-4 */}
                        <Card className={`h-100 border border-primary border-opacity-10 shadow-lg rounded-4 overflow-hidden transition-all hover-lift bg-body ${cant > 0 ? 'card-active' : ''}`}>
                          <div className="position-relative overflow-hidden">
                            <Card.Img 
                              variant="top" 
                              src={plato.img} 
                              style={{ height: '200px', objectFit: 'cover' }}
                              onError={(e) => e.target.src = "https://placehold.co/600x400?text=Pollería+D'Elí"}
                            />
                            <div className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 fw-bold fs-5 shadow-sm rounded-bottom-start">
                              S/ {parseFloat(plato.precio).toFixed(2)}
                            </div>
                          </div>
                          <Card.Body className="d-flex flex-column text-center p-3">
                            <Card.Title 
                                className={`fw-bold fs-5 mb-2 ${tema === 'dark' ? 'text-white' : 'text-dark'}`} 
                                style={{ fontFamily: 'Oswald' }}
                            >
                                {plato.nombre}
                            </Card.Title>
                            
                            <Card.Text className={`${tema === 'dark' ? 'text-light opacity-75' : 'text-muted'} small flex-grow-1 mb-3`}>
                              {plato.desc}
                            </Card.Text>
                            
                            <div style={{ height: '42px' }}>
                              {cant === 0 ? (
                                <Button 
                                  className="btn-brasa w-100 h-100 rounded-pill fw-bold border-0 shadow-sm"
                                  onClick={() => agregarAlCarrito(plato)}
                                >
                                  🛒 AGREGAR
                                </Button>
                              ) : (
                                <div className={`d-flex w-100 h-100 rounded-pill border border-2 border-danger overflow-hidden shadow-sm ${tema === 'dark' ? 'bg-dark' : 'bg-white'}`}>
                                  <Button 
                                    variant={tema === 'dark' ? 'dark' : 'white'} 
                                    className="flex-fill border-0 text-danger fw-bold"
                                    onClick={() => restarDelCarrito(plato.id)}
                                  >
                                    {cant === 1 ? '🗑️' : '−'}
                                  </Button>
                                  <div className={`flex-fill d-flex align-items-center justify-content-center fw-bold fs-5 ${tema === 'dark' ? 'text-white' : 'text-dark'}`}>
                                    {cant}
                                  </div>
                                  <Button 
                                    variant="danger" 
                                    className="flex-fill border-0 fw-bold"
                                    onClick={() => agregarAlCarrito(plato)}
                                  >
                                    +
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
      )}

      <style>{`
        .nav-link-menu {
          color: ${tema === 'dark' ? '#eee' : '#555'};
          background: ${tema === 'dark' ? '#333' : 'white'};
          border: 2px solid var(--primary-color) !important;
          transition: 0.3s;
        }
        .nav-link-menu.active {
          background-color: var(--primary-color) !important;
          color: white !important;
        }
        .rounded-bottom-start {
          border-bottom-left-radius: 15px;
        }
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
        }
        .card-active {
          outline: 3px solid var(--primary-color);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
};

export default MenuPage;
