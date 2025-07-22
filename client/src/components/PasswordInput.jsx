import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(
    (
        {
            value,
            onChange,
            name,
            placeholder = 'Password',
            className = '',
            error,
            icon,
            ...props
        },
        ref
    ) => {
        const [show, setShow] = useState(false);

        return (
            <div
                className={`border px-4 py-2 flex items-center gap-2 rounded mt-5 ${error ? 'border-red-500' : ''}`}
            >
                {icon && <img src={icon} alt="" />}
                <input
                    ref={ref}
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`text-sm w-full bg-transparent outline-none ${className}`}
                    {...props}
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((s) => !s)}
                    className="focus:outline-none"
                    aria-label={show ? 'Hide password' : 'Show password'}
                >
                    {show ? <EyeOff size={18} color="#B9B9B9" /> : <Eye size={18} color="#B9B9B9" />}
                </button>
            </div>
        );
    }
);

export default PasswordInput;