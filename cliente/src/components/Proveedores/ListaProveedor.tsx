import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

interface Proveedor {
  _id: string;
  nombreProveedor: string;
  rucProveedor: string;
  direccionProveedor: string;
  telefonoProveedor: string;
  estado: string;
}

interface ListaProveedorProps {
  estado?: 'activo' | 'anulado'; // Opcionalmente recibe el estado
  isShow?: boolean; // Prop opcional para cambiar la acción del botón
  onSelect?: (proveedor: Proveedor) => void;
}

const ListaProveedor: React.FC<ListaProveedorProps> = ({ estado, isShow = false, onSelect }) => {
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determina la URL a utilizar en función del estado
  const getEndpoint = () => {
    if (estado === 'activo') return 'http://127.0.0.1:5000/proveedores/activos';
    if (estado === 'anulado') return 'http://127.0.0.1:5000/proveedores/anulados';
    return 'http://127.0.0.1:5000/proveedores';
  };

  // Fetch proveedores al cargar el componente
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getEndpoint());
        setProveedores(response.data);
      } catch (err) {
        setError('Error al cargar los proveedores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, [estado]);

  // Función para anular un proveedor
  const handleAnular = async (proveedorId: string) => {
    try {
      await axios.put(`http://127.0.0.1:5000/proveedores/anular/${proveedorId}`);
      setAdvertirError(true);
      setTitleError('Proveedor anulado exitosamente');
      // Actualizar la lista de proveedores tras la anulación
      setProveedores((prevProveedores) =>
        prevProveedores.map((proveedor) =>
          proveedor._id === proveedorId ? { ...proveedor, estado: 'anulado' } : proveedor
        )
      );
    } catch (error) {
      setAdvertirError(true);
      setTitleError('Error al anular el proveedor');
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando proveedores...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Lista de Proveedores {estado ? `(${estado})` : ''}
      </h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">RUC</th>
            <th className="py-2 px-4 border-b">Dirección</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Acción</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((proveedor) => (
              <tr key={proveedor._id}>
                <td className="py-2 px-4 border-b">{proveedor.nombreProveedor}</td>
                <td className="py-2 px-4 border-b">{proveedor.rucProveedor}</td>
                <td className="py-2 px-4 border-b">{proveedor.direccionProveedor}</td>
                <td className="py-2 px-4 border-b">{proveedor.telefonoProveedor}</td>
                <td className="py-2 px-4 border-b capitalize">{proveedor.estado}</td>
                <td className="py-2 px-4 border-b">
                  {isShow ? (
                    <button
                      onClick={() => onSelect && onSelect(proveedor)}
                      className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                      Seleccionar
                    </button>
                  ) : proveedor.estado === 'activo' ? (
                    <button
                      onClick={() => handleAnular(proveedor._id)}
                      className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    >
                      Anular
                    </button>
                  ) : (
                    <span className="text-gray-500">Anulado</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-4 text-center text-gray-500">
                No hay proveedores disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
                         {/* Modal de Advertencia */}
                         <ModalAdvertencia
                        isVisible={advertirError}
                        title={titleError}
                        onClose={()=> setAdvertirError(false)}
                        //onAccept={handleConfirmarAdvertencia}
                        //isAccept={true}
                        secondbtnText = {"Cerrar"}
                    />
    </div>
  );
};

export default ListaProveedor;
