import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const LoginUsuario: React.FC = () => {
    const [formData, setFormData] = useState({
        usuario: '',
        password: '',
    });
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    // Manejar el cambio en los campos del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);

        try {
            const response = await axios.post('http://127.0.0.1:5000/login', formData);

            // Almacenar el cargo en localStorage si el inicio de sesión es exitoso
            if (response.data.cargo) {
                localStorage.setItem('cargo', response.data.cargo);
            }

            setMensaje(response.data.message);
            setShowModal(true); // Mostrar el modal en caso de éxito

            // Resetear el formulario en caso de éxito
            setFormData({
                usuario: '',
                password: '',
            });

            // Redirigir al inicio después de mostrar el mensaje de éxito
            setTimeout(() => {
                setShowModal(false); // Cerrar el modal
                navigate("/"); // Redirigir a la página inicial
            }, 2000); // Esperar 2 segundos antes de redirigir (puedes ajustar el tiempo según tu preferencia)
        } catch (error: any) {
            setMensaje(error.response?.data?.error || 'Error al iniciar sesión');
            setShowModal(true);
        }
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="text"
                        name="usuario"
                        value={formData.usuario}
                        onChange={handleChange}
                        placeholder="Usuario"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Contraseña"
                        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 font-semibold text-lg rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl transition-all duration-300 ease-in-out"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>

            {/* Modal de Notificación */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md text-center shadow-2xl animate-fade-in">
                        <h2
                            className={`text-2xl font-bold mb-4 ${
                                mensaje === 'Inicio de sesión exitoso' ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {mensaje === 'Inicio de sesión exitoso' ? '¡Bienvenido!' : 'Error de Inicio de Sesión'}
                        </h2>
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

export default LoginUsuario;
