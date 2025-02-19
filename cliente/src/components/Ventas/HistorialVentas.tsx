import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ModalAdvertencia from '../utils/ModalAdvertencia';
import { BlobProvider } from '@react-pdf/renderer';
import TicketPDF from './Ticket';

interface Producto {
  cantidadComprada: number;
  nombreProducto: string;
  precioCompra: number;
}


const HistorialVentas: React.FC = () => {
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [advertenciaVisible, setAdvertenciaVisible] = useState(false);
  const advertenciaTitulo = 'Está seguro de realizar esta anulación?';
  const [compras, setCompras] = useState<any[]>([]);
  const [showModalTicket, setShowModalTicket] = useState(false);
  const [ventaRealizada, setVentaRealizada] = useState<any | null>(null);
  const [productosModal, setProductosModal] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState<string | null>(null); // Estado para la compra a anular

  // Obtener las compras desde el servidor
  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/ventas');
        setCompras(response.data);
      } catch (error) {
        console.error('Error al obtener compras:', error);
      }
    };

    fetchCompras();
  }, []);

  // Función para obtener los datos de una venta y mostrar el ticket en el modal
  const reImprimirTicket = async (ventaId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/ventas/${ventaId}`);
      setVentaRealizada(response.data); // Guardar los datos de la venta obtenidos
      setShowModalTicket(true); // Mostrar el modal del ticket
    } catch (error) {
      console.error('Error al obtener la venta:', error);
      setAdvertirError(true);
      setTitleError('Error al obtener la venta');
    }
  };

  // Función para abrir el modal y mostrar los productos
  const verDetalles = (productos: Producto[]) => {
    setProductosModal(productos);
    setIsModalOpen(true);
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

  // Cerrar el modal
  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  // Cerrar el ModalAdvertencia sin anular la compra
  const handleCloseAdvertencia = () => {
    setAdvertenciaVisible(false);
    setCompraSeleccionada(null); // Limpiar la compra seleccionada
  };

  // Confirmar la anulación de la compra
  const handleConfirmarAdvertencia = () => {
    if (compraSeleccionada) {
      anularCompra(compraSeleccionada); // Llamar a la función de anulación con la compra seleccionada
    }
    handleCloseAdvertencia(); // Cerrar el modal de advertencia
  };

  // Función para anular una compra
  const anularCompra = async (compraId: string) => {
    try {
      await axios.put(`http://127.0.0.1:5000/ventas/anular/${compraId}`);
      setAdvertirError(true);
      setTitleError('Compra anulada exitosamente');
      // Actualizar el estado de la compra a "anulado" en el estado local
      setCompras((prevCompras) =>
        prevCompras.map((compra) =>
          compra._id === compraId ? { ...compra, estado: 'anulado' } : compra
        )
      );
    } catch (error) {
      console.error('Error al anular la compra:', error);
      setAdvertirError(true);
      setTitleError('Error al anular la compra');
    }
  };


  // Abrir el modal de advertencia antes de anular la compra
  const confirmarAnulacion = (compraId: string) => {
    setCompraSeleccionada(compraId); // Guardar el ID de la compra seleccionada
    setAdvertenciaVisible(true); // Mostrar el modal de advertencia
  };

  // Calcular el total de la compra sumando los precios de todos los productos
  const totalCompra = productosModal.reduce(
    (total, producto) => total + producto.precioVenta * producto.cantidadVendida,
    0
  );

  return (
    <div className="items-center justify-center min-h-screen p-6 w-full">
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Ventas</h1>
      <div className="overflow-x-auto max-h-[600px]">
        <table className="table-auto w-full bg-white rounded-lg shadow-lg text-xs">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">N°</th>
              <th className="px-4 py-2">Factura N°</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Fecha de Venta</th>
              <th className="px-4 py-2">Nombre Cliente</th>
              <th className="px-4 py-2">RUC Cliente</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra, index) => (
              <tr key={compra._id} className="bg-gray-50 text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{compra._id.slice(-4)}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${compra.estado === 'activo'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                      }`}
                  >
                    {compra.estado}
                  </span>
                </td>
                <td className="border px-4 py-2">{compra.fechaVenta}</td>
                <td className="border px-4 py-2">{compra.nombreCliente}</td>
                <td className="border px-4 py-2">{compra.rucCliente}</td>

                <td className="border px-4 py-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => verDetalles(compra.productos)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Detalles
                    </button>
                    <button
                      onClick={() => reImprimirTicket(compra._id)} // Llamada a la función con el ID de la compra
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Re-Imprimir Ticket
                    </button>
                    {compra.estado === 'activo' && ( // Solo mostrar el botón "Anular" si el estado es activo
                      <button
                        onClick={() => confirmarAnulacion(compra._id)} // Abrir el modal de advertencia
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Anular
                      </button>


                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para mostrar detalles de productos */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cerrarModal}
        contentLabel="Detalles de Productos"
        className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">Detalles de Productos</h2>
        <table className="table-auto w-full bg-white rounded-lg shadow-lg text-xs">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">Nombre Producto</th>
              <th className="px-4 py-2">Cantidad Comprada</th>
              <th className="px-4 py-2">Precio Compra</th>
              <th className="px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {productosModal.map((producto, index) => (
              <tr key={index} className="bg-gray-50 text-center">
                <td className="border px-4 py-2">{producto.nombreProducto}</td>
                <td className="border px-4 py-2">{producto.cantidadVendida}</td>
                <td className="border px-4 py-2">{producto.precioVenta.toLocaleString()} Gs</td>
                <td className="border px-4 py-2">
                  {(producto.precioVenta * producto.cantidadVendida).toLocaleString()} Gs
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mostrar el total de la compra */}
        <div className="text-right mt-4 text-xl font-bold">
          Total Compra: <span>{totalCompra.toLocaleString()} Gs</span>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={cerrarModal}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {
        showModalTicket && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Ticket de Compra</h2>
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

export default HistorialVentas;
