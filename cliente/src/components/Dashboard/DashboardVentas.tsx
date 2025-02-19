import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import 'tailwindcss/tailwind.css';

interface Producto {
  cantidadVendida: number;
  nombreProducto: string;
  precioVenta: number;
}

interface Venta {
  _id: string;
  fechaVenta: string;
  estado: string;
  nombreCliente: string;
  productos: Producto[];
  precioVentaTotal?: number;  // Hacemos que sea opcional porque puede no existir
}

const Dashboard: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalProductosVendidos, setTotalProductosVendidos] = useState(0);
  const [totalIngresoVentas, setTotalIngresoVentas] = useState(0);

  // Obtener las ventas desde el servidor
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/ventas');
        const data = response.data;

        // Calcular estadísticas
        let totalProdVendidos = 0;
        let totalIngreso = 0;

        data.forEach((venta: Venta) => {
          venta.productos.forEach((producto: Producto) => {
            totalProdVendidos += producto.cantidadVendida;
          });
          
          // Si no hay precioVentaTotal, se usa 0
          totalIngreso += venta.precioVentaTotal || 0;
        });

        setVentas(data);
        setTotalVentas(data.length);
        setTotalProductosVendidos(totalProdVendidos);
        setTotalIngresoVentas(totalIngreso);
      } catch (error) {
        console.error('Error al obtener ventas:', error);
      }
    };

    fetchVentas();
  }, []);

  // Preparamos los datos para los gráficos
  const productosPorVenta = ventas.map((venta) => ({
    fecha: venta.fechaVenta,
    productos: venta.productos.reduce((acc, prod) => acc + prod.cantidadVendida, 0),
  }));

  const estadoDeVentas = ventas.reduce(
    (acc, venta) => {
      if (venta.estado === 'activo') {
        acc.activo += 1;
      } else if (venta.estado === 'anulado') {
        acc.anulado += 1;
      }
      return acc;
    },
    { activo: 0, anulado: 0 }
  );

  const coloresPieChart = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-6 min-h-screen bg-gray-100 overflow-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard de Ventas</h1>

      {/* Cards estadísticas */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Ventas</h2>
          <p className="text-4xl font-bold">{totalVentas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Productos Vendidos</h2>
          <p className="text-4xl font-bold">{totalProductosVendidos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Ingreso en Ventas</h2>
          <p className="text-4xl font-bold">{totalIngresoVentas.toLocaleString()} Gs</p>
        </div>
      </div>

      {/* Gráfico de barras: Productos Vendidos por Fecha */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Productos Vendidos por Fecha</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosPorVenta}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="productos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pastel: Estado de las Ventas */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Estado de las Ventas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Activas', value: estadoDeVentas.activo },
                { name: 'Anuladas', value: estadoDeVentas.anulado },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              <Cell key="Activas" fill={coloresPieChart[0]} />
              <Cell key="Anuladas" fill={coloresPieChart[1]} />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
