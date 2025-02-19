import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    type?: "button" | "submit" | "reset" | undefined;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick,className,type,children }) => {
    return (
        <button 
            className={` ${className} shadow-xl mt-2 ml-2 hover:bg-gray-800 hover:text-white transform hover:scale-110 transition-all duration-200 hover:border-none `}  
            type={type || 'button'} 
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Button;