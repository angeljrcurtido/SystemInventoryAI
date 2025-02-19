import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ListaProducto from '../Producto/ListaProducto';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';
import HistorialCompras from './HistorialCompras';
import ListaProveedor from '../Proveedores/ListaProveedor';

Modal.setAppElement('#root');

interface Producto {
    _id: string;
    nombre: string;
    precioCompra: number;
}

interface Compra {
    nombreProveedor: string;
    rucProveedor: string;
    telefonoProveedor: string;
    productos: { idProducto: string; nombreProducto: string; cantidadComprada: number; precioCompra: number }[];
    fechaCompra: string;
}

const Compras = () => {
    const advertenciaTitulo = 'Está seguro de realizar esta compra?'
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [isProveedorModalOpen, setIsProveedorModalOpen] = useState(false);
    const [advertenciaVisible, setAdvertenciaVisible] = useState(false);
    const [advertirError, setAdvertirError] = useState(false);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [compra, setCompra] = useState<Compra>({
        nombreProveedor: '',
        rucProveedor: '',
        telefonoProveedor: '',
        productos: [],
        fechaCompra: new Date().toISOString().slice(0, 10), // Fecha actual
    });

    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);

    // Obtener la lista de productos desde el servidor
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/productos');
                setProductos(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProductos();
    }, []);

    // Manejar el cambio de campos de texto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    const handleCloseAdvertencia = () => {
        setAdvertenciaVisible(false);
    };

    // Manejar el cambio de productos seleccionados
    const handleProductoChange = (index: number, field: string, value: string | number) => {
        const nuevosProductos = [...compra.productos];
        nuevosProductos[index] = { ...nuevosProductos[index], [field]: value };
        setCompra({ ...compra, productos: nuevosProductos });
    };

    // Abrir modal para seleccionar productos
    const abrirModalProductos = () => {
        setIsProductoModalOpen(true);
    };

    // Maneja la selección del proveedor
    const handleSelectProveedor = (proveedorSeleccionado: any) => {
        console.log('Proveedor seleccionado:', proveedorSeleccionado);
        setCompra((prevCompra) => ({
            ...prevCompra,
            nombreProveedor: proveedorSeleccionado.nombreProveedor,
            rucProveedor: proveedorSeleccionado.rucProveedor,
            telefonoProveedor: proveedorSeleccionado.telefonoProveedor,
        }));
        setIsProveedorModalOpen(false);
    };

    // Cerrar modal
    const cerrarModal = () => {
        setIsProductoModalOpen(false);
    };

    // Añadir productos seleccionados con cantidad 1
    const seleccionarProducto = (productoId: string, nombreProducto: string, precioCompra: number) => {
        const productoYaSeleccionado = compra.productos.some(
            (producto) => producto.idProducto === productoId
        );

        if (!productoYaSeleccionado) {
            const nuevoProducto = { idProducto: productoId, nombreProducto, cantidadComprada: 1, precioCompra };
            setCompra({
                ...compra,
                productos: [...compra.productos, nuevoProducto],
            });
        }
        cerrarModal(); // Cerrar modal después de seleccionar un producto
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setCompra({
            nombreProveedor: '',
            rucProveedor: '',
            telefonoProveedor: '',
            productos: [],
            fechaCompra: new Date().toISOString().slice(0, 10), // Fecha actual
        });
    };

    // Función para confirmar la advertencia y proceder con la compra
    const handleConfirmarAdvertencia = async () => {
        setAdvertenciaVisible(false);
        try {
            const response = await axios.post('http://127.0.0.1:5000/compras', compra);
            if (response.status === 201) {
                console.log('Compra creada con éxito:', response.data);
                resetForm(); // Restablecer el formulario después de un envío exitoso
            }
        } catch (error) {
            setAdvertirError(true);
            console.error('Error al crear la compra:', error);
        }
    };

    // Mostrar el modal de advertencia
    const mostrarAdvertencia = (e: React.FormEvent) => {
        e.preventDefault();
        setAdvertenciaVisible(true); // Mostrar el modal de confirmación antes de enviar
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <form onSubmit={mostrarAdvertencia} className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
                <h3 className="text-2xl font-semibold mb-6 text-center">Realizar una compra</h3>
                <div className='flex gap-4 justify-center'>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre del proveedor:</label>
                        <input
                            type="text"
                            required={true}
                            name="nombreProveedor"
                            value={compra.nombreProveedor}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">RUC del proveedor:</label>
                        <input
                            type="text"
                            required={true}
                            name="rucProveedor"
                            value={compra.rucProveedor}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Teléfono del proveedor:</label>
                        <input
                            type="text"
                            required={true}
                            name="telefonoProveedor"
                            value={compra.telefonoProveedor}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button
                        type="button"
                        onClick={() => setIsProveedorModalOpen(true)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Seleccionar Proveedor
                    </button>
                </div>

                <div className='flex justify-center'>
                    <button
                        type="button"
                        onClick={abrirModalProductos}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Seleccionar productos
                    </button>
                </div>
                <h4 className="text-xl font-semibold mb-4 mt-6 text-center">Productos seleccionados</h4>
                <div className="overflow-y-auto max-h-[150px] text-xs"> 
                    {compra.productos.map((producto, index) => (
                        <div key={index} className="mb-4 flex gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Producto:</label>
                                <input
                                    type="text"
                                    value={productos.find((p) => p._id === producto.idProducto)?.nombre || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Cantidad comprada:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={producto.cantidadComprada}
                                        onChange={(e) =>
                                            handleProductoChange(index, 'cantidadComprada', parseInt(e.target.value))
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Precio de compra:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={producto.precioCompra}
                                        onChange={(e) =>
                                            handleProductoChange(index, 'precioCompra', parseFloat(e.target.value))
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <label className="block text-gray-700 mb-2">Fecha de compra:</label>
                    <input
                        type="date"
                        name="fechaCompra"
                        value={compra.fechaCompra}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className='flex justify-center gap-5'>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Realizar compra
                    </button>
                    <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        type="button"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Historial Compras
                    </button>
                </div>
            </form>

            {/* Modal para seleccionar productos */}
            <Modal
                isOpen={isProductoModalOpen}
                onRequestClose={() => setIsProductoModalOpen(false)}
                contentLabel="Seleccionar Productos"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <ListaProducto
                    isShow={true}
                    onSelect={(nombreProducto: string, idProducto?: any , precioCompra?: any) => seleccionarProducto(idProducto, nombreProducto, precioCompra)}
                />
            </Modal>

            {/* Modal Historial Compras */}
            <Modal
                isOpen={isHistoryModalOpen}
                onRequestClose={() => setIsHistoryModalOpen(false)}
                contentLabel="Historial de Compras"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <HistorialCompras/>
            </Modal>

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
                    onSelect={(proveedor: any) => handleSelectProveedor(proveedor)}
                />
            </Modal>

            {/* Modal de Advertencia */}
            <ModalAdvertencia
                isVisible={advertenciaVisible}
                title={advertenciaTitulo}
                onClose={handleCloseAdvertencia}
                onAccept={handleConfirmarAdvertencia}
                isAccept={true}
            />
            {/* Modal de Advertencia */}
            <ModalAdvertencia
                isVisible={advertirError}
                title={"Error al procesar la compra"}
                onClose={()=> setAdvertirError(false)}
                //onAccept={handleConfirmarAdvertencia}
                //isAccept={true}
                secondbtnText = {"Cerrar"}
            />

        </div>
    );
};

export default Compras;
