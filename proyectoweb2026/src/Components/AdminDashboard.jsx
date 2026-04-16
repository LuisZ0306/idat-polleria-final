import React, { useState } from 'react';
import { Container, Table, Card, Row, Col, Badge, Button, Modal, Form, Tabs, Tab, Alert } from 'react-bootstrap';
import { useGlobal } from '../Context/GlobalContext';
import MapaMesas from './MapaMesas';

const AdminDashboard = () => {
  const { 
    usuariosRegistrados: usuarios, 
    clientes, 
    reservas, 
    menu, 
    mesas,
    ventas,
    usuarioActual,
    agregarPlato, 
    editarPlato, 
    eliminarPlato,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    agregarMesa,
    editarMesa,
    eliminarMesa,
    editarReserva,
    eliminarReserva,
    tema 
  } = useGlobal();

  const esAdmin = usuarioActual?.rol === 'admin';

  const ahora = new Date();
  const hoyStr = ahora.toLocaleDateString('en-CA');
  const horaActualStr = `${String(ahora.getHours()).padStart(2, '0')}:00`; 

  const [consultaEnVivo, setConsultaEnVivo] = useState({ 
    fecha: hoyStr, 
    hora: horaActualStr, 
    personas: 1, 
    duracion: 1.5 
  });
  
  const [mesaAdminSeleccionada, setMesaAdminSeleccionada] = useState(null);

  const montoVentasTotales = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
  const ventasHoy = ventas.filter(v => v.fecha && v.fecha.split(' ')[0] === hoyStr);
  const montoVentasHoy = ventasHoy.reduce((sum, v) => sum + parseFloat(v.total), 0);
  const reservasHoy = reservas.filter(r => r.fecha === hoyStr && r.estado !== 'Cancelada');

  const [showModalEmp, setShowModalEmp] = useState(false);
  const [editandoEmpleado, setEditandoEmpleado] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: '', apellido: '', email: '', tipo_doc: 'DNI', num_doc: '', password: '', rol: 'empleado' });
  const [errorUser, setErrorUser] = useState(null);

  const [showModalMenu, setShowModalMenu] = useState(false);
  const [editandoPlato, setEditandoPlato] = useState(null);
  const [platoForm, setPlatoForm] = useState({ nombre: '', categoria: 'brasas', precio: '', desc: '', img: '', es_recomendado: 0 });
  const [errorValidacion, setErrorValidacion] = useState(null);

  const [showModalMesa, setShowModalMesa] = useState(false);
  const [mesaForm, setMesaForm] = useState({ numero: '', capacidad: 2, estado: 'Disponible', lado: 'IZQUIERDA' });
  const [errorMesa, setErrorMesa] = useState(null);

  const [reportesStats, setReportesStats] = useState(null);
  const [cargandoReportes, setCargandoReportes] = useState(false);
  const [filtros, setFiltros] = useState({
    fecha_inicio: hoyStr,
    fecha_fin: hoyStr,
    hora_inicio: '09:00',
    hora_fin: '23:00'
  });
  const [reporteDetallado, setReporteDetallado] = useState(null);

  const cargarEstadisticas = async () => {
    setCargandoReportes(true);
    try {
      const res = await fetch('http://localhost/backend-polleria/public/api/dashboard-stats');
      const data = await res.json();
      setReportesStats(data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setCargandoReportes(false);
    }
  };

  const generarReporteFiltrado = async () => {
    setCargandoReportes(true);
    try {
      const params = new URLSearchParams(filtros).toString();
      const res = await fetch(`http://localhost/backend-polleria/public/api/reporte-filtrado?${params}`);
      const data = await res.json();
      setReporteDetallado(data);
    } catch (error) {
      console.error("Error filtrando reporte:", error);
    } finally {
      setCargandoReportes(false);
    }
  };

  const imprimirReporte = () => {
    window.print();
  };

  const empleados = usuarios.filter(u => u.rol === 'empleado' || u.rol === 'admin');

  const manejarRegistroEmpleado = async (e) => {
    e.preventDefault();
    setErrorUser(null);
    let res = editandoEmpleado ? await editarUsuario(editandoEmpleado.id, { ...nuevoEmpleado }) : await registrarUsuario({ ...nuevoEmpleado, creadoPorAdmin: true });
    if (res && res.error === 'DUPLICADO') setErrorUser(res.message);
    else setShowModalEmp(false);
  };

  const manejarGuardarPlato = async (e) => {
    e.preventDefault();
    setErrorValidacion(null);
    const datosEnvio = { ...platoForm, precio: parseFloat(platoForm.precio), es_recommended: platoForm.es_recomendado ? 1 : 0 };
    let res = editandoPlato ? await editarPlato(editandoPlato.id, datosEnvio) : await agregarPlato(datosEnvio);
    if (res && res.error === 'DUPLICADO') setErrorValidacion(res.message);
    else setShowModalMenu(false);
  };

  const manejarGuardarMesa = async (e) => {
    e.preventDefault();
    setErrorMesa(null);
    const res = await agregarMesa(mesaForm);
    if (res && res.error === 'DUPLICADO') setErrorMesa(res.message);
    else { setShowModalMesa(false); setMesaForm({ numero: '', capacidad: 2, estado: 'Disponible', lado: 'IZQUIERDA' }); }
  };

  const cardStyle = `border border-primary border-opacity-10 shadow-lg rounded-4 transition-all hover-lift bg-body`;

  return (
    <Container className="py-5 min-vh-100">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 no-print">
        <div>
            <h2 className={`display-5 fw-bold mb-0 ${tema === 'dark' ? 'text-white' : 'text-dark'}`} style={{ fontFamily: 'Oswald' }}>PANEL DE CONTROL</h2>
            <p className="text-secondary mb-0">Gestión Operativa de Pollería D' Elí</p>
        </div>
        <Badge bg="primary" className="p-3 px-4 rounded-pill shadow-sm fs-6">📅 {hoyStr}</Badge>
      </div>

      <div className="no-print">
        <Row className="mb-5">
            {[
                { label: 'Clientes', val: clientes.length, bg: 'bg-danger', icon: 'bi-people', visible: true },
                { label: 'Personal', val: empleados.length, bg: 'bg-dark', icon: 'bi-person-badge', visible: esAdmin },
                { label: 'Platos', val: menu.length, bg: 'bg-primary', icon: 'bi-egg-fried', visible: true },
                { label: 'Ventas Totales', val: `S/ ${montoVentasTotales.toFixed(2)}`, bg: 'bg-success', icon: 'bi-currency-dollar', visible: esAdmin }
            ].filter(item => item.visible).map((item, i) => (
                <Col md={esAdmin ? 3 : 6} key={i} className="mb-3">
                    <Card className={`border-0 shadow-lg rounded-4 text-white ${item.bg} hover-lift h-100`}>
                        <Card.Body className="p-4 d-flex align-items-center gap-3">
                            <div className="bg-white bg-opacity-25 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                <i className={`bi ${item.icon} fs-3`}></i>
                            </div>
                            <div><h6 className="text-uppercase opacity-75 small fw-bold mb-0">{item.label}</h6><h3 className="fw-bold mb-0">{item.val}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
      </div>

      <Tabs defaultActiveKey="envivo" className={`mb-4 custom-tabs p-2 rounded-pill shadow-sm no-print ${tema === 'dark' ? 'bg-dark border border-secondary' : 'bg-white'}`}>
        <Tab eventKey="envivo" title="📡 Salón en Vivo">
          <Row className="mt-3 g-4">
            <Col lg={8}>
              <MapaMesas 
                consulta={consultaEnVivo} 
                mesaSeleccionada={mesaAdminSeleccionada}
                numPersonas={1}
                alSeleccionarMesa={(id) => setMesaAdminSeleccionada(id)}
              />
            </Col>
            <Col lg={4}>
              <Card className={cardStyle}>
                <div className="bg-primary bg-opacity-10 p-3 px-4 border-bottom border-primary border-opacity-25">
                  <h5 className="text-primary fw-bold mb-0">Detalle de Mesa</h5>
                </div>
                <Card.Body className="p-4">
                  {mesaAdminSeleccionada ? (
                    (() => {
                      const mesa = mesas.find(m => m.id === mesaAdminSeleccionada);
                      const reservaActiva = reservas.find(r => 
                        r.mesa_id === mesaAdminSeleccionada && 
                        r.fecha === hoyStr && 
                        r.estado === 'Confirmada'
                      );
                      const cliente = reservaActiva ? [...clientes, ...usuarios].find(u => u.id === reservaActiva.usuario_id) : null;

                      return (
                        <div className="animate__animated animate__fadeIn">
                          <div className="text-center mb-4">
                            <div className="display-4 fw-bold text-primary mb-1">MESA {mesa?.numero}</div>
                            <Badge bg="secondary" className="rounded-pill px-3">{mesa?.lado}</Badge>
                          </div>
                          <hr />
                          <div className="mb-4">
                            <h6 className="text-uppercase text-muted small fw-bold mb-3">Estado Actual</h6>
                            {reservaActiva ? (
                              <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-4 p-3 text-center">
                                <i className="bi bi-person-fill-lock text-danger fs-1"></i>
                                <h5 className="fw-bold text-danger mt-2">OCUPADA / RESERVADA</h5>
                                <p className="mb-0 text-dark">Cliente: <b>{cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido'}</b></p>
                                <small className="text-muted">Desde: {reservaActiva.hora} ({reservaActiva.duracion}h)</small>
                              </div>
                            ) : (
                              <div className="bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 p-3 text-center">
                                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                                <h5 className="fw-bold text-success mt-2">DISPONIBLE</h5>
                                <p className="small text-muted mb-0">Esta mesa no tiene reservas para este momento.</p>
                              </div>
                            )}
                          </div>
                          <Button variant="outline-danger" className="w-100 rounded-pill fw-bold py-2" onClick={() => { if(window.confirm('¿Poner mesa en mantenimiento?')) editarMesa(mesa.id, { estado: mesa.estado === 'Disponible' ? 'Mantenimiento' : 'Disponible' }) }}>
                              🛠️ {mesa?.estado === 'Disponible' ? 'Mantenimiento' : 'Habilitar'}
                          </Button>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-5 text-muted opacity-50">
                      <i className="bi bi-hand-index fs-1 mb-3 d-block"></i>
                      <p className="fw-bold">Toca una mesa en el mapa para ver sus detalles</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="reservas" title="📅 Reservas">
            <Card className={`${cardStyle} mt-3`}>
                <div className="bg-danger bg-opacity-10 p-3 px-4 d-flex justify-content-between align-items-center border-bottom border-danger border-opacity-25">
                    <h5 className="text-danger fw-bold mb-0">Gestión de Reservas</h5>
                </div>
                <Table responsive hover className="mb-0">
                    <thead className="small text-uppercase opacity-50"><tr><th className="px-4">Fecha/Hora</th><th>Cliente</th><th>Mesa</th><th>Estado</th><th className="text-end px-4">Acciones</th></tr></thead>
                    <tbody>
                        {reservas.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).map(r => {
                            const cliente = [...clientes, ...usuarios].find(u => u.id === r.usuario_id);
                            const mesa = mesas.find(m => m.id === r.mesa_id);
                            return (
                                <tr key={r.id}>
                                    <td className="px-4">{r.fecha} <small className="text-muted">{r.hora}</small></td>
                                    <td>
                                        <div className="fw-bold">{cliente ? `${cliente.nombre} ${cliente.apellido}` : `ID: ${r.usuario_id}`}</div>
                                        <small className="text-muted">{cliente?.email}</small>
                                    </td>
                                    <td>Mesa {mesa?.numero || r.mesa_id}</td>
                                    <td><Badge bg={r.estado === 'Confirmada' ? 'success' : r.estado === 'Cancelada' ? 'danger' : 'info'}>{r.estado}</Badge></td>
                                    <td className="text-end px-4">
                                        {r.estado === 'Pendiente' && (
                                            <Button variant="link" className="text-success p-0 me-2" onClick={() => editarReserva(r.id, { estado: 'Confirmada' })}>
                                                <i className="bi bi-check-circle"></i>
                                            </Button>
                                        )}
                                        <Button variant="link" className="text-danger p-0" onClick={() => { if(window.confirm('¿Eliminar/Cancelar reserva?')) eliminarReserva(r.id) }}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card>
        </Tab>

        {esAdmin && (
          <Tab eventKey="reportes" title="📊 Reportes Gerenciales">
            <div className="mt-4 animate__animated animate__fadeIn">
                <div className="no-print">
                    <Card className={`${cardStyle} mb-4 border-primary border-opacity-50`}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4 text-primary"><i className="bi bi-filter-square-fill me-2"></i>FILTROS DE AUDITORÍA</h5>
                            <Row className="g-3">
                                <Col md={3}><Form.Label className="small fw-bold">Fecha Inicio</Form.Label><Form.Control type="date" value={filtros.fecha_inicio} onChange={(e) => setFiltros({...filtros, fecha_inicio: e.target.value})} /></Col>
                                <Col md={3}><Form.Label className="small fw-bold">Fecha Fin</Form.Label><Form.Control type="date" value={filtros.fecha_fin} onChange={(e) => setFiltros({...filtros, fecha_fin: e.target.value})} /></Col>
                                <Col md={2}><Form.Label className="small fw-bold">Desde</Form.Label><Form.Control type="time" value={filtros.hora_inicio} onChange={(e) => setFiltros({...filtros, hora_inicio: e.target.value})} /></Col>
                                <Col md={2}><Form.Label className="small fw-bold">Hasta</Form.Label><Form.Control type="time" value={filtros.hora_fin} onChange={(e) => setFiltros({...filtros, hora_fin: e.target.value})} /></Col>
                                <Col md={2} className="d-flex align-items-end"><Button variant="primary" className="w-100 fw-bold rounded-pill" onClick={generarReporteFiltrado}>BUSCAR</Button></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>

              {!reporteDetallado ? (
                <div className="text-center py-5 no-print">
                  <i className="bi bi-file-earmark-bar-graph fs-1 text-primary opacity-25 mb-3 d-block"></i>
                  <p className="text-muted">Ajusta los filtros y haz clic en <b>"BUSCAR"</b></p>
                </div>
              ) : (
                <div className="seccion-reporte-imprimir">
                  {/* ENCABEZADO PARA IMPRESIÓN (OCULTO EN WEB) */}
                  <div className="d-none d-print-block text-center mb-4 border-bottom border-dark pb-3">
                    <h4 className="fw-bold mb-0">POLLERÍA D' ELÍ - REPORTE GERENCIAL</h4>
                    <p className="small mb-0">RUC: 20600000001 | Av. Arenal 123, Nauta</p>
                    <p className="small mb-0">Generado por: {usuarioActual?.nombre} {usuarioActual?.apellido}</p>
                    <p className="small mb-0">Periodo: {filtros.fecha_inicio} al {filtros.fecha_fin}</p>
                    <p className="small mb-0">--------------------------------------------------</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4 no-print">
                    <h4 className="fw-bold mb-0">RESULTADOS DEL PERIODO</h4>
                    <Button variant="success" className="rounded-pill px-4" onClick={imprimirReporte}>IMPRIMIR / PDF</Button>
                  </div>

                  <Row className="g-4 mb-4 text-center">
                      <Col md={4}><div className="p-4 bg-primary bg-opacity-10 border rounded-4"><h3>S/ {reporteDetallado?.resumen?.total_ventas?.toFixed(2) || '0.00'}</h3><small>Ventas</small></div></Col>
                      <Col md={4}><div className="p-4 bg-warning bg-opacity-10 border rounded-4"><h3>{reporteDetallado?.resumen?.cant_reservas || 0}</h3><small>Reservas</small></div></Col>
                      <Col md={4}><div className="p-4 bg-success bg-opacity-10 border rounded-4"><h3>{reporteDetallado?.resumen?.platos_contados || 0}</h3><small>Platos</small></div></Col>
                  </Row>

                  <Row className="g-4">
                    <Col lg={6}>
                        <Card className={cardStyle}>
                            <div className="p-3 bg-dark text-white rounded-top-4 d-print-none"><h6>🍔 PRODUCTOS VENDIDOS</h6></div>
                            <div className="d-none d-print-block p-2"><strong>RELACIÓN DE VENTAS DE PRODUCTOS</strong></div>
                            <Table responsive hover className="mb-0">
                                <thead className="small text-uppercase opacity-50">
                                    <tr>
                                        <th className="px-4">Fecha/Hora</th>
                                        <th>Producto</th>
                                        <th className="text-center">Cant.</th>
                                        <th className="text-end px-4">Recaudado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteDetallado?.platos_detalle?.map((p, i) => (
                                        <tr key={i}>
                                            <td className="px-4">{p.fecha} <small className="text-muted">{p.hora}</small></td>
                                            <td className="fw-bold text-uppercase">{p.producto?.nombre}</td>
                                            <td className="text-center">{p.cantidad}</td>
                                            <td className="text-end px-4">S/ {parseFloat(p.recaudado || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className={cardStyle}>
                            <div className="p-3 bg-danger text-white rounded-top-4 d-print-none"><h6>📅 RESERVAS</h6></div>
                            <div className="d-none d-print-block p-2"><strong>DETALLE DE RESERVAS</strong></div>
                            <Table responsive hover className="mb-0">
                                <thead className="small text-uppercase opacity-50">
                                    <tr>
                                        <th className="px-4">Fecha/Hora</th>
                                        <th>Mesa</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteDetallado?.reservas_detalle?.map((r, i) => (
                                        <tr key={i}>
                                            <td className="px-4">{r.fechareserva} <small className="text-muted">{r.horainicio}</small></td>
                                            <td>Mesa {r.mesa}</td>
                                            <td className="text-uppercase">{r.estado}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                  </Row>
                  
                  <div className="d-none d-print-block text-center mt-5 small">
                    <p>--------------------------------------------------</p>
                    <p>© 2026 Pollería D' Elí - Sistema de Gestión Interna</p>
                  </div>
                </div>
              )}
            </div>
          </Tab>
        )}

        <Tab eventKey="menu" title="🍽️ Gestión de Carta">
            <Card className={`${cardStyle} mt-3`}>
                <div className="bg-primary bg-opacity-10 p-3 px-4 d-flex justify-content-between align-items-center border-bottom border-primary border-opacity-25">
                    <h5 className="text-primary fw-bold mb-0">Listado de Platos</h5>
                    <Button variant="primary" className="rounded-pill px-4 fw-bold" onClick={() => { setEditandoPlato(null); setPlatoForm({ nombre: '', categoria: 'brasas', precio: '', desc: '', img: '', es_recomendado: 0 }); setShowModalMenu(true); }}>
                        + AGREGAR PLATO
                    </Button>
                </div>
                <Table responsive hover className="mb-0">
                    <thead className="small text-uppercase opacity-50">
                        <tr><th className="px-4">Nombre</th><th>Categoría</th><th>Precio</th><th className="text-end px-4">Acciones</th></tr>
                    </thead>
                    <tbody>
                        {menu.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 fw-bold">{p.nombre} {p.es_recommended === 1 && <Badge bg="warning" text="dark" className="ms-1">⭐</Badge>}</td>
                                <td className="text-uppercase small">
                                    {typeof p.categoria === 'object' ? p.categoria.nombre : p.categoria}
                                </td>
                                <td>S/ {parseFloat(p.precio).toFixed(2)}</td>
                                <td className="text-end px-4">
                                    <Button variant="link" className="text-primary p-0 me-3" onClick={() => { 
                                        setEditandoPlato(p); 
                                        setPlatoForm({ 
                                            nombre: p.nombre, 
                                            categoria: typeof p.categoria === 'object' ? p.categoria.id : p.categoria, 
                                            precio: p.precio, 
                                            desc: p.desc, 
                                            img: p.img, 
                                            es_recomendado: p.es_recommended 
                                        }); 
                                        setShowModalMenu(true); 
                                    }}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>
                                    <Button variant="link" className="text-danger p-0" onClick={() => { if(window.confirm('¿Eliminar plato?')) eliminarPlato(p.id) }}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Tab>

        {esAdmin && (
          <Tab eventKey="personal" title="👥 Personal">
            <Card className={`${cardStyle} mt-3`}>
                <div className="bg-dark bg-opacity-10 p-3 px-4 d-flex justify-content-between align-items-center border-bottom border-dark border-opacity-25">
                    <h5 className="text-dark fw-bold mb-0">Gestión de Empleados</h5>
                    <Button variant="dark" className="rounded-pill px-4 fw-bold" onClick={() => { setEditandoEmpleado(null); setNuevoEmpleado({ nombre: '', apellido: '', email: '', tipo_doc: 'DNI', num_doc: '', password: '', rol: 'empleado' }); setShowModalEmp(true); }}>
                        + REGISTRAR EMPLEADO
                    </Button>
                </div>
                <Table responsive hover className="mb-0">
                    <thead className="small text-uppercase opacity-50">
                        <tr><th className="px-4">Nombre Completo</th><th>Email</th><th>Documento</th><th>Rol</th><th className="text-end px-4">Acciones</th></tr>
                    </thead>
                    <tbody>
                        {empleados.map(u => (
                            <tr key={u.id}>
                                <td className="px-4 fw-bold">{u.nombre} {u.apellido}</td>
                                <td>{u.email}</td>
                                <td>{u.tipo_doc}: {u.num_doc}</td>
                                <td><Badge bg={u.rol === 'admin' ? 'danger' : 'secondary'}>{u.rol}</Badge></td>
                                <td className="text-end px-4">
                                    <Button variant="link" className="text-primary p-0 me-3" onClick={() => { setEditandoEmpleado(u); setNuevoEmpleado({ ...u, password: '' }); setShowModalEmp(true); }}>
                                        <i className="bi bi-pencil-square"></i>
                                    </Button>
                                    <Button variant="link" className="text-danger p-0" onClick={() => { if(window.confirm('¿Eliminar usuario?')) eliminarUsuario(u.id) }}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
          </Tab>
        )}

        {esAdmin && (
          <Tab eventKey="mesas" title="🪑 Mesas">
            <Card className={`${cardStyle} mt-3`}>
                <div className="bg-secondary bg-opacity-10 p-3 px-4 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                    <h5 className="text-secondary fw-bold mb-0">Configuración de Salón</h5>
                    <Button variant="secondary" className="rounded-pill px-4 fw-bold" onClick={() => setShowModalMesa(true)}>
                        + NUEVA MESA
                    </Button>
                </div>
                <Table responsive hover className="mb-0">
                    <thead className="small text-uppercase opacity-50">
                        <tr><th className="px-4">Número</th><th>Capacidad</th><th>Ubicación</th><th>Estado</th><th className="text-end px-4">Acciones</th></tr>
                    </thead>
                    <tbody>
                        {mesas.sort((a,b) => a.numero - b.numero).map(m => (
                            <tr key={m.id}>
                                <td className="px-4 fw-bold">Mesa {m.numero}</td>
                                <td>{m.capacidad} personas</td>
                                <td><Badge bg="light" text="dark">{m.lado}</Badge></td>
                                <td><Badge bg={m.estado === 'Disponible' ? 'success' : 'warning'}>{m.estado}</Badge></td>
                                <td className="text-end px-4">
                                    <Button variant="link" className="text-danger p-0" onClick={() => { if(window.confirm('¿Eliminar mesa?')) eliminarMesa(m.id) }}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
          </Tab>
        )}

        {esAdmin && (
          <Tab eventKey="clientes" title="👤 Clientes">
            <Card className={`${cardStyle} mt-3`}>
                <div className="bg-info bg-opacity-10 p-3 px-4 border-bottom border-info border-opacity-25">
                    <h5 className="text-info fw-bold mb-0">Base de Datos de Clientes</h5>
                </div>
                <Table responsive hover className="mb-0">
                    <thead className="small text-uppercase opacity-50">
                        <tr><th className="px-4">Nombre</th><th>Email</th><th>Documento</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id}>
                                <td className="px-4">{c.nombre} {c.apellido}</td>
                                <td>{c.email}</td>
                                <td>{c.num_doc}</td>
                                <td>
                                    <Button variant="link" className="text-danger p-0" onClick={() => { if(window.confirm('¿Eliminar cliente?')) eliminarUsuario(c.id) }}>
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
          </Tab>
        )}
      </Tabs>

      {/* MODALES DE GESTIÓN */}
      <Modal show={showModalEmp} onHide={() => setShowModalEmp(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-white border-0"><Modal.Title className="fw-bold">{editandoEmpleado ? 'EDITAR PERSONAL' : 'NUEVO PERSONAL'}</Modal.Title></Modal.Header>
        <Form onSubmit={manejarRegistroEmpleado}>
          <Modal.Body className="p-4">
            {errorUser && <Alert variant="danger">{errorUser}</Alert>}
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Nombre</Form.Label><Form.Control required type="text" value={nuevoEmpleado.nombre} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Apellido</Form.Label><Form.Control required type="text" value={nuevoEmpleado.apellido} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, apellido: e.target.value})} /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label className="small fw-bold text-muted">Correo Electrónico</Form.Label><Form.Control required type="email" value={nuevoEmpleado.email} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, email: e.target.value})} /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label className="small fw-bold text-muted">Tipo Doc</Form.Label><Form.Select value={nuevoEmpleado.tipo_doc} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, tipo_doc: e.target.value})}><option value="DNI">DNI</option><option value="RUC">RUC</option><option value="CE">C.E.</option></Form.Select></Form.Group></Col>
              <Col md={8}><Form.Group><Form.Label className="small fw-bold text-muted">Número Doc</Form.Label><Form.Control required type="text" value={nuevoEmpleado.num_doc} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, num_doc: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Rol</Form.Label><Form.Select value={nuevoEmpleado.rol} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, rol: e.target.value})}><option value="empleado">Empleado (Mozo/Caja)</option><option value="admin">Administrador</option></Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Contraseña {editandoEmpleado && '(Dejar vacío para no cambiar)'}</Form.Label><Form.Control required={!editandoEmpleado} type="password" value={nuevoEmpleado.password} onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, password: e.target.value})} /></Form.Group></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 p-4 pt-0"><Button variant="light" onClick={() => setShowModalEmp(false)}>Cancelar</Button><Button variant="dark" type="submit" className="px-4 fw-bold">{editandoEmpleado ? 'ACTUALIZAR' : 'REGISTRAR'}</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showModalMenu} onHide={() => setShowModalMenu(false)} centered size="lg">
        <Modal.Header closeButton className="bg-primary text-white border-0"><Modal.Title className="fw-bold">{editandoPlato ? 'EDITAR PLATO' : 'NUEVO PLATO'}</Modal.Title></Modal.Header>
        <Form onSubmit={manejarGuardarPlato}>
          <Modal.Body className="p-4">
            {errorValidacion && <Alert variant="danger">{errorValidacion}</Alert>}
            <Row className="g-3">
              <Col md={8}><Form.Group><Form.Label className="small fw-bold text-muted">Nombre del Plato</Form.Label><Form.Control required type="text" value={platoForm.nombre} onChange={(e) => setPlatoForm({...platoForm, nombre: e.target.value})} /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label className="small fw-bold text-muted">Precio (S/)</Form.Label><Form.Control required type="number" step="0.01" value={platoForm.precio} onChange={(e) => setPlatoForm({...platoForm, precio: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Categoría</Form.Label><Form.Select value={platoForm.categoria} onChange={(e) => setPlatoForm({...platoForm, categoria: e.target.value})}><option value="brasas">A las Brasas</option><option value="antojos">Antojos</option><option value="bebidas">Bebidas</option><option value="postres">Postres</option></Form.Select></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Imagen (URL)</Form.Label><Form.Control type="text" value={platoForm.img} onChange={(e) => setPlatoForm({...platoForm, img: e.target.value})} placeholder="https://..." /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label className="small fw-bold text-muted">Descripción</Form.Label><Form.Control as="textarea" rows={2} value={platoForm.desc} onChange={(e) => setPlatoForm({...platoForm, desc: e.target.value})} /></Form.Group></Col>
              <Col md={12}><Form.Check type="switch" label="Marcar como recomendado (Destacar en Inicio)" checked={platoForm.es_recomendado === 1} onChange={(e) => setPlatoForm({...platoForm, es_recomendado: e.target.checked ? 1 : 0})} /></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 p-4 pt-0"><Button variant="light" onClick={() => setShowModalMenu(false)}>Cancelar</Button><Button variant="primary" type="submit" className="px-4 fw-bold">{editandoPlato ? 'GUARDAR CAMBIOS' : 'AGREGAR PLATO'}</Button></Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showModalMesa} onHide={() => setShowModalMesa(false)} centered>
        <Modal.Header closeButton className="bg-secondary text-white border-0"><Modal.Title className="fw-bold">NUEVA MESA</Modal.Title></Modal.Header>
        <Form onSubmit={manejarGuardarMesa}>
          <Modal.Body className="p-4">
            {errorMesa && <Alert variant="danger">{errorMesa}</Alert>}
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Número de Mesa</Form.Label><Form.Control required type="number" value={mesaForm.numero} onChange={(e) => setMesaForm({...mesaForm, numero: e.target.value})} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small fw-bold text-muted">Capacidad</Form.Label><Form.Select value={mesaForm.capacidad} onChange={(e) => setMesaForm({...mesaForm, capacidad: parseInt(e.target.value)})}><option value={2}>2 Personas</option><option value={4}>4 Personas</option><option value={6}>6 Personas</option><option value={8}>8 Personas</option></Form.Select></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label className="small fw-bold text-muted">Ubicación (Lado)</Form.Label><Form.Select value={mesaForm.lado} onChange={(e) => setMesaForm({...mesaForm, lado: e.target.value})}><option value="IZQUIERDA">Lado Izquierdo</option><option value="DERECHA">Lado Derecho</option></Form.Select></Form.Group></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 p-4 pt-0"><Button variant="light" onClick={() => setShowModalMesa(false)}>Cancelar</Button><Button variant="secondary" type="submit" className="px-4 fw-bold">CREAR MESA</Button></Modal.Footer>
        </Form>
      </Modal>

      <style>{`
        @media print {
            body * { visibility: hidden; background: white !important; }
            .seccion-reporte-imprimir, .seccion-reporte-imprimir * { visibility: visible; color: black !important; }
            .seccion-reporte-imprimir { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                padding: 20px;
                font-family: 'Courier New', Courier, monospace;
            }
            .no-print { display: none !important; }
            .card { border: 1px solid #000 !important; box-shadow: none !important; margin-bottom: 20px; }
            .table { border-collapse: collapse !important; width: 100% !important; }
            .table th, .table td { border: 1px solid #000 !important; padding: 8px !important; color: black !important; }
            .badge { border: 1px solid #000 !important; color: black !important; background: transparent !important; }
        }
        .custom-tabs .nav-link { color: #6c757d; font-weight: 600; border-radius: 50px; margin: 0 5px; }
        .custom-tabs .nav-link.active { background: #0d6efd !important; color: white !important; }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
