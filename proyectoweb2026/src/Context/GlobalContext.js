import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GlobalContext = createContext();
// CONEXIÓN AL SERVIDOR APACHE DE XAMPP
const API_URL = 'http://localhost/backend-polleria/public/api';

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal debe ser usado dentro de un GlobalProvider');
  }
  return context;
};

export const GlobalProvider = ({ children }) => {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [menu, setMenu] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [reportesMesa, setReportesMesa] = useState([]);
  
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const saved = localStorage.getItem('sesion_activa_deli');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [carrito, setCarrito] = useState([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [tema, setTema] = useState(() => {
    const saved = localStorage.getItem('tema_deli');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema);
    localStorage.setItem('tema_deli', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(prev => prev === 'light' ? 'dark' : 'light');
  };

  const cargarDatos = useCallback(async () => {
    try {
      const [resUsers, resMenu, resVentas, resReservas, resMesas, resReportes] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/productos`),
        fetch(`${API_URL}/ventas`),
        fetch(`${API_URL}/reservas`),
        fetch(`${API_URL}/mesas`),
        fetch(`${API_URL}/reportes-mesa`)
      ]);
      
      const users = await resUsers.json();
      const mnu = await resMenu.json();
      const vnts = await resVentas.json();
      const rsvs = await resReservas.json();
      const msas = await resMesas.json();
      const rpts = await resReportes.json();

      const mnuAdaptado = mnu.map(p => ({
        ...p,
        precio: parseFloat(p.precio),
        desc: p.descripcion,
        img: p.imagen 
      }));

      setUsuariosRegistrados(users.filter(u => u.rol !== 'cliente'));
      setClientes(users.filter(u => u.rol === 'cliente'));
      setMenu(mnuAdaptado);
      setVentas(vnts);
      setReservas(rsvs);
      setMesas(msas);
      setReportesMesa(rpts);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  useEffect(() => {
    if (usuarioActual) localStorage.setItem('sesion_activa_deli', JSON.stringify(usuarioActual));
    else localStorage.removeItem('sesion_activa_deli');
  }, [usuarioActual]);

  // --- PRODUCTOS ---
  const agregarPlato = async (nuevoPlato) => {
    try {
      const res = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevoPlato, descripcion: nuevoPlato.desc, imagen: nuevoPlato.img })
      });
      const guardado = await res.json();
      if (guardado.error) return guardado;
      const adaptado = { ...guardado, precio: parseFloat(guardado.precio), desc: guardado.descripcion, img: guardado.imagen };
      setMenu(prev => [...prev, adaptado]);
      return adaptado;
    } catch (error) { console.error(error); }
  };

  const editarPlato = async (id, datosEditados) => {
    try {
      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datosEditados, descripcion: datosEditados.desc, imagen: datosEditados.img })
      });
      const actualizado = await res.json();
      if (actualizado.error) return actualizado;
      const adaptado = { ...actualizado, precio: parseFloat(actualizado.precio), desc: actualizado.descripcion, img: actualizado.imagen };
      setMenu(prev => prev.map(p => p.id === id ? adaptado : p));
      return adaptado;
    } catch (error) { console.error(error); }
  };

  const eliminarPlato = async (id) => {
    try {
      await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
      setMenu(prev => prev.filter(p => p.id !== id));
    } catch (error) { console.error(error); }
  };

  // --- USUARIOS ---
  const registrarUsuario = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const nuevo = await res.json();
      if (datos.rol === 'cliente') setClientes(prev => [...prev, nuevo]);
      else setUsuariosRegistrados(prev => [...prev, nuevo]);
      if (!datos.creadoPorAdmin) setUsuarioActual(nuevo);
      return nuevo;
    } catch (error) { console.error(error); }
  };

  const editarUsuario = async (id, datosEditados) => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEditados)
      });
      const actualizado = await res.json();
      setUsuariosRegistrados(prev => prev.map(u => u.id === id ? actualizado : u));
      return actualizado;
    } catch (error) { console.error(error); }
  };

  const eliminarUsuario = async (id) => {
    try {
      await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
      setUsuariosRegistrados(prev => prev.filter(u => u.id !== id));
      setClientes(prev => prev.filter(c => c.id !== id));
    } catch (error) { console.error(error); }
  };

  // --- MESAS ---
  const agregarMesa = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/mesas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const nueva = await res.json();
      if (nueva.error) return nueva;
      setMesas(prev => [...prev, nueva]);
      return nueva;
    } catch (error) { console.error(error); }
  };

  const editarMesa = async (id, datos) => {
    try {
      const res = await fetch(`${API_URL}/mesas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const actualizada = await res.json();
      setMesas(prev => prev.map(m => m.id === id ? actualizada : m));
    } catch (error) { console.error(error); }
  };

  const eliminarMesa = async (id) => {
    try {
      await fetch(`${API_URL}/mesas/${id}`, { method: 'DELETE' });
      setMesas(prev => prev.filter(m => m.id !== id));
    } catch (error) { console.error(error); }
  };

  // --- REPORTES ---
  const enviarReporteMesa = async (datos) => {
    try {
      const res = await fetch(`${API_URL}/reportes-mesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const nuevo = await res.json();
      setReportesMesa(prev => [nuevo, ...prev]);
      return { success: true };
    } catch (error) { return { error: 'Fallo al enviar reporte.' }; }
  };

  const marcarReporteLeido = async (id) => {
    try {
      await fetch(`${API_URL}/reportes-mesa/${id}`, { method: 'PUT' });
      setReportesMesa(prev => prev.map(r => r.id === id ? { ...r, visto: 1 } : r));
    } catch (error) { console.error(error); }
  };

  // --- RESERVAS ---
  const agregarReserva = async (nueva) => {
    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nueva, usuario_id: usuarioActual?.id, estado: 'Pendiente' })
      });
      const guardada = await res.json();
      if (!res.ok || guardada.error) return { error: guardada.message || 'Error al reservar.' };
      
      // Añadimos a la lista local
      setReservas(prev => [...prev, guardada]);
      
      return { success: true, reservaId: guardada.id };
    } catch (error) { return { error: 'Fallo de conexión.' }; }
  };

  const editarReserva = async (id, datos) => {
    try {
      const res = await fetch(`${API_URL}/reservas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const actualizada = await res.json();
      setReservas(prev => prev.map(r => r.id === id ? actualizada : r));
      return actualizada;
    } catch (error) { console.error(error); }
  };

  const eliminarReserva = async (id) => {
    try {
      await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' });
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: 'Cancelada' } : r));
    } catch (error) { console.error(error); }
  };

  const manejarLogin = (email, password) => {
    const todos = [...usuariosRegistrados, ...clientes];
    const u = todos.find(x => x.email.toLowerCase() === email.trim().toLowerCase());
    if (u && u.password === password) { setUsuarioActual(u); return { success: true, user: u }; }
    return { success: false, message: "Datos incorrectos." };
  };

  const logout = () => { setUsuarioActual(null); };

  // --- CARRITO ---
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const restarDelCarrito = (id) => {
    setCarrito(prev => {
      const item = prev.find(i => i.id === id);
      if (item.cantidad > 1) return prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad - 1 } : i);
      return prev.filter(i => i.id !== id);
    });
  };

  const eliminarDelCarrito = (id) => { setCarrito(prev => prev.filter(item => item.id !== id)); };

  const finalizarPago = async (metodoPago) => {
    if (!usuarioActual) return { error: 'Inicia sesión para pagar.' };
    const total = carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    const datosVenta = { usuario_id: usuarioActual.id, total: total, metodo_pago: metodoPago, productos: carrito };
    try {
      const res = await fetch(`${API_URL}/ventas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosVenta) });
      const data = await res.json();
      if (res.ok) {
        // SI HAY UNA RESERVA EN EL CARRITO, LA CONFIRMAMOS EN EL BACKEND
        for (const item of carrito) {
            if (item.esReserva) {
                await editarReserva(item.reservaId, { estado: 'Confirmada' });
            }
        }
        setCarrito([]);
        cargarDatos(); 
        return { success: true, message: data.message }; 
      }
      return { error: 'Fallo al procesar el pago.' };
    } catch (error) { return { error: 'Error de conexión.' }; }
  };

  const value = {
    usuariosRegistrados, clientes, reservas, menu, ventas, mesas, reportesMesa, usuarioActual, carrito, cargando,
    showCarrito, setShowCarrito,
    registrarUsuario, editarUsuario, eliminarUsuario, agregarPlato, editarPlato, eliminarPlato,
    agregarReserva, editarReserva, eliminarReserva, manejarLogin, logout,
    agregarAlCarrito, restarDelCarrito, eliminarDelCarrito, finalizarPago,
    agregarMesa, editarMesa, eliminarMesa,
    enviarReporteMesa, marcarReporteLeido,
    tema, toggleTema
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

