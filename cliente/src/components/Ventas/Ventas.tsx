import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BlobProvider } from '@react-pdf/renderer';
import TicketPDF from './Ticket';
import ListaProducto from '../Producto/ListaProducto';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';
import HistorialVentas from './HistorialVentas';

Modal.setAppElement('#root');
const Ventas = () => {
    const advertenciaTitulo = 'Está seguro de realizar esta venta?'
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [showModalTicket, setShowModalTicket] = useState(false);
    const [ventaRealizada, setVentaRealizada] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [advertenciaVisible, setAdvertenciaVisible] = useState(false);
    const [isCalculadoraModalOpen, setIsCalculadoraModalOpen] = useState(false); // Estado para el modal de calculadora
    const [productos, setProductos] = useState<any[]>([]);
    const [venta, setVenta] = useState<any>({
        //rucEmpresa: '',
        //direccionEmpresa: '',
        //timbradoEmpresa: '',
        nombreCliente: '',
        //nombreEmpresa: '',
        rucCliente: '',
        telefonoCliente: '',
        productos: [],
        fechaVenta: new Date().toISOString().slice(0, 10), // Fecha actual
    });

    const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
    const [dineroCliente, setDineroCliente] = useState<number>(0); // Estado para el dinero del cliente
    const [cambio, setCambio] = useState<number>(0); // Estado para el cambio calculado

    // Calcular el total de ventas
    const totalVentas = venta.productos.reduce(

        (total: any, producto: any) => total + Number(producto.cantidadVendida) * Number(producto.precioVenta),
        0
    );

    // Recalcular el cambio cuando dineroCliente o totalVentas cambien
    useEffect(() => {
        console.log("totalVentas", totalVentas)
        setCambio(dineroCliente - totalVentas)
    }, [dineroCliente, totalVentas]);

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

    // Obtener la empresa activa más reciente y autocompletar los campos
    useEffect(() => {
        const fetchEmpresaActiva = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/empresas/activas');
                const empresa = response.data;
                if (empresa) {
                    // Autocompletar los campos de la venta con los datos de la empresa
                    setVenta((prevVenta: any) => ({
                        ...prevVenta,
                        nombreEmpresa: empresa.nombreEmpresa,
                        rucEmpresa: empresa.rucEmpresa,
                        timbradoEmpresa: empresa.timbradoEmpresa,
                        direccionEmpresa: empresa.direccionEmpresa,
                    }));
                }
            } catch (error) {
                console.error('Error al obtener la empresa activa:', error);
            }
        };

        fetchEmpresaActiva();
    }, [ventaRealizada]);

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

    // Manejar el cambio de campos de texto
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setVenta({ ...venta, [name]: value });
    };

    const handleCloseAdvertencia = () => {
        setAdvertenciaVisible(false);
    };

    // Manejar el cambio de productos seleccionados
    const handleProductoChange = (index: number, field: string, value: string | number) => {
        const nuevosProductos = [...venta.productos];
        nuevosProductos[index] = { ...nuevosProductos[index], [field]: value };
        setVenta({ ...venta, productos: nuevosProductos });
    };

    // Abrir modal para seleccionar productos
    const abrirModalProductos = () => {
        setIsProductoModalOpen(true);
    };

    // Cerrar modal
    const cerrarModal = () => {
        setIsProductoModalOpen(false);
    };
    const abrirModalCalculadora = () => {
        setIsCalculadoraModalOpen(true);
    };

    const cerrarModalCalculadora = () => {
        setIsCalculadoraModalOpen(false);
    };

    const handleConfirmarVenta = () => {
        cerrarModalCalculadora();
        setAdvertenciaVisible(true);
    };

    const seleccionarProducto = (productoId: string, nombreProducto: string, precioVenta: number) => {
        const productoYaSeleccionado = venta.productos.some(
            (producto: any) => producto.idProducto === productoId
        );

        if (!productoYaSeleccionado) {
            const nuevoProducto = { idProducto: productoId, nombreProducto, cantidadVendida: 1, precioVenta };
            setVenta({
                ...venta,
                productos: [...venta.productos, nuevoProducto],
            });
        }
        cerrarModal(); // Cerrar modal después de seleccionar un producto
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setVenta({
            //rucEmpresa: '',
            //direccionEmpresa: '',
            //timbradoEmpresa: '',
            nombreCliente: '',
            //nombreEmpresa: '',
            rucCliente: '',
            telefonoCliente: '',
            productos: [],
            fechaVenta: new Date().toISOString().slice(0, 10),
        });
    };

    // Función para seleccionar un cliente
    const seleccionarCliente = (cliente: any) => {
        setVenta((prevVenta: any) => ({
            ...prevVenta,
            nombreCliente: cliente.nombreCliente,
            rucCliente: cliente.rucCliente,
            telefonoCliente: cliente.telefonoCliente,
        }));
        setIsModalOpen(false); // Cerrar modal después de seleccionar
    };

    // Función para confirmar la venta y almacenar la venta realizada
    const handleConfirmarAdvertencia = async () => {
        setAdvertenciaVisible(false);
        try {
            const response = await axios.post('http://127.0.0.1:5000/ventas', venta);
            if (response.status === 201) {
                setVentaRealizada(response.data); // Guardar los datos de la venta realizada
                console.log("venta", response.data)
                setShowModalTicket(true); // Mostrar el modal del ticket
                resetForm(); // Restablecer el formulario después de un envío exitoso

            }
        } catch (error) {
            console.error('Error al crear la venta:', error);
        }
    };

    const printDocument = (blob: any) => {
        const url = URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = function () {
            iframe?.contentWindow?.print();
        }
    }

    // Mostrar el modal de advertencia
    const mostrarAdvertencia = (e: React.FormEvent) => {
        e.preventDefault();
        setAdvertenciaVisible(true); // Mostrar el modal de confirmación antes de enviar
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
            <form onSubmit={mostrarAdvertencia} className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
                <h3 className="text-2xl font-semibold mb-6 text-center">Realizar una venta</h3>
                <fieldset className="border border-solid border-gray-300 p-3 flex gap-4">
                    <legend className="text-gray-500 text-sm font-bold">Datos Empresa:</legend>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Ruc de Empresa:</label>
                        <input
                            type="text"
                            name="rucEmpresa"
                            value={venta.rucEmpresa}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Dirección de Empresa:</label>
                        <input
                            type="text"
                            name="direccionEmpresa"
                            value={venta.direccionEmpresa}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Timbrado de Empresa:</label>
                        <input
                            type="text"
                            name="timbradoEmpresa"
                            value={venta.timbradoEmpresa}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre de la Empresa:</label>
                        <input
                            type="text"
                            name="nombreEmpresa"
                            value={venta.nombreEmpresa}
                            onChange={handleInputChange}
                            required
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </fieldset>
                <fieldset className="border border-solid border-gray-300 p-3 flex gap-4">
                    <legend className="text-gray-500 text-sm font-bold">Datos Cliente:</legend>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombre del Cliente:</label>
                        <input
                            type="text"
                            name="nombreCliente"
                            value={venta.nombreCliente}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">RUC del Cliente:</label>
                        <input
                            type="text"
                            name="rucCliente"
                            value={venta.rucCliente}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 text-sm">Teléfono del Cliente:</label>
                        <input
                            type="text"
                            name="telefonoCliente"
                            value={venta.telefonoCliente}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="mt-6 mb-6 bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Seleccionar
                    </button>
                </fieldset>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2 text-sm">Fecha de venta:</label>
                    <input
                        type="date"
                        name="fechaventa"
                        value={venta.fechaVenta}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
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
                    {venta.productos.map((producto: any, index: any) => (
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
                                    <label className="block text-gray-700 mb-2">Cantidad ventada:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={producto.cantidadVendida}
                                        onChange={(e) =>
                                            handleProductoChange(index, 'cantidadVendida', parseInt(e.target.value))
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2">Precio de venta:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={producto.precioVenta}
                                        onChange={(e) =>
                                            handleProductoChange(index, 'precioVenta', parseFloat(e.target.value))
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex justify-center gap-5'>
                    <button
                        type="button"
                        onClick={abrirModalCalculadora}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Abrir Calculadora
                    </button>

                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Realizar venta
                    </button>
                    <button
                        onClick={() => setIsHistoryModalOpen(true)}
                        type="button"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Historial ventas
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
                    onSelect={(nombreProducto: string, idProducto?: any, precioventa?: any) => seleccionarProducto(idProducto, nombreProducto, precioventa)}
                />
            </Modal>

            {/* Modal Historial ventas */}
            <Modal
                isOpen={isHistoryModalOpen}
                onRequestClose={() => setIsHistoryModalOpen(false)}
                contentLabel="Seleccionar Productos"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <HistorialVentas />
            </Modal>


            {/* Modal Calculadora */}
            <Modal
                isOpen={isCalculadoraModalOpen}
                onRequestClose={cerrarModalCalculadora}
                contentLabel="Calculadora"
                className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto"
                overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
            >
                <h3 className="text-xl font-semibold mb-4">Calculadora</h3>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Total de ventas:</label>
                    <input
                        type="number"
                        value={totalVentas}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Dinero del cliente:</label>
                    <input
                        type="number"
                        value={dineroCliente}
                        onChange={(e) => setDineroCliente(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Cambio:</label>
                    <input
                        type="number"
                        value={cambio}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleConfirmarVenta}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Confirmar Venta
                    </button>
                </div>
            </Modal>

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
                                    <th className='px-4 py-2'> Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((cliente: any, index: number) => (
                                    <tr key={index} className="border-t">
                                        <td className="px-4 py-2">{cliente.nombreCliente}</td>
                                        <td className="px-4 py-2">{cliente.rucCliente}</td>
                                        <td className="px-4 py-2">{cliente.telefonoCliente}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => seleccionarCliente(cliente)}
                                                className="bg-green-800 text-white px-4 py-2 rounded-md"
                                            >
                                                Seleccionar
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

            {
                showModalTicket && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Ticket de Venta</h2>
                            <div style={{ width: '100%', height: '100%' }}>
                                <BlobProvider document={<TicketPDF venta={ventaRealizada} />}>
                                    {({ blob, url, loading, error }) => {
                                        if (blob) {
                                            return (
                                                <div>
                                                    {url && (
                                                        <iframe src={url ?? ''} style={{ width: '100%', height: '100%' }} />
                                                    )}
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            className="bg-green-500 text-white p-1 rounded mt-4"
                                                            onClick={() => printDocument(blob)}
                                                        >
                                                            Imprimir
                                                        </button>
                                                        <button
                                                            className="bg-green-500 text-white p-1 rounded mt-4"
                                                            onClick={() => setShowModalTicket(false)}
                                                        >
                                                            Cerrar
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        } else if (loading) {
                                            return <div>Cargando...</div>;
                                        } else if (error) {
                                            return <div>Error al generar el PDF</div>;
                                        }
                                    }}
                                </BlobProvider>
                            </div>

                        </div>
                    </div>
                )
            }

            {/* Modal de Advertencia */}
            <ModalAdvertencia
                isVisible={advertenciaVisible}
                title={advertenciaTitulo}
                onClose={handleCloseAdvertencia}
                onAccept={handleConfirmarAdvertencia}
                isAccept={true}
            />
        </div>
    );
};

export default Ventas;
