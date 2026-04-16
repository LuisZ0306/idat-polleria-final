<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReporteMesa extends Model
{
    protected $table = 'reportes_mesa';
    protected $fillable = ['mesa_id', 'descripcion', 'visto'];
    public $timestamps = false;

    public function mesa() {
        return $this->belongsTo(Mesa::class, 'mesa_id');
    }
}
