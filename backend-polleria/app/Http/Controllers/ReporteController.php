<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\VentaDetalle;
use App\Models\Reserva;
use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ReporteController extends Controller
{
    public function getFilteredReport(Request $request)
    {
        $fechaInicio = $request->query('fecha_inicio');
        $fechaFin = $request->query('fecha_fin');

        try {
            // --- 1. RESERVAS (Búsqueda en tabla 'reserva' o 'reservas') ---
            $tablaReserva = Schema::hasTable('reserva') ? 'reserva' : (Schema::hasTable('reservas') ? 'reservas' : null);
            $reservasFiltradas = collect();
            
            if ($tablaReserva) {
                $colFechaRes = Schema::hasColumn($tablaReserva, 'fechareserva') ? 'fechareserva' : 'fecha';
                $reservasFiltradas = DB::table($tablaReserva)
                    ->where($colFechaRes, '>=', $fechaInicio)
                    ->where($colFechaRes, '<=', $fechaFin)
                    ->get();
            }

            // --- 2. VENTAS ---
            $tablaVentas = Schema::hasTable('ventas') ? 'ventas' : 'venta';
            $colVenta = Schema::hasColumn($tablaVentas, 'fecha') ? 'fecha' : (Schema::hasColumn($tablaVentas, 'created_at') ? 'created_at' : null);
            
            $ventasDelPeriodo = collect();
            if ($colVenta) {
                $ventasDelPeriodo = DB::table($tablaVentas)
                    ->whereDate($colVenta, '>=', $fechaInicio)
                    ->whereDate($colVenta, '<=', $fechaFin)
                    ->get();
            }
                
            $idsVentas = $ventasDelPeriodo->pluck('id');

            // --- 3. DETALLE DE PRODUCTOS ---
            $platosVendidos = collect();
            $tablaDetalle = Schema::hasTable('venta_detalles') ? 'venta_detalles' : (Schema::hasTable('venta_detalle') ? 'venta_detalle' : null);
            
            if ($idsVentas->isNotEmpty() && $tablaDetalle) {
                $platosVendidos = DB::table($tablaDetalle)
                    ->join('productos', "$tablaDetalle.producto_id", '=', 'productos.id')
                    ->whereIn("$tablaDetalle.venta_id", $idsVentas)
                    ->select(
                        'productos.nombre',
                        "$tablaDetalle.cantidad",
                        "$tablaDetalle.precio_unitario",
                        "$tablaDetalle.venta_id"
                    )
                    ->get()
                    ->map(function($det) use ($ventasDelPeriodo, $colVenta) {
                        $venta = $ventasDelPeriodo->firstWhere('id', $det->venta_id);
                        $fechaVenta = $venta ? $venta->$colVenta : null;
                        return [
                            'producto' => ['nombre' => $det->nombre],
                            'cantidad' => $det->cantidad,
                            'recaudado' => $det->cantidad * $det->precio_unitario,
                            'fecha' => $fechaVenta ? date('d-m-Y', strtotime($fechaVenta)) : 'Hoy',
                            'hora' => $fechaVenta ? date('H:i', strtotime($fechaVenta)) : '00:00'
                        ];
                    });
            }

            // --- 4. RESPUESTA ---
            return response()->json([
                'resumen' => [
                    'cant_reservas' => $reservasFiltradas->count(),
                    'total_ventas' => (float)$ventasDelPeriodo->sum('total'),
                    'platos_contados' => (int)$platosVendidos->sum('cantidad')
                ],
                'platos_detalle' => $platosVendidos,
                'reservas_detalle' => $reservasFiltradas->map(function($r) {
                    return [
                        'id' => $r->idreserva ?? ($r->id ?? 0),
                        'fechareserva' => $r->fechareserva ?? ($r->fecha ?? 'N/A'),
                        'horainicio' => $r->horainicio ?? ($r->hora ?? '00:00'),
                        'mesa' => $r->mesa ?? ($r->mesa_id ?? '?'),
                        'estado' => ($r->estadoreserva ?? ($r->estado ?? 0)) == 1 || ($r->estado ?? '') === 'Confirmada' ? 'Confirmada' : 'Pendiente'
                    ];
                })
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'resumen' => ['cant_reservas' => 0, 'total_ventas' => 0, 'platos_contados' => 0],
                'platos_detalle' => [],
                'reservas_detalle' => []
            ], 200);
        }
    }

    public function getDashboardStats()
    {
        try {
            $totalVentas = Schema::hasTable('ventas') ? Venta::sum('total') : 0;
            $cantReservas = Schema::hasTable('reserva') ? Reserva::count() : 0;
            $cantMesasLibres = Schema::hasTable('mesa') ? Mesa::where('estadouso', 1)->count() : 0;

            $topPlatos = [];
            if (Schema::hasTable('venta_detalles')) {
                $topPlatos = VentaDetalle::select('producto_id', DB::raw('SUM(cantidad) as total_vendido'))
                    ->with('producto:id,nombre')
                    ->groupBy('producto_id')
                    ->orderBy('total_vendido', 'desc')
                    ->take(5)
                    ->get();
            }

            $ventasPorPago = Schema::hasTable('ventas') ? Venta::select('metodo_pago', DB::raw('SUM(total) as monto'))->groupBy('metodo_pago')->get() : [];
            
            $reservasPorEstado = [];
            if (Schema::hasTable('reserva')) {
                $columnaEstado = Schema::hasColumn('reserva', 'estadoreserva') ? 'estadoreserva' : 'estado';
                $reservasPorEstado = Reserva::select($columnaEstado . ' as estadoreserva', DB::raw('count(*) as cantidad'))->groupBy($columnaEstado)->get();
            }

            return response()->json([
                'resumen' => ['total_ventas' => (float)$totalVentas, 'total_reservas' => (int)$cantReservas, 'mesas_libres' => (int)$cantMesasLibres],
                'top_platos' => $topPlatos,
                'metodos_pago' => $ventasPorPago,
                'estados_reserva' => $reservasPorEstado
            ]);
        } catch (\Exception $e) { return response()->json(['error' => $e->getMessage()], 200); }
    }
}
