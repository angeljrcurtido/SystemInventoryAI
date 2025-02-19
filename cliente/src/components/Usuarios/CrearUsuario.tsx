import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CrearUsuario: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        usuario: '',
        password: '',
        cargo: '',
    });

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

    // Manejar el cambio en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el cambio en el campo select para "cargo"
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);

        try {
            const response = await axios.post('http://127.0.0.1:5000/registrar-usuario', formData);
            setMensaje(response.data.message);
            setShowModal(true); // Mostrar el modal en caso de éxito
            setFormData({
                nombre: '',
                apellido: '',
                telefono: '',
                email: '',
                usuario: '',
                password: '',
                cargo: '',
            });
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
                setMensaje(error.response.data.error);
            } else {
                setMensaje('Error al crear el usuario');
            }
        }
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">Registrar Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        placeholder="Apellido"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        placeholder="Usuario"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                    />
                    <div className="relative w-full">
                        <select
                            name="cargo"
                            value={formData.cargo}
                            onChange={handleSelectChange}
                            defaultValue=""
                            className="w-full px-4 py-3 text-gray-700 bg-white rounded-lg shadow-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200 cursor-pointer"
                            required
                        >
                            <option value="" disabled hidden>
                                Selecciona un cargo
                            </option>
                            <option value="Gerente_Ventas">Gerente de Ventas</option>
                            <option value="Cajero">Cajero</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M5.292 7.707a1 1 0 011.415 0L10 11.004l3.293-3.297a1 1 0 011.414 1.415l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.415z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 font-semibold text-lg rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 ease-in-out"
                    >
                        Crear Usuario
                    </button>
                    <Link to="/login">
                    <button className="w-full py-3 mt-4 font-semibold text-lg rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 ease-in-out">
                        Ir al Login
                    </button>
                    </Link>
                </form>
            </div>

            {/* Modal para el mensaje de éxito */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md text-center shadow-2xl animate-bounce">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">¡Usuario Creado Exitosamente!</h2>
                        <p className="text-gray-700 mb-6">{mensaje}</p>
                        <button
                            onClick={() => setShowModal(false)}
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

export default CrearUsuario;
