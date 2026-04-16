<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $venta = Venta::create([
                'usuario_id' => $request->usuario_id,
                'total' => $request->total,
                'metodo_pago' => $request->metodo_pago
            ]);

            foreach ($request->productos as $item) {
                // Si el ID es numérico, lo guardamos en detalles (Platos reales)
                if (is_numeric($item['id'])) {
                    VentaDetalle::create([
                        'venta_id' => $venta->id,
                        'producto_id' => (int)$item['id'],
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $item['precio']
                    ]);
                }
                // Si no es numérico (como 'reserva_15'), solo se registra la venta total 
                // pero no se vincula a un producto de la carta en los detalles.
            }

            return response()->json(['message' => '¡Venta registrada!', 'id' => $venta->id], 201);
        });
    }

    public function index() {
        // Traemos las ventas con sus detalles Y los nombres de los productos
        return response()->json(Venta::with('detalles.producto')->get());
    }
}
