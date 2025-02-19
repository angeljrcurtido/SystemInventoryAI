import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

Modal.setAppElement('#root');

const DatosEmpresa = () => {
    const [advertirError, setAdvertirError] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [empresas, setEmpresas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [empresa, setEmpresa] = useState({
        nombreEmpresa: '',
        rucEmpresa: '',
        direccionEmpresa: '',
        timbradoEmpresa: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmpresa({
            ...empresa,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/empresas', empresa);
            if (response.status === 201) {
                setAdvertirError(true);
                setTitleError('Empresa creada con éxito');
                setEmpresa({
                    nombreEmpresa: '',
                    rucEmpresa: '',
                    direccionEmpresa: '',
                    timbradoEmpresa: '',
                });
            }
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Hubo un error al crear la empresa.');
        }
    };

    const fetchEmpresas = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/empresas');
            setEmpresas(response.data);
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Error al obtener las empresas.');
        }
    };

    const anularEmpresa = async (id: string) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/empresas/anular/${id}`);
            if (response.status === 200) {
                setAdvertirError(true);
                setTitleError('Empresa anulada con éxito');
                fetchEmpresas(); // Actualizar listado de empresas
            }
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Hubo un error al anular la empresa.');
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
        fetchEmpresas(); // Obtener empresas cuando se abre el modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
                <h2 className="text-xl font-semibold mb-4">Datos de la Empresa</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4'>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre de la Empresa:</label>
                        <input
                            type="text"
                            name="nombreEmpresa"
                            value={empresa.nombreEmpresa}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">RUC de la Empresa:</label>
                        <input
                            type="text"
                            name="rucEmpresa"
                            value={empresa.rucEmpresa}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Dirección de la Empresa:</label>
                        <input
                            type="text"
                            name="direccionEmpresa"
                            value={empresa.direccionEmpresa}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Timbrado de la Empresa:</label>
                        <input
                            type="text"
                            name="timbradoEmpresa"
                            value={empresa.timbradoEmpresa}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className='flex gap-6'>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Enviar
                    </button>
                    <button
                        type="button"
                        onClick={openModal}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    >
                        Ver Empresas Creadas
                    </button>
                </div>
            </form>

            {/* Modal para listar las empresas */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Empresas Creadas"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <div className='flex justify-between'>
                    <h2 className="text-2xl font-semibold mb-4">Empresas Creadas</h2>
                    <button onClick={closeModal} className="top-2 right-2 bg-red-500 text-white rounded px-4 py-2">Cerrar</button>
                </div>
                <div className="overflow-y-auto max-h-96">
                    {empresas.length > 0 ? (
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2">Nombre de Empresa</th>
                                    <th className="px-4 py-2">RUC</th>
                                    <th className="px-4 py-2">Dirección</th>
                                    <th className="px-4 py-2">Timbrado</th>
                                    <th className='px-4 py-2'>Estado</th>
                                    <th className="px-4 py-2">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {empresas.map((empresa: any, index: number) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{empresa.nombreEmpresa}</td>
                                        <td className="px-4 py-2">{empresa.rucEmpresa}</td>
                                        <td className="px-4 py-2">{empresa.direccionEmpresa}</td>
                                        <td className="px-4 py-2">{empresa.timbradoEmpresa}</td>
                                        <td className="border px-4 py-2">
                                            <span
                                                className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${empresa.estado === 'activa'
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-red-200 text-red-800'
                                                    }`}
                                            >
                                                {empresa.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => anularEmpresa(empresa._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                            >
                                                Anular
                                            </button>
                                        </td>
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

export default DatosEmpresa;
