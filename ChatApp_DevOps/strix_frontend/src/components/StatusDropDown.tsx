import React, { useState } from 'react';
import { useSocket } from '../provides/SocketContext';
import { useAuth } from '../provides/AuthContext';

const StatusDropDown: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<string>('Status');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { socket } = useSocket();
    const { token } = useAuth();

    const options = ['verfügbar', 'pause', 'abwesend', 'meeting'];

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);

        socket?.emit('update_status', {
            token: token,
            status: option
        })

        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left border-2 border-black rounded w-full">
        <div>
            <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex justify-center w-full shadow-sm px-4 py-2 bg-white text-sm font-medium text-black"
            aria-haspopup="true"
            aria-expanded="true"
            >
            {selectedOption}
            <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
            >
                <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
                />
            </svg>
            </button>
        </div>

        {isOpen && (
            <div
            className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            >
            <div className="py-1" role="none">
                {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-gray-900"
                    role="menuitem"
                >
                    {option}
                </button>
                ))}
            </div>
            </div>
        )}
        </div>
    );
};

export default StatusDropDown;