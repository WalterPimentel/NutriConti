import { useState, useEffect } from 'react';

const LoadingSpinner = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots => dots.length < 3 ? dots + '.' : '');
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center bg-gray-800 h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-8 border-blue-500 mb-4"></div>
            <p className="font-bold text-xl text-gray-300">Cargando {dots}</p>
        </div>
    );
};

export default LoadingSpinner;