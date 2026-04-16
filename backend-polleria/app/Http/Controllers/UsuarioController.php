<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function index() { return response()->json(Usuario::all()); }

    public function store(Request $request) {
        // VALIDACIÓN DE SEGURIDAD: Evitar duplicados
        $existeEmail = Usuario::where('email', $request->email)->first();
        if ($existeEmail) {
            return response()->json(['error' => 'DUPLICADO', 'message' => '¡Error! Este correo ya está registrado.'], 422);
        }

        $existeDni = Usuario::where('num_doc', $request->num_doc)->first();
        if ($existeDni) {
            return response()->json(['error' => 'DUPLICADO', 'message' => '¡Error de Seguridad! Este número de documento ya pertenece a otro usuario.'], 422);
        }

        $u = Usuario::create($request->all());
        return response()->json($u, 201);
    }

    public function update(Request $request, $id) {
        $u = Usuario::findOrFail($id);
        
        // Validar DNI único al editar (ignorando al usuario actual)
        if ($request->has('num_doc') && $request->num_doc !== $u->num_doc) {
            $existe = Usuario::where('num_doc', $request->num_doc)->where('id', '!=', $id)->first();
            if ($existe) {
                return response()->json(['error' => 'DUPLICADO', 'message' => 'El número de documento ya está en uso.'], 422);
            }
        }

        $u->update($request->all());
        return response()->json($u);
    }

    public function destroy($id) {
        Usuario::findOrFail($id)->delete();
        return response()->json(['message' => 'Eliminado']);
    }
}
