<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas';
    protected $fillable = ['usuario_id', 'total', 'metodo_pago'];
    public $timestamps = false;

    public function detalles() {
        return $this->hasMany(VentaDetalle::class, 'venta_id');
    }
}
