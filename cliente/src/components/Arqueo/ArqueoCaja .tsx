import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

Modal.setAppElement('#root');
const ArqueoCaja: React.FC = () => {
  const [arqueos, setArqueos] = useState([]);
  const [showModalLista, setShowModalLista] = useState(false);
  const [showModalRegistro, setShowModalRegistro] = useState(false);
  const [showModalCerrar, setShowModalCerrar] = useState(false);
  const [advertenciaVisible, setAdvertenciaVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentArqueo, setCurrentArqueo] = useState<any>(null);
  const [saldoInicial, setSaldoInicial] = useState('');
  const [usuarioResponsable, setUsuarioResponsable] = useState("");
  const [transaccion, setTransaccion] = useState({ tipo: '', monto: '', descripcion: '' });
  const [detallesEfectivo, setDetallesEfectivo] = useState<any>({ monedas: 0, billetes: 0, tarjetas: 0, otros: 0 });

  // Cargar arqueos al montar el componente
  useEffect(() => {
    fetchArqueos();
  }, []);

  const fetchArqueos = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/arqueos_caja');
      setArqueos(res.data);
    } catch (error) {
      console.error('Error fetching arqueos:', error);
    }
  };

  // Abrir un nuevo arqueo
  const abrirArqueo = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/arqueos_caja', {
        saldo_inicial: saldoInicial,
        usuario_responsable: usuarioResponsable,  // Cambiar a tu lógica de autenticación
      });
      setAdvertenciaVisible(true);
      setUsuarioResponsable('');
      setSaldoInicial('');
      setCurrentArqueo(res.data);
      fetchArqueos();  // Actualiza la lista de arqueos
    } catch (error) {
      console.error('Error al abrir el arqueo:', error);
    }
  };

  // Registrar una transacción
  const registrarTransaccion = async () => {
    try {
      const res = await axios.post(`http://127.0.0.1:5000/arqueos_caja/${currentArqueo._id}/transacciones`, transaccion);
      console.log('Transacción registrada:', res.data);
    } catch (error) {
      console.error('Error al registrar transacción:', error);
    }
  };

  // Cerrar el arqueo
  const cerrarArqueo = async () => {
    try {
      const detallesEfectivoConvertidos = {
        monedas: Number(detallesEfectivo.monedas),
        billetes: Number(detallesEfectivo.billetes),
        tarjetas: Number(detallesEfectivo.tarjetas),
        otros: Number(detallesEfectivo.otros),
      };

      const res = await axios.put(`http://127.0.0.1:5000/arqueos_caja/${currentArqueo._id}/cerrar`, {
        detalles_efectivo: detallesEfectivoConvertidos,
      });
      
      console.log('Arqueo cerrado:', res.data);
      setShowModalCerrar(false);
      setShowModalLista(false)
      fetchArqueos(); // Actualiza la lista de arqueos
    } catch (error:any) {
      const messageError = error.response.data.error + "Saldo sistema:" + error.response.data.saldo_sistema
      setErrorMessage(messageError);
      console.error('Error al cerrar arqueo:', error.response.data);
    }
  };

  return (
    <div className="items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded">
        <h1 className='text-center font-bold'>Arqueo de Caja</h1>

        {/* Formulario para abrir un nuevo arqueo */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Abrir Arqueo</h2>
          <div className='flex gap-4'>
          <input
            type="text"
            className="w-[50%] p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Usuario Responsable"
            value={usuarioResponsable}
            onChange={(e) => setUsuarioResponsable(e.target.value)}
          />
          <input
            type="number"
            className="w-[50%] p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Saldo Inicial"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(e.target.value)}
          />
          </div>
          <button
            onClick={abrirArqueo}
            className="w-[20%] bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Abrir Arqueo
          </button>
        </div>

        <div className='flex gap-4 justify-center'>
          <button onClick={() => setShowModalLista(true)} className="w-[20%] bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Lista arqueos
          </button>
        </div>

        {/* Listar arqueos abiertos */}
        <Modal
          isOpen={showModalLista}
          onRequestClose={() => setShowModalLista(false)}
          contentLabel="Seleccionar Productos"
          className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
          overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >
          <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Arqueos</h2>
            <ul className="space-y-4">
              {arqueos.map((arqueo: any) => (
                <li key={arqueo._id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">{new Date(arqueo.fecha_inicio).toLocaleString()}</p>
                    <p className={`text-sm ${arqueo.estado === 'abierto' ? 'text-green-500' : 'text-red-500'}`}>
                      {arqueo.estado === 'abierto' ? 'Abierto' : 'Cerrado'}
                    </p>
                  </div>
                  {arqueo.estado === 'abierto' && (
                    <div className='flex gap-4'>
                      <button
                        onClick={() => {
                          setCurrentArqueo(arqueo);
                          setShowModalRegistro(true);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        Seleccionar
                      </button>

                      <button onClick={()=>{setShowModalCerrar(true); setCurrentArqueo(arqueo)}} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
                        Cerrar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
        <Modal
          isOpen={showModalRegistro}
          onRequestClose={() => setShowModalRegistro(false)}
          contentLabel="Seleccionar Productos"
          className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
          overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        >

          {currentArqueo && currentArqueo.estado === 'abierto' && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Registrar Transacción</h2>

              <div className="mb-4">
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-600 mb-2">Tipo de Transacción</label>
                <select
                  id="tipo"
                  onChange={(e) => setTransaccion({ ...transaccion, tipo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="egreso">Egreso</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="monto" className="block text-sm font-medium text-gray-600 mb-2">Monto</label>
                <input
                  type="number"
                  id="monto"
                  placeholder="Monto"
                  onChange={(e) => setTransaccion({ ...transaccion, monto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-600 mb-2">Descripción</label>
                <input
                  type="text"
                  id="descripcion"
                  placeholder="Descripción"
                  onChange={(e) => setTransaccion({ ...transaccion, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={registrarTransaccion}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              >
                Registrar Transacción
              </button>
            </div>
          )}

        </Modal>

        <Modal
          isOpen={showModalCerrar}
          onRequestClose={() => setShowModalCerrar(false)}
          contentLabel="Seleccionar Productos"
          className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-3xl mx-auto max-h-[650px] overflow-y-auto"
          overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
        > 
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cerrar Arqueo</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="monedas" className="block text-sm font-medium text-gray-600 mb-1">Monedas</label>
                <input
                  type="number"
                  id="monedas"
                  placeholder="Monedas"
                  onChange={(e) => setDetallesEfectivo({ ...detallesEfectivo, monedas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="billetes" className="block text-sm font-medium text-gray-600 mb-1">Billetes</label>
                <input
                  type="number"
                  id="billetes"
                  placeholder="Billetes"
                  onChange={(e) => setDetallesEfectivo({ ...detallesEfectivo, billetes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="tarjetas" className="block text-sm font-medium text-gray-600 mb-1">Tarjetas</label>
                <input
                  type="number"
                  id="tarjetas"
                  placeholder="Tarjetas"
                  onChange={(e) => setDetallesEfectivo({ ...detallesEfectivo, tarjetas: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="otros" className="block text-sm font-medium text-gray-600 mb-1">Otros</label>
                <input
                  type="number"
                  id="otros"
                  placeholder="Otros"
                  onChange={(e) => setDetallesEfectivo({ ...detallesEfectivo, otros: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={cerrarArqueo}
              className="w-full mt-6 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
            >
              Cerrar Arqueo
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </div>
        </Modal>
        
            {/* Modal de Advertencia */}
            <ModalAdvertencia
                isVisible={advertenciaVisible}
                title={"Caja Abierta"}
                onClose={()=>setAdvertenciaVisible(false)}
                secondbtnText='Cerrar'
                //onAccept={handleConfirmarAdvertencia}
                //isAccept={true}
            />

      </div>
    </div>
  );
};

export default ArqueoCaja;
