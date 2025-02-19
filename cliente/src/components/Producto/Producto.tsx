import React, { useState } from 'react';
import ListaProveedor from '../Proveedores/ListaProveedor';
import ListaCategoria from '../Categoria/ListaCategorias';
import ListaProducto from './ListaProducto';
import axios from 'axios';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';

Modal.setAppElement('#root');

const Producto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        unidadMedida: '',
        precioVenta: '',
        precioCompra: '',
        CantidadActual: '',
        CantidadMinima: '',
        Proveedor: '',
        Categoria: '',
        descripcion: '',
        Iva: '',
    });
    const [advertirError, setAdvertirError] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [isProveedorModalOpen, setIsProveedorModalOpen] = useState(false);
    const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    // Maneja el cambio de valores en el formulario
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja la selección del proveedor
    const handleSelectProveedor = (nombreProveedor: string) => {
        setFormData({ ...formData, Proveedor: nombreProveedor });
        setIsProveedorModalOpen(false);
    };

    // Maneja la selección de la categoría
    const handleSelectCategoria = (nombreCategoria: string) => {
        setFormData({ ...formData, Categoria: nombreCategoria });
        setIsCategoriaModalOpen(false);
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Convierte los valores numéricos correctamente antes de enviar
            const data = {
                ...formData,
                precioVenta: Number(formData.precioVenta),
                precioCompra: Number(formData.precioCompra),
                CantidadActual: Number(formData.CantidadActual),
                CantidadMinima: Number(formData.CantidadMinima),
            };

            const response = await axios.post('http://127.0.0.1:5000/productos', data);
           
            setAdvertirError(true);
            setTitleError('Producto creado exitosamente');
            console.log(response.data);
            setFormData({
                nombre: '',
                unidadMedida: '',
                precioVenta: '',
                precioCompra: '',
                CantidadActual: '',
                CantidadMinima: '',
                Proveedor: '',
                Categoria: '',
                descripcion: '',
                Iva: '',
            });
        } catch (error) {
            setAdvertirError(true);
            setTitleError('Error al crear el producto');
            console.error(error);
        }
    };

    return (
        <div className="items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Producto</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700">Nombre del Producto</label>
                        <input
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Unidad de Medida</label>
                        <select
                            name="unidadMedida"
                            value={formData.unidadMedida}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>Seleccione una unidad</option>
                            <option value="Unidad">Unidad</option>
                            <option value="Litros">Litros</option>
                            <option value="Kilogramos">Kilogramos</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Precio de Venta</label>
                        <input
                            name="precioVenta"
                            type="number"
                            value={formData.precioVenta}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Precio de Compra</label>
                        <input
                            name="precioCompra"
                            type="number"
                            value={formData.precioCompra}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Cantidad Actual</label>
                        <input
                            name="CantidadActual"
                            type="number"
                            value={formData.CantidadActual}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Cantidad Mínima</label>
                        <input
                            name="CantidadMinima"
                            type="number"
                            value={formData.CantidadMinima}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700">Proveedor</label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setIsProveedorModalOpen(true)}
                                className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 mr-2"
                            >
                                Agregar Proveedor
                            </button>
                            <input
                                name="Proveedor"
                                type="text"
                                value={formData.Proveedor}
                                readOnly
                                className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Categoría</label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setIsCategoriaModalOpen(true)}
                                className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 mr-2"
                            >
                                Agregar Categoría
                            </button>
                            <input
                                name="Categoria"
                                type="text"
                                value={formData.Categoria}
                                readOnly
                                className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">IVA</label>
                        <select
                            name="Iva"
                            value={formData.Iva}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Seleccione el IVA
                            </option>
                            <option value="5%">5%</option>
                            <option value="10%">10%</option>
                        </select>
                    </div>

                    <div className="col-span-3">
                        <label className="block text-gray-700">Descripción (opcional)</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Modal para seleccionar proveedor */}
                    <Modal
                        isOpen={isProveedorModalOpen}
                        onRequestClose={() => setIsProveedorModalOpen(false)}
                        contentLabel="Seleccionar Proveedor"
                        className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
                    >
                        <ListaProveedor
                            isShow={true}
                            estado="activo"
                            onSelect={(nombreProveedor: any) => handleSelectProveedor(nombreProveedor.nombreProveedor)}
                        />
                    </Modal>

                    {/* Modal para seleccionar categoría */}
                    <Modal
                        isOpen={isCategoriaModalOpen}
                        onRequestClose={() => setIsCategoriaModalOpen(false)}
                        contentLabel="Seleccionar Categoría"
                        className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
                    >
                        <ListaCategoria
                            isShow={true}
                            estado="activo"
                            onSelect={(nombreCategoria: string) => handleSelectCategoria(nombreCategoria)}
                        />
                    </Modal>

                    <div className="col-span-3 flex justify-center mt-4 gap-4">
                        <button
                            type="submit"
                            className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                            disabled={
                                !formData.nombre ||
                                !formData.unidadMedida ||
                                !formData.precioVenta ||
                                !formData.precioCompra ||
                                !formData.CantidadActual ||
                                !formData.CantidadMinima ||
                                !formData.Proveedor ||
                                !formData.Categoria ||
                                !formData.Iva
                            }
                        >
                            Crear Producto
                        </button>
                        <button
                            type='button'
                            className="py-2 px-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                            onClick={() => setIsProductoModalOpen(true)}>Lista Productos</button>
                    </div>
                    <Modal
                        isOpen={isProductoModalOpen}
                        onRequestClose={() => setIsProductoModalOpen(false)}
                        contentLabel="Seleccionar Categoría"
                        className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
                    >
                        <ListaProducto  />
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

export default Producto;