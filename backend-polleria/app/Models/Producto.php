<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'categoria_id',
        'precio',
        'descripcion',
        'imagen',
        'es_recomendado' // NUEVO CAMPO
    ];

    public $timestamps = false;

    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }
}
