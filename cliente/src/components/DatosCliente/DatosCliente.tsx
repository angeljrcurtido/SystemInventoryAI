import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';
Modal.setAppElement('#root');
const DatosCliente: React.FC = () => {
    const [cliente, setCliente] = useState({
        nombreCliente: '',
        rucCliente: '',
        telefonoCliente: '',
    });
    const [advertirError, setAdvertirError] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/clientes', cliente);
            if (response.status === 201) {
                setTitleError('Cliente creado con éxito');
                setAdvertirError(true);
                setCliente({
                    nombreCliente: '',
                    rucCliente: '',
                    telefonoCliente: ''
                });
            }
        } catch (error) {
            setTitleError('Error al registrar el cliente');
            setAdvertirError(true);
        }
    };

    // Función para abrir el modal
    const openModal = async () => {
        setIsModalOpen(true);
        try {
            const response = await axios.get('http://127.0.0.1:5000/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
        }
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
                <h2 className="text-2xl font-bold mb-6">Registrar Cliente</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Nombre del Cliente</label>
                    <input
                        type="text"
                        name="nombreCliente"
                        value={cliente.nombreCliente}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">RUC del Cliente</label>
                    <input
                        type="text"
                        name="rucCliente"
                        value={cliente.rucCliente}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Teléfono del Cliente</label>
                    <input
                        type="text"
                        name="telefonoCliente"
                        value={cliente.telefonoCliente}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded mt-1"
                    />
                </div>
                <div className='flex gap-6'>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Registrar Cliente
                    </button>

                    {/* Botón para abrir el modal */}
                    <button
                        type="button"
                        onClick={openModal}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Ver Clientes
                    </button>
                </div>
            </form>

            {/* Modal para mostrar la lista de clientes */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Empresas Creadas"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >

                    <h2 className="text-2xl font-semibold mb-4 text-center">Clientes Creados</h2>
                     <div className="overflow-y-auto max-h-96">
                    {clientes.length > 0 ? (
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Nombre de Cliente</th>
                                    <th className="px-4 py-2">RUC</th>
                                    <th className='px-4 py-2'>Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente: any, index: number) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{cliente.nombreCliente}</td>
                                        <td className="px-4 py-2">{cliente.rucCliente}</td>
                                        <td className="px-4 py-2">{cliente.telefonoCliente}</td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay empresas registradas.</p>
                    )}
                </div>
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
        </div>
    );
};

export default DatosCliente;
