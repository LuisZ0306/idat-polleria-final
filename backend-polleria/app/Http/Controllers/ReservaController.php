<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Mesa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservaController extends Controller
{
    public function index() {
        return response()->json(Reserva::all());
    }

    public function store(Request $request) {
        // TRANSACCIÓN DE BASE DE DATOS (NIVEL CONCIERTO)
        return DB::transaction(function () use ($request) {
            
            // 1. Verificamos que la mesa no esté en mantenimiento
            $mesa = Mesa::find($request->mesa_id);
            if (!$mesa || strtolower($mesa->estado) !== 'disponible') {
                return response()->json([
                    'error' => 'MESA_BLOQUEADA',
                    'message' => '¡Esta mesa se encuentra en mantenimiento!'
                ], 422);
            }

            // 2. Cálculos Matemáticos de Tiempos
            $fecha = $request->fecha;
            $horaInicioRequest = strtotime("$fecha {$request->hora}");
            $duracionRequest = $request->duracion ?? 1.5; // Por defecto 1 hora y media
            $horaFinRequest = $horaInicioRequest + ($duracionRequest * 3600);

            // 3. BLOQUEO CONCURRENTE (PESSIMISTIC LOCKING)
            // Congela las reservas de esta mesa hoy para que nadie más pueda leerlas hasta que terminemos
            $reservasDelDia = Reserva::where('mesa_id', $request->mesa_id)
                                     ->where('fecha', $fecha)
                                     ->where('estado', '!=', 'Cancelada')
                                     ->lockForUpdate() 
                                     ->get();

            // 4. Verificación Exhaustiva de Choques
            foreach ($reservasDelDia as $r) {
                $inicioReserva = strtotime("$r->fecha $r->hora");
                $finReserva = $inicioReserva + (($r->duracion ?? 1.5) * 3600);

                // Lógica de Cruce de Horarios
                if ($horaInicioRequest < $finReserva && $horaFinRequest > $inicioReserva) {
                    return response()->json([
                        'error' => 'CONCIERTO_CRUCE',
                        'message' => '¡Ups! Alguien acaba de reservar esta mesa para ese horario exacto. Por favor, elige otra mesa u otro horario.'
                    ], 409);
                }
            }

            // 5. Si la mesa está libre en ese horario, procedemos a crear la reserva
            $reserva = Reserva::create([
                'usuario_id' => $request->usuario_id,
                'mesa_id' => $request->mesa_id,
                'fecha' => $fecha,
                'hora' => $request->hora,
                'duracion' => $duracionRequest,
                'personas' => $request->personas,
                'estado' => 'Confirmada'
            ]);

            return response()->json($reserva, 201);
        });
    }

    public function update(Request $request, $id) {
        $r = Reserva::findOrFail($id);
        $r->update($request->all());
        return response()->json($r);
    }

    public function destroy($id) {
        $r = Reserva::findOrFail($id);
        // Las reservas no se borran, se cancelan por historial
        $r->estado = 'Cancelada';
        $r->save();
        return response()->json(['message' => 'Reserva cancelada correctamente.']);
    }
}
