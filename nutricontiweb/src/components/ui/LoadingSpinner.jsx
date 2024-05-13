import { useState, useEffect } from 'react';

const LoadingSpinner = ({isOpen}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots => dots.length < 3 ? dots + '.' : '');
        }, 400);

        return () => clearInterval(interval);
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="flex w-full fixed flex-col justify-center items-center bg-gray-800 h-screen top-0 left-0">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-8 border-blue-500 mb-4"></div>
            <p className="font-bold text-xl text-gray-300">Cargando {dots}</p>
        </div>
    );
};

export default LoadingSpinner;