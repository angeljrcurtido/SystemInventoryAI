import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

interface Categoria {
  _id: string;
  nombreCategoria: string;
  estado: string;
}

interface ListaCategoriaProps {
  estado?: 'activo' | 'anulado'; // Prop opcional para filtrar por estado
  isShow?: boolean; // Prop opcional para cambiar la acción del botón
  onSelect?: (nombreCategoria: string) => void; // Función para manejar la selección de la categoría
}

const ListaCategoria: React.FC<ListaCategoriaProps> = ({ estado, isShow = false, onSelect }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determina la URL a utilizar en función del estado
  const getEndpoint = () => {
    if (estado === 'activo') return 'http://127.0.0.1:5000/categorias/activas';
    if (estado === 'anulado') return 'http://127.0.0.1:5000/categorias/anuladas';
    return 'http://127.0.0.1:5000/categorias';
  };

  // Fetch de categorías al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await axios.get(getEndpoint());
        setCategorias(response.data);
      } catch (err) {
        setError('Error al cargar las categorías');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [estado]);

  // Función para anular una categoría
  const handleAnular = async (categoriaId: string) => {
    try {
      await axios.put(`http://127.0.0.1:5000/categorias/anular/${categoriaId}`);
      setAdvertirError(true);
      setTitleError('Categoría anulada exitosamente');
      // Actualizar la lista de categorías tras la anulación
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria._id === categoriaId ? { ...categoria, estado: 'anulado' } : categoria
        )
      );
    } catch (error) {
      setAdvertirError(true);
      setTitleError('Error al anular la categoría');
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando categorías...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Lista de Categorías</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Nombre de la Categoría</th>
            <th className="py-2 px-4 border-b">Acción</th>
          </tr>
        </thead>
        <tbody>
          {categorias.length > 0 ? (
            categorias.map((categoria) => (
              <tr key={categoria._id}>
                <td className="py-2 px-4 border-b">{categoria.nombreCategoria}</td>
                <td className="py-2 px-4 border-b">
                  {isShow ? (
                    <button
                      onClick={() => onSelect && onSelect(categoria.nombreCategoria)}
                      className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                      Seleccionar
                    </button>
                  ) : categoria.estado === 'activo' ? (
                    <button
                      onClick={() => handleAnular(categoria._id)}
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
              <td colSpan={2} className="py-4 text-center text-gray-500">
                No hay categorías disponibles
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

export default ListaCategoria;
