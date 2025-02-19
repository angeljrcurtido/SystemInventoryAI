import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ListaCategoria from './ListaCategorias';
import ModalAdvertencia from '../utils/ModalAdvertencia';

Modal.setAppElement('#root'); // Necesario para accesibilidad

const CrearCategoria = () => {
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [isShowTable, setIsShowTable] = useState(false);
  const [formData, setFormData] = useState({
    nombreCategoria: '',
  });

  // Maneja el cambio de valores en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/categorias', formData);
      setAdvertirError(true);
      setTitleError('Categoria creada exitosamente');
      console.log(response.data);
      // Reiniciar el formulario
      setFormData({
        nombreCategoria: '',
      });
    } catch (error) {
      setAdvertirError(true);
      setTitleError('Error al crear la categoría');
      console.error(error);
    }
  };

  return (
    <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Categoría</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700">Nombre de la Categoría</label>
            <input
              name="nombreCategoria"
              type="text"
              value={formData.nombreCategoria}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            disabled={!formData.nombreCategoria}
          >
            Crear Categoría
          </button>
          <button type='button' onClick={() => setIsShowTable(true)}>Lista de Categorías</button>
          <Modal
            isOpen={isShowTable}
            onRequestClose={() => setIsShowTable(false)}
            contentLabel="Listado de Categorías"
            className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
            overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
          >
            {/* Aquí puedes incluir un componente para listar las categorías */}
            <ListaCategoria/>
          </Modal>

               {/* Modal de Advertencia */}
               <ModalAdvertencia
                        isVisible={advertirError}
                        title={titleError}
                        onClose={()=> setAdvertirError(false)}
                        //onAccept={handleConfirmarAdvertencia}
                        //isAccept={true}
                        secondbtnText = {"Cerrar"}
                    />
        </form>
      </div>
    </div>
  );
};

export default CrearCategoria;
