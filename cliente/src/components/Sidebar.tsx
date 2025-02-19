import { BsMenuButtonWide } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBox } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard Compras', icon: <BiCategoryAlt />, route: '/dashboardCompras' },
    { name: 'Dashboard Ventas', icon: <BiCategoryAlt />, route: '/' },
    { name: 'Productos', icon: <BiCategoryAlt />, route: '/crearproducto' },
    { name: 'Proveedores', icon: <FaBox />, route: '/crearproveedor' },
    { name: 'Categorías', icon: <BiCategoryAlt />, route: '/crearcategorias' },
    { name: 'Compras', icon: <FaMoneyBillTransfer />, route: '/crearcompra' },
    { name: 'Ventas', icon: <FaMoneyBillTransfer />, route: '/crearventa' },
    { name: 'Datos Empresa', icon: <FaMoneyBillTransfer />, route: '/creardatosempresa' },
    { name: 'Datos Cliente', icon: <FaMoneyBillTransfer />, route: '/creardatoscliente' },
    { name:'Arqueo Caja', icon: <FaMoneyBillTransfer />, route: '/arqueocaja' },
    { name:'Reportes', icon: <FaMoneyBillTransfer />, route: '/reportes' },
    { name:'Listado Usuario', icon: <FaMoneyBillTransfer />, route: '/listado-usuario' },
    { name:'Registro Usuario', icon: <FaMoneyBillTransfer />, route: '/registro-usuario' },
    { name:'Cerrar Sesión', icon: <FaMoneyBillTransfer />, route: '/cerrarsesión' }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-800 to-purple-800 p-6 shadow-lg overflow-y-auto">
      <h1 className="text-3xl flex items-center text-white font-bold mb-8">
        <BsMenuButtonWide className="mr-2" size={24} />
        <Link to="/">
          Menú
        </Link>
      </h1>
      <nav className="space-y-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className="flex items-center py-2 px-4 rounded-lg transition-colors duration-200 text-white hover:bg-purple-600 hover:shadow-md hover:scale-105 transform"
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
