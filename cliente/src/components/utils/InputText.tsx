import React from 'react';

interface InputTextProps {
    placeholder?: string;
    id?: string;
    label?: string;
    className?: string;
    type?:string;
    value: string | number;
    required?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<InputTextProps> = ({ id, label, value, onChange, type, placeholder, className }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input 
                className={`${className} shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light`} 
                type={type || 'text'} 
                id={id} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputText;