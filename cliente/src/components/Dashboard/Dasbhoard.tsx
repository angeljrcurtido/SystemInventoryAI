import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import 'tailwindcss/tailwind.css';

interface Producto {
  cantidadComprada: number;
  nombreProducto: string;
  precioCompra: number;
}

interface Compra {
  _id: string;
  fechaCompra: string;
  estado: string;
  nombreProveedor: string;
  productos: Producto[];
  rucProveedor: string;
  telefonoProveedor: string;
}

const Dashboard: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalGasto, setTotalGasto] = useState(0);

  // Obtener las compras desde el servidor
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/compras');
        const data = response.data;

        // Calcular estadísticas
        let totalProd = 0;
        let totalGastoCompra = 0;

        data.forEach((compra: Compra) => {
          compra.productos.forEach((producto: Producto) => {
            totalProd += producto.cantidadComprada;
            totalGastoCompra += producto.cantidadComprada * producto.precioCompra;
          });
        });

        setCompras(data);
        setTotalCompras(data.length);
        setTotalProductos(totalProd);
        setTotalGasto(totalGastoCompra);
      } catch (error) {
        console.error('Error al obtener compras:', error);
      }
    };

    fetchCompras();
  }, []);

  // Preparamos los datos para los gráficos
  const productosPorCompra = compras.map((compra) => ({
    fecha: compra.fechaCompra,
    productos: compra.productos.reduce((acc, prod) => acc + prod.cantidadComprada, 0),
  }));

  const coloresPieChart = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-6 min-h-screen bg-gray-100 overflow-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard de Compras</h1>

      {/* Cards estadísticas */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Compras</h2>
          <p className="text-4xl font-bold">{totalCompras}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Productos Comprados</h2>
          <p className="text-4xl font-bold">{totalProductos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Total Gasto en Compras</h2>
          <p className="text-4xl font-bold">{totalGasto.toLocaleString()} Gs</p>
        </div>
      </div>

      {/* Gráfico de barras: Productos por Fecha */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Productos Comprados por Fecha</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productosPorCompra}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="productos" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pastel: Estado de las Compras */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Estado de las Compras</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={compras}
              dataKey="productos.length"
              nameKey="estado"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={(entry) => entry.estado}
            >
              {compras.map((index:any) => (
                <Cell key={`cell-${index}`} fill={coloresPieChart[index % coloresPieChart.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
