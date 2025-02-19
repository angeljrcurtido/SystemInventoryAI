import axios from 'axios';

const Reportes = () => {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob', // Importante para manejar archivos binarios
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  const handleDownloadVentas = () => {
    handleDownload('http://127.0.0.1:5000/ventas/reporte', 'ReporteVentas.pdf');
  };

  const handleDownloadCompras = () => {
    handleDownload('http://127.0.0.1:5000/compras/reporte', 'ReporteCompras.pdf');
  };

  const handleDownloadArqueos = () => {
    handleDownload('http://127.0.0.1:5000/arqueos_caja/reporte', 'ReporteArqueos.pdf');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 w-full">
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg transform transition-all hover:scale-105">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Descarga de Reportes
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <button
            onClick={handleDownloadVentas}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Descargar Reporte de Ventas
          </button>
          <button
            onClick={handleDownloadCompras}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Descargar Reporte de Compras
          </button>
          <button
            onClick={handleDownloadArqueos}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Descargar Reporte de Arqueos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
