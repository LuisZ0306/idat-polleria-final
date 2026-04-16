<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index() { 
        $productos = Producto::with('categoria')->get();
        return response()->json($productos->map(function($p) {
            $p->categoria_nombre = $p->categoria ? $p->categoria->nombre : 'Sin categoría';
            return $p;
        })); 
    }

    public function store(Request $request) {
        $existe = Producto::where('nombre', $request->nombre)->first();
        if ($existe) return response()->json(['error' => 'DUPLICADO', 'message' => '¡Error! Nombre repetido.'], 422);

        $categoria = Categoria::where('nombre', $request->categoria)->first();
        
        // Limpieza de datos para MySQL
        $p = Producto::create([
            'nombre' => $request->nombre,
            'categoria_id' => $categoria ? $categoria->id : null,
            'precio' => $request->precio,
            'descripcion' => $request->desc ?? $request->descripcion,
            'imagen' => $request->img ?? $request->imagen,
            'es_recomendado' => $request->es_recomendado ? 1 : 0
        ]);

        $p->categoria_nombre = $categoria ? $categoria->nombre : 'Sin categoría';
        return response()->json($p, 201);
    }

    public function update(Request $request, $id) {
        $p = Producto::findOrFail($id);
        $datos = $request->all();
        
        // Aseguramos que los nombres de campos coincidan
        if(isset($datos['img'])) $datos['imagen'] = $datos['img'];
        if(isset($datos['desc'])) $datos['descripcion'] = $datos['desc'];
        
        // Forzamos conversión de booleano a entero para MySQL
        if(isset($datos['es_recomendado'])) {
            $datos['es_recomendado'] = ($datos['es_recomendado'] == true || $datos['es_recomendado'] == 1) ? 1 : 0;
        }

        $p->update($datos);
        
        $cat = Categoria::find($p->categoria_id);
        $p->categoria_nombre = $cat ? $cat->nombre : 'Sin categoría';
        return response()->json($p);
    }

    public function destroy($id) {
        Producto::findOrFail($id)->delete();
        return response()->json(['message' => 'Eliminado']);
    }
}
