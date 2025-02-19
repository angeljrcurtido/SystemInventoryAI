import React, { useEffect, useState } from 'react';
import CargarImagen from './CargarImagen';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

interface Producto {
    _id: string;
    nombre: string;
    unidadMedida: string;
    precioVenta: number;
    precioCompra: number;
    CantidadActual: number;
    CantidadMinima: number;
    Proveedor: string;
    Categoria: string;
    Iva: string;
    descripcion: string;
    estado: string;
}

interface ListaProductoProps {
    estado?: 'activo' | 'anulado'; // Prop opcional para filtrar por estado
    isShow?: boolean; // Prop opcional para cambiar la acción del botón
    onSelect?: (nombreProducto: string, idProducto?: string | undefined, precioCompra?: number) => void; // Actualizado
}

const ListaProducto: React.FC<ListaProductoProps> = ({ estado, isShow = false, onSelect }) => {
    const [advertirError, setAdvertirError] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Determina la URL a utilizar en función del estado
    const getEndpoint = () => {
        if (estado === 'activo') return 'http://127.0.0.1:5000/productos/activos';
        if (estado === 'anulado') return 'http://127.0.0.1:5000/productos/anulados';
        return 'http://127.0.0.1:5000/productos';
    };

    // Fetch productos al cargar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(getEndpoint());
                setProductos(response.data);
                setFilteredProductos(response.data); // Inicialmente muestra todos los productos
            } catch (err) {
                setError('Error al cargar los productos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, [estado]);

    // Función para filtrar productos basados en el término de búsqueda
    const handleFilter = (filterTerm: string) => {
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(filterTerm)
        );
        setFilteredProductos(filtered);
    };

    // Función para reiniciar la búsqueda y mostrar todos los productos
    const handleResetSearch = () => {
        setFilteredProductos(productos);
    };

    // Función para anular un producto
    const handleAnular = async (productoId: string) => {
        try {
            await axios.put(`http://127.0.0.1:5000/productos/anular/${productoId}`);
            setAdvertirError(true);
            setTitleError('Producto anulado exitosamente');
            setProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto._id === productoId ? { ...producto, estado: 'anulado' } : producto
                )
            );
            setFilteredProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto._id === productoId ? { ...producto, estado: 'anulado' } : producto
                )
            );
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Error al anular el producto');
        }
    };

    // Función para reactivar un producto
    const handleReactivar = async (productoId: string) => {
        try {
            await axios.put(`http://127.0.0.1:5000/productos/reactivar/${productoId}`);
            setAdvertirError(true);
            setTitleError('Producto reactivado exitosamente');
            setProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto._id === productoId ? { ...producto, estado: 'activo' } : producto
                )
            );
            setFilteredProductos((prevProductos) =>
                prevProductos.map((producto) =>
                    producto._id === productoId ? { ...producto, estado: 'activo' } : producto
                )
            );
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Error al reactivar el producto');
        }
    };

    // Función para manejar búsqueda por texto
    const handleSearch = (searchTerm: string) => {
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProductos(filtered);
    };

    if (loading) {
        return <p className="text-center text-gray-500">Cargando productos...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <>
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Lista de Productos {estado ? `(${estado})` : ''}
            </h2>
            <div className="flex flex-row items-start space-x-4">
                <button
                    onClick={handleResetSearch}
                    className="py-1 px-3 bg-gray-300 mt-3 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
                >
                    Reiniciar Búsqueda
                </button>
                <div className="flex-none mb-3">
                    <CargarImagen onSearch={handleSearch} onFilter={handleFilter} />
                </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Nombre</th>
                            <th className="py-2 px-4 border-b">Unidad Medida</th>
                            <th className="py-2 px-4 border-b">Precio Venta</th>
                            <th className="py-2 px-4 border-b">Precio Compra</th>
                            <th className="py-2 px-4 border-b">Cantidad Actual</th>
                            <th className="py-2 px-4 border-b">Cantidad Mínima</th>
                            <th className="py-2 px-4 border-b">Estado</th>
                            <th className="py-2 px-4 border-b">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.length > 0 ? (
                            filteredProductos.map((producto) => (
                                <tr key={producto._id}>
                                    <td className="py-2 px-4 border-b">{producto.nombre}</td>
                                    <td className="py-2 px-4 border-b">{producto.unidadMedida}</td>
                                    <td className="py-2 px-4 border-b">{producto.precioVenta}</td>
                                    <td className="py-2 px-4 border-b">{producto.precioCompra}</td>
                                    <td className="py-2 px-4 border-b">{producto.CantidadActual}</td>
                                    <td className="py-2 px-4 border-b">{producto.CantidadMinima}</td>
                                    <td className="py-2 px-4 border-b capitalize">{producto.estado}</td>
                                    <td className="py-2 px-4 border-b">
                                        {isShow ? (
                                          <button
                                          onClick={() =>
                                              onSelect && onSelect(producto.nombre, producto._id, producto.precioCompra)
                                          }
                                          className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                                      >
                                          Seleccionar
                                      </button>
                                        ) : producto.estado === 'activo' ? (
                                            <button
                                                onClick={() => handleAnular(producto._id)}
                                                className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                            >
                                                Anular
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleReactivar(producto._id)}
                                                className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                            >
                                                Activar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-4 text-center text-gray-500">
                                    No hay productos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
                      {/* Modal de Advertencia */}
                      <ModalAdvertencia
                isVisible={advertirError}
                title={titleError}
                onClose={()=> setAdvertirError(false)}
                //onAccept={handleConfirmarAdvertencia}
                //isAccept={true}
                secondbtnText = {"Cerrar"}
               />
        </>
    );
};

export default ListaProducto;
