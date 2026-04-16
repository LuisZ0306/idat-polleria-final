<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    protected $table = 'reservas';
    protected $fillable = ['usuario_id', 'fecha', 'hora', 'duracion', 'personas', 'mesa_id', 'estado'];
    public $timestamps = false;
}
