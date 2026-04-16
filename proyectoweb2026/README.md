# Pollería D' Elí - Sistema Web (React)

Interfaz de usuario moderna e interactiva para la gestión integral de la **Pollería D' Elí**. Desarrollada con React, ofrece una experiencia fluida tanto para clientes como para el personal administrativo.

---

## Características Principales

### Portal del Cliente
- **Menú Interactivo:** Visualización dinámica de productos por categorías (Brasas, Antojos, Bebidas).
- **Carrito de Compras:** Gestión de pedidos con cálculo de totales en tiempo real.
- **Reservas On-line:** Formulario con validación de disponibilidad y selección de mesa.
- **Perfil de Usuario:** Historial de compras y descarga de boletas/tickets de consumo.

### Panel de Administración
- **Dashboard en Vivo:** Monitoreo del salón y estado de las mesas.
- **Gestión de Carta:** CRUD completo de platos con carga de imágenes y destacados.
- **Control de Personal:** Registro y administración de roles (Admin/Empleado).
- **Reportes Gerenciales:** Filtros avanzados de ventas y reservas con diseño de impresión profesional (estilo ticket de caja).
- **Gestión de Mesas:** Configuración del mapa físico del local.

---

## Tecnologías Implementadas
- **Frontend:** React 18 / TypeScript / JavaScript.
- **Estilos:** Bootstrap 5 & React-Bootstrap (Diseño Responsive).
- **Estado Global:** Context API (GlobalContext) para persistencia de carrito y sesión.
- **Navegación:** React Router DOM v6.
- **Conexión:** Fetch API con el Backend Laravel.

---

## Instalación y Ejecución

### 1. Configuración del Repositorio
```bash
git clone https://github.com/LuisZ0306/idat-polleria-final.git
cd proyectoweb2026
```

### 2. Instalación de Librerías
```bash
npm install
```

### 3. Ejecución en Desarrollo
```bash
npm start
```
*La aplicación se abrirá automáticamente en `http://localhost:3000`.*

---

## Nota
El sistema de seguridad implementa modelos de **Programación Orientada a Objetos (POO)** para el control de acceso. El Panel Administrativo solo es accesible mediante usuarios con el rol `admin`. Se ha optimizado la visualización de reportes para impresión nítida en formato PDF.

---
**Desarrollado por Luis MT - Proyecto Final IDAT 2026**
