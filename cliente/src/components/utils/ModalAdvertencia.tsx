import React from 'react';

interface ModalCuotasProps {
    isVisible: boolean;
    isAccept?: boolean;
    secondbtnText?:string;
    onClose: () => void;
    onAccept?: () => void;
    title: string;
}

const ModalAdvertencia: React.FC<ModalCuotasProps> = ({ secondbtnText = "Cancelar",isVisible, onClose, title, isAccept = false, onAccept }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1><strong>{title}</strong></h1>
                <div className='flex justify-center gap-4'>
                    {isAccept === true && (
                        <button
                            className="mt-4 bg-[#1f2937] text-white p-2 rounded-full hover:scale-105 w-[100px] shadow-xl"
                            onClick={onAccept}>
                            Aceptar
                        </button>
                    )}
                    <button
                        className="mt-4 bg-[#1f2937] text-white p-2 rounded-full hover:scale-105 w-[100px] shadow-xl"
                        onClick={onClose}
                    >
                        {secondbtnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAdvertencia;