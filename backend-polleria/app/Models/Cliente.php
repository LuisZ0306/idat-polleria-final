<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'cliente';
	public $timestamps=false;
	protected $fillable = [
    'dni',
    'nombres',
    'telefono',
    'correo',
    'fechasistema',
    'usuario',
    'estadocliente'
];
}
