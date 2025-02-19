import React, { useState } from 'react';
import { FaSearch, FaCamera } from 'react-icons/fa';
import axios from 'axios';
import ModalAdvertencia from '../utils/ModalAdvertencia';

interface SearchAndUploadProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filterTerm: string) => void;
}

const CargarImagen: React.FC<SearchAndUploadProps> = ({ onSearch, onFilter }) => {
  const [advertirError, setAdvertirError] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Maneja la entrada de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Maneja la carga de la imagen
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      handleUpload(event.target.files[0]);
    }
  };

  // Maneja la acción de buscar
  const handleSearch = () => {
    if (searchTerm) {
      onSearch(searchTerm);
    }
  };

  // Maneja el envío de la imagen
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/reconocer-imagen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const objetosReconocidos = response.data.objetos_reconocidos;
      console.log('Respuesta del servidor:', objetosReconocidos);

      // Encuentra la clase con mayor probabilidad
      const objetoMayorProbabilidad = objetosReconocidos.reduce((prev: any, current: any) => {
        return parseFloat(current.probabilidad) > parseFloat(prev.probabilidad) ? current : prev;
      });

      // Usa la clase de mayor probabilidad para filtrar
      onFilter(objetoMayorProbabilidad.clase.toLowerCase());
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      setAdvertirError(true);
      setTitleError('Error al cargar la imagen. Verifique la consola para más detalles.');
    }
  };

  // Maneja el evento de arrastrar y soltar
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      handleUpload(file);
    }
  };

  return (
  <>
    <div
      className={`flex items-center bg-white rounded-full shadow-md p-2 w-full max-w-lg mx-auto ${isDragging ? 'border-2 border-dashed border-blue-400' : ''
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="flex-grow px-4 py-2 text-sm border-none focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 text-gray-500 hover:text-blue-600 focus:outline-none"
      >
        <FaSearch size={18} />
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="upload-input"
      />
      <label
        htmlFor="upload-input"
        className="px-4 py-2 text-gray-500 hover:text-blue-600 cursor-pointer"
      >
        <FaCamera size={18} />
      </label>
      <button
        onClick={() => selectedFile && handleUpload(selectedFile)}
        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
      >
        Subir
      </button>
    </div>
                   {/* Modal de Advertencia */}
                   <ModalAdvertencia
                        isVisible={advertirError}
                        title={titleError}
                        onClose={()=> setAdvertirError(false)}
                        //onAccept={handleConfirmarAdvertencia}
                        //isAccept={true}
                        secondbtnText = {"Cerrar"}
                    />
</>
  );
};

export default CargarImagen;
