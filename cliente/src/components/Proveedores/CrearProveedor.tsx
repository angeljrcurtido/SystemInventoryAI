import React, { useState } from 'react';
import axios from 'axios';
import ListaProveedor from './ListaProveedor';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';

Modal.setAppElement('#root'); // Necesario para accesibilidad
const CrearProveedor = () => {
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [isShowTable, setIsShowTable] = useState(false);
  const [formData, setFormData] = useState({
    nombreProveedor: '',
    rucProveedor: '',
    direccionProveedor: '',
    telefonoProveedor: '',
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
      const response = await axios.post('http://127.0.0.1:5000/proveedores', formData);
      setAdvertirError(true);
      setTitleError('Proveedor creado exitosamente');
      console.log(response.data);
      // Reiniciar el formulario
      setFormData({
        nombreProveedor: '',
        rucProveedor: '',
        direccionProveedor: '',
        telefonoProveedor: '',
      });
    } catch (error) {
      setAdvertirError(true);
      setTitleError('Error al crear el proveedor');
    }
  };

  return (
    <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Proveedor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700">Nombre del Proveedor</label>
            <input
              name="nombreProveedor"
              type="text"
              value={formData.nombreProveedor}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">RUC del Proveedor</label>
            <input
              name="rucProveedor"
              type="text"
              value={formData.rucProveedor}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Dirección del Proveedor</label>
            <input
              name="direccionProveedor"
              type="text"
              value={formData.direccionProveedor}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Teléfono del Proveedor</label>
            <input
              name="telefonoProveedor"
              type="text"
              value={formData.telefonoProveedor}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            disabled={
              !formData.nombreProveedor ||
              !formData.rucProveedor ||
              !formData.direccionProveedor ||
              !formData.telefonoProveedor
            }
          >
            Crear Proveedor
          </button>
          <button type='button' onClick={() => { setIsShowTable(true) }}>Lista de Proveedores</button>
          <Modal
            isOpen={isShowTable}
            onRequestClose={() => { setIsShowTable(false) }}
            contentLabel="Listado de Empresas"
            className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
            overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
          >
            <ListaProveedor />
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

export default CrearProveedor;
