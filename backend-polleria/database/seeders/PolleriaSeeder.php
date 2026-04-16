<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

class PolleriaSeeder extends Seeder
{
    public function run(): void
    {
        // Desactivar llaves foráneas para limpiar
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Usuario::truncate();
        Producto::truncate();
        Categoria::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Crear las categorías base
        $categoriasNames = ['brasas', 'parrillas', 'ensaladas', 'bebidas'];
        $categorias = [];
        foreach ($categoriasNames as $name) {
            $categorias[$name] = Categoria::create(['nombre' => $name])->id;
        }

        // 2. Insertar los productos del Menú basados en db.json
        $menu = [
            ['nombre' => '1 Pollo a la Brasa', 'categoria' => 'brasas', 'precio' => 65, 'desc' => 'Acompañado de papas fritas y ensalada fresca.', 'img' => '/img/menu/pollo-entero.jpg'],
            ['nombre' => '1/2 Pollo a la Brasa', 'categoria' => 'brasas', 'precio' => 35, 'desc' => 'Medio pollo con papas crujientes y cremas.', 'img' => '/img/menu/medio-pollo.jpg'],
            ['nombre' => '1/4 Pollo a la Brasa', 'categoria' => 'brasas', 'precio' => 19.5, 'desc' => 'La porción perfecta para tu antojo.', 'img' => '/img/menu/cuarto-pollo.jpg'],
            ['nombre' => 'Mostrito D\' Elí', 'categoria' => 'brasas', 'precio' => 12, 'desc' => '1/4 de pollo + Arroz chaufa + Papas fritas.', 'img' => '/img/menu/mostrito.jpg'],
            ['nombre' => 'Anticuchos (2 palos)', 'categoria' => 'parrillas', 'precio' => 15, 'desc' => 'Corazón de res macerado en ají panca.', 'img' => '/img/menu/anticuchos.jpg'],
            ['nombre' => 'Parrilla Familiar', 'categoria' => 'parrillas', 'precio' => 30, 'desc' => 'Pollo, chuleta, anticuchos y guarniciones.', 'img' => '/img/menu/parrilla.jpg'],
            ['nombre' => 'Ensalada Rusa', 'categoria' => 'ensaladas', 'precio' => 15, 'desc' => 'Beterraga, zanahoria, papa y mayonesa.', 'img' => '/img/menu/ensalada-rusa.jpg'],
            ['nombre' => 'Ensalada de palta', 'categoria' => 'ensaladas', 'precio' => 10, 'desc' => 'Palta, zanahoria y brócoli al vapor.', 'img' => '/img/menu/ensalada-palta.jpg'],
            ['nombre' => 'Inca Kola 1.5L', 'categoria' => 'bebidas', 'precio' => 12, 'desc' => 'La bebida de sabor nacional.', 'img' => '/img/menu/inca-kola.jpg'],
            ['nombre' => 'Chicha Morada Jarra', 'categoria' => 'bebidas', 'precio' => 3, 'desc' => 'Maíz morado natural con toque de limón.', 'img' => '/img/menu/chicha-morada.jpg'],
            ['nombre' => 'Aguajina', 'categoria' => 'bebidas', 'precio' => 5, 'desc' => 'Aguaje fresco de la selva peruana', 'img' => 'img/menu/aguajina.jpg'],
        ];

        foreach ($menu as $item) {
            Producto::create([
                'nombre' => $item['nombre'],
                'categoria_id' => $categorias[$item['categoria']],
                'precio' => $item['precio'],
                'descripcion' => $item['desc'],
                'imagen' => $item['img']
            ]);
        }

        // 3. Crear el Administrador de prueba (CONTRASEÑA EN TEXTO PLANO)
        Usuario::create([
            'nombre' => 'Admin',
            'apellido' => 'Pollería',
            'email' => 'admin@deli.com',
            'password' => 'admin',
            'rol' => 'admin',
            'tipo_doc' => 'DNI',
            'num_doc' => '00000000'
        ]);
        
        echo "¡Base de datos limpiada y datos de la pollería cargados correctamente! 🍗🍟🥤\n";
    }
}
