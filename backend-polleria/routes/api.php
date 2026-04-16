<?php

use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\CategoriaController;

use App\Http\Controllers\ReporteController;

// RUTA PARA EL DASHBOARD DE ADMIN
Route::get('/dashboard-stats', [ReporteController::class, 'getDashboardStats']);
Route::get('/reporte-filtrado', [ReporteController::class, 'getFilteredReport']);

// RUTAS PARA LAS CATEGORÍAS
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'show']);
Route::post('/categorias', [CategoriaController::class, 'store']);
Route::put('/categorias/{id}', [CategoriaController::class, 'update']);
Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy']);

// RUTAS PARA LOS PRODUCTOS DE LA POLLERÍA
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::post('/productos', [ProductoController::class, 'store']);
Route::put('/productos/{id}', [ProductoController::class, 'update']);
Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

// RUTAS PARA LOS USUARIOS Y PERSONAL
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);

// RUTAS PARA LAS VENTAS
Route::get('/ventas', [App\Http\Controllers\VentaController::class, 'index']);
Route::post('/ventas', [App\Http\Controllers\VentaController::class, 'store']);

// RUTAS PARA LAS RESERVAS Y MESAS
Route::get('/reservas', [App\Http\Controllers\ReservaController::class, 'index']);
Route::post('/reservas', [App\Http\Controllers\ReservaController::class, 'store']);
Route::put('/reservas/{id}', [App\Http\Controllers\ReservaController::class, 'update']);
Route::delete('/reservas/{id}', [App\Http\Controllers\ReservaController::class, 'destroy']);

Route::get('/mesas', [App\Http\Controllers\MesaController::class, 'index']);
Route::post('/mesas', [App\Http\Controllers\MesaController::class, 'store']);
Route::put('/mesas/{id}', [App\Http\Controllers\MesaController::class, 'update']);
Route::delete('/mesas/{id}', [App\Http\Controllers\MesaController::class, 'destroy']);

// RUTAS PARA REPORTES DE MESAS
Route::get('/reportes-mesa', [App\Http\Controllers\ReporteMesaController::class, 'index']);
Route::post('/reportes-mesa', [App\Http\Controllers\ReporteMesaController::class, 'store']);
Route::put('/reportes-mesa/{id}', [App\Http\Controllers\ReporteMesaController::class, 'update']);

Route::get('/test', function () {
    return '¡API Pollería funcionando!';
});
