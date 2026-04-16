<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    protected $table = 'venta_detalles';
    protected $fillable = ['venta_id', 'producto_id', 'cantidad', 'precio_unitario'];
    public $timestamps = false;

    // AÑADIMOS LA RELACIÓN PARA OBTENER EL NOMBRE DEL POLLO/BEBIDA
    public function producto() {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
