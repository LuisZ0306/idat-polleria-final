<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cliente;

class ClienteController extends Controller
{
    
    public function index()
    {
       $cliente = Cliente::all();
        return response()->json($cliente, 200);
		
    }

  
    public function store(Request $request)
    {
		$fechasistema=date('Y-m-d');
	try{
        $request->validate([
		'dni' => 'required|string|max:8|unique:cliente,dni',
        'nombres' => 'required|string',
        'telefono' => 'required|string|max:20|unique:cliente,telefono',
		'correo' => 'required|string|max:100|unique:cliente,correo'
		]);
       
		$cliente = Cliente::create([
	    'dni' => $request->dni,
        'nombres' => $request->nombres,
        'telefono' => $request->telefono,
		'correo' => $request->correo,
		'fechasistema' =>$fechasistema,
		'usuario' => 1,
		'estadocliente' => 1
			]);

		return response()->json([
        'success' => true,
        'message' => 'Cliente registrado correctamente',
        'data' => $cliente,
		], 201);
	 }
	 catch (\Illuminate\Validation\ValidationException $e) {
        // Error de validación
        return response()->json([
            'success' => false,
            'errors' => $e->errors(),
            'message' => 'Errores de validación',
        ], 422);

    } 
	 catch (\Exception $e) {
        // Otros errores
        return response()->json([
            'success' => false,
            'message' => 'Ocurrió un error al registrar el cliente.',
            'error_detail' => $e->getMessage(), 
        ], 500);
    }
    }

    
    public function show(string $id)
    {
        //
    }

   
    public function update(Request $request, string $id)
    {
        //
    }

   
    public function destroy(string $id)
    {
        //
    }
	
	public function obtenerMesas()
{
   
}

	
}
