/**
 * MODELO DE SEGURIDAD (POO)
 * Aplicando Clases, Objetos, Herencia y Polimorfismo
 */

// 1. Clase Base (Herencia)
class UsuarioBase {
  constructor(datos) {
    // Si no hay datos, inicializamos con valores vacíos para evitar errores
    this.id = datos?.id || 0;
    this.nombre = datos?.nombre || 'Invitado';
    this.apellido = datos?.apellido || '';
    this.rol = datos?.rol || 'invitado';
    this.email = datos?.email || '';
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  // 2. Polimorfismo: Este método se comportará diferente en las clases hijas
  obtenerPermisos() {
    return ["VER_MENU", "HACER_RESERVA"];
  }

  puedeAccederAlPanel() {
    return false;
  }
}

// 3. Herencia: Empleado hereda de UsuarioBase
class Empleado extends UsuarioBase {
  obtenerPermisos() {
    // Polimorfismo: El empleado tiene más permisos que el usuario base
    return ["VER_MENU", "HACER_RESERVA", "VER_PEDIDOS", "GESTIONAR_MESAS"];
  }

  puedeAccederAlPanel() {
    return true;
  }
}

// 4. Herencia: Administrador hereda de Empleado
class Administrador extends Empleado {
  obtenerPermisos() {
    // Polimorfismo: El admin tiene control total
    return ["VER_MENU", "HACER_RESERVA", "VER_PEDIDOS", "GESTIONAR_MESAS", "GESTIONAR_PERSONAL", "GESTIONAR_MENU", "DESCARGAR_RESPALDO"];
  }

  puedeEliminarPersonal() {
    return true;
  }
}

// 5. Fábrica de Objetos (Factory Pattern)
export class SeguridadProtocolo {
  static crearUsuario(datos) {
    // Siempre devolvemos un objeto válido, nunca null, para evitar que la App se "rompa"
    if (!datos) return new UsuarioBase(null);
    
    if (datos.rol === 'admin') return new Administrador(datos);
    if (datos.rol === 'empleado') return new Empleado(datos);
    
    return new UsuarioBase(datos);
  }
}
