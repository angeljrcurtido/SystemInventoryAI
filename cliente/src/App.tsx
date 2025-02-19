import './App.css'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Producto from './components/Producto/Producto'
import Sidebar from './components/Sidebar';
import CrearProveedor from './components/Proveedores/CrearProveedor';
import CrearCategoria from './components/Categoria/CrearCategoria';
import Compras from './components/Compras/Compras';
import HistorialCompras from './components/Compras/HistorialCompras';
import Dashboard from './components/Dashboard/Dasbhoard';
import Ventas from './components/Ventas/Ventas';
import DatosEmpresa from './components/DatosEmpresa/DatosEmpresa';
import DatosCliente from './components/DatosCliente/DatosCliente';
import ArqueoCaja from './components/Arqueo/ArqueoCaja ';
import Reportes from './components/Reportes/Reportes';
import DashboardVentas from './components/Dashboard/DashboardVentas';
import CrearUsuario from './components/Usuarios/CrearUsuario';
import LoginUsuario from './components/Usuarios/LoginUsuario';
import CerrarSesión from './components/Usuarios/CerrarSesión';
import ListadoUsuario from './components/Usuarios/ListadoUsuario';
import RequireAuth from './components/Usuarios/RequireAuth';


function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="w-64">
          <Sidebar />
        </div>
        <Routes>
          {/* Rutas accesibles solo para el Administrador */}
          <Route element={<RequireAuth allowedRoles={['Administrador']} />}>
            <Route path="/dashboardCompras" element={<Dashboard />} />
            <Route path="/crearproducto" element={<Producto />} />
            <Route path="/crearproveedor" element={<CrearProveedor />} />
            <Route path="/crearcategorias" element={<CrearCategoria />} />
            <Route path="/historialcompras" element={<HistorialCompras />} />
            <Route path="/arqueocaja" element={<ArqueoCaja />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path='/registro-usuario' element={<CrearUsuario/>}/>
            <Route path="/listado-usuario" element={<ListadoUsuario/>}/>
            <Route path="/creardatosempresa" element={<DatosEmpresa />} />
            <Route path="/creardatoscliente" element={<DatosCliente />} />
          </Route>

          {/* Rutas accesibles tanto para el Administrador como para el Cajero */}
          <Route element={<RequireAuth allowedRoles={['Administrador', 'Cajero']} />}>
            <Route path="/crearcompra" element={<Compras />} />
            <Route path="/crearventa" element={<Ventas />} />
          </Route>

          {/* Rutas accesibles a todos los usuarios */}
          <Route path="/" element={<DashboardVentas />} />
          <Route path="/login" element={<LoginUsuario />} />
          <Route path="/cerrarsesión" element={<CerrarSesión />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
