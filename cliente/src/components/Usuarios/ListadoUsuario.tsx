import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import CrearUsuario from './CrearUsuario';

interface Usuario {
    _id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    usuario: string;
    cargo: string;
    estado: string;
}

const ListadoUsuario: React.FC = () => {
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);

    // Obtener todos los usuarios al cargar el componente
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/usuarios');
                setUsuarios(response.data.usuarios);
            } catch (error) {
                setMensaje('Error al cargar los usuarios');
            }
        };

        fetchUsuarios();
    }, []);

    // Función para anular un usuario
    const anularUsuario = async (id: string) => {
        try {
            await axios.put(`http://127.0.0.1:5000/usuarios/anular/${id}`);
            setUsuarios(usuarios.map((usuario) =>
                usuario._id === id ? { ...usuario, estado: 'inactivo' } : usuario
            ));
            setMensaje('Usuario anulado exitosamente');
        } catch (error) {
            setMensaje('Error al anular el usuario');
        }
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full ">
                <h2 className="text-2xl font-bold mb-6">Listado de Usuarios</h2>
                
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">Nombre</th>
                            <th className="py-3 px-6 text-left">Apellido</th>
                            <th className="py-3 px-6 text-left">Teléfono</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Usuario</th>
                            <th className="py-3 px-6 text-left">Cargo</th>
                            <th className="py-3 px-6 text-left">Estado</th>
                            <th className="py-3 px-6 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario._id} className="hover:bg-gray-100 transition-colors">
                                <td className="py-3 px-6">{usuario.nombre}</td>
                                <td className="py-3 px-6">{usuario.apellido}</td>
                                <td className="py-3 px-6">{usuario.telefono}</td>
                                <td className="py-3 px-6">{usuario.email}</td>
                                <td className="py-3 px-6">{usuario.usuario}</td>
                                <td className="py-3 px-6">{usuario.cargo}</td>
                                <td className="py-3 px-6 text-center">
                                    {usuario.estado === 'inactivo' ? (
                                        <span className="text-red-500 font-semibold">Inactivo</span>
                                    ) : (
                                        <span className="text-green-500 font-semibold">Activo</span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    {usuario.estado !== 'inactivo' && (
                                        <button
                                            onClick={() => anularUsuario(usuario._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            Anular
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={()=>setIsProductoModalOpen(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Registro de Usuario</button>
            </div>

                 {/* Modal para seleccionar productos */}
                 <Modal
                isOpen={isProductoModalOpen}
                onRequestClose={() => setIsProductoModalOpen(false)}
                contentLabel="Seleccionar Productos"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <CrearUsuario/>
            </Modal>

            {/* Modal de Notificación */}
            {mensaje && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md text-center shadow-2xl animate-fade-in">
                        <h2 className="text-2xl font-bold text-green-500 mb-4">
                            ¡Operación Exitosa!
                        </h2>
                        <p className="text-gray-700 mb-6">{mensaje}</p>
                        <button
                            onClick={() => setMensaje(null)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListadoUsuario;
