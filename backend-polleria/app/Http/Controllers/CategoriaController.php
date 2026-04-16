<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::all());
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string|max:100']);
        $categoria = Categoria::create($request->all());
        return response()->json($categoria, 201);
    }

    public function show($id)
    {
        $categoria = Categoria::with('productos')->find($id);
        if (!$categoria) return response()->json(['message' => 'No encontrada'], 404);
        return response()->json($categoria);
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) return response()->json(['message' => 'No encontrada'], 404);
        $categoria->update($request->all());
        return response()->json($categoria);
    }

    public function destroy($id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) return response()->json(['message' => 'No encontrada'], 404);
        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada']);
    }
}
