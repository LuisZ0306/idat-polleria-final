<?php

namespace App\Http\Controllers;

use App\Models\Mesa;
use Illuminate\Http\Request;

class MesaController extends Controller
{
    public function index() { 
        return response()->json(Mesa::all()); 
    }

    public function store(Request $request) {
        // VALIDACIÓN DE SEGURIDAD: Número de mesa único
        $existe = Mesa::where('numero', $request->numero)->first();
        if ($existe) {
            return response()->json([
                'error' => 'DUPLICADO',
                'message' => '¡Error de Seguridad! La Mesa ' . $request->numero . ' ya existe en el sistema.'
            ], 422);
        }

        $m = Mesa::create($request->all());
        return response()->json($m, 201);
    }

    public function update(Request $request, $id) {
        $m = Mesa::findOrFail($id);
        
        // Validar número único al editar
        if ($request->has('numero') && $request->numero != $m->numero) {
            $existe = Mesa::where('numero', $request->numero)->where('id', '!=', $id)->first();
            if ($existe) {
                return response()->json(['error' => 'DUPLICADO', 'message' => 'Ese número de mesa ya está ocupado.'], 422);
            }
        }

        $m->update($request->all());
        return response()->json($m);
    }

    // NUEVA FUNCIÓN PARA ELIMINAR MESA
    public function destroy($id) {
        Mesa::findOrFail($id)->delete();
        return response()->json(['message' => 'Mesa eliminada del salón.']);
    }
}
