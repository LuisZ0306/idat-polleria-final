# Pollería D' Elí - API Backend (Laravel)

Este es el sistema centralizado de datos para la Pollería D' Elí, desarrollado con **Laravel 11**. Se encarga de la gestión de usuarios, productos, ventas, mesas y la generación de reportes gerenciales.

---

## Tecnologías Utilizadas
- **Framework:** Laravel 11.x
- **Lenguaje:** PHP 8.2+
- **Base de Datos:** MySQL (MariaDB)
- **Autenticación:** Laravel Sanctum / Custom Auth
- **Reportes:** Lógica personalizada con DB Facade para alta precisión.

---

## Configuración e Instalación

### 1. Requisitos Previos
- XAMPP con PHP 8.2 y MySQL.
- Composer instalado.

### 2. Clonación y Dependencias
```bash
git clone https://github.com/LuisZ0306/idat-polleria-final.git
cd backend-polleria
composer install
```

### 3. Configuración de Base de Datos
1. Crea una base de datos llamada `db_polleria` en phpMyAdmin.
2. Copia el archivo `.env.example` a `.env`.
3. Configura tus credenciales. **Importante:** El sistema está configurado para el puerto `3307` por defecto.
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_DATABASE=db_polleria
   DB_USERNAME=root
   DB_PASSWORD=
   ```
4. Importa el archivo SQL ubicado en: `ScripDataMysql/idatrestaurant.sql`.

### 4. Ejecución
```bash
php artisan serve
```
*El API estará disponible en `http://localhost:8000`.*

---

## Funcionalidades Clave
- **Gestión de Usuarios:** CRUD completo para Administradores y Empleados (Mozos/Caja).
- **Control de Salón:** Gestión de mesas en tiempo real (Disponible/Ocupada).
- **Sistema de Reservas:** Registro y validación de disponibilidad horaria.
- **Reportes Gerenciales:** Filtrado avanzado por fechas y horas con exportación visual.
- **Seguridad:** Ocultamiento de hashes de contraseñas en las respuestas del API.

---

## Estructura Principal
- `app/Http/Controllers/`: Lógica de negocio (Reportes, Ventas, Reservas).
- `app/Models/`: Modelos de datos (Usuario, Producto, Mesa).
- `routes/api.php`: Endpoints disponibles para el frontend.
- `ScripDataMysql/`: Script de base de datos original.
