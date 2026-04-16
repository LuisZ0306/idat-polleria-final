<?php

namespace App\Http\Controllers;

use App\Models\ReporteMesa;
use Illuminate\Http\Request;

class ReporteMesaController extends Controller
{
    public function index() {
        return response()->json(ReporteMesa::with('mesa')->orderBy('fecha', 'desc')->get());
    }

    public function store(Request $request) {
        $reporte = ReporteMesa::create($request->all());
        return response()->json($reporte, 201);
    }

    public function update(Request $request, $id) {
        $reporte = ReporteMesa::findOrFail($id);
        $reporte->update(['visto' => 1]);
        return response()->json($reporte);
    }
}
