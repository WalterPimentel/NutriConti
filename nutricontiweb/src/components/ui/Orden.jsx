import { useState, useContext, useEffect } from "react";
import { FirebaseContext } from '../../firebase';

const Orden = ({ orden }) => {

    const [tiempoentrega, guardarTiempoEntrega] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);
    const [isDoubleClicked, setIsDoubleClicked] = useState(false);

    const { firebase } = useContext(FirebaseContext);

    useEffect(() => {
        const savedIsClicked = localStorage.getItem(`isClicked-${orden.id}`);
        const savedIsDoubleClicked = localStorage.getItem(`isDoubleClicked-${orden.id}`);
        if (savedIsClicked !== null) setIsClicked(JSON.parse(savedIsClicked));
        if (savedIsDoubleClicked !== null) setIsDoubleClicked(JSON.parse(savedIsDoubleClicked));
        
        const handleBeforeUnload = () => {
            localStorage.removeItem(`isClicked-${orden.id}`);
            localStorage.removeItem(`isDoubleClicked-${orden.id}`);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const definirTiempo = id => {
        try {
            firebase.db.collection('ordenes')
                .doc(id)
                .update({
                    tiempoentrega
                })
        } catch (error) {
            console.log(error);
        }
    }

    const completarOrden = id => {
        try {
            firebase.db.collection('ordenes')
                .doc(id)
                .update({
                    completado: true
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fecha = new Date(orden.creado);
    const opciones = { hour: '2-digit', minute: '2-digit' };
    const horaFormateada = fecha.toLocaleString('es-ES', opciones);

    const handleClick = () => {
        if (clickTimeout !== null) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
            setIsDoubleClicked(!isDoubleClicked);
            localStorage.setItem(`isDoubleClicked-${orden.id}`, !isDoubleClicked);
        } else {
            setClickTimeout(setTimeout(() => {
                setIsClicked(!isClicked);
                setClickTimeout(null);
                localStorage.setItem(`isClicked-${orden.id}`, !isClicked);
            }, 250));
        }
    }

    return (
        <div
            className={`p-3 shadow-md cursor-pointer border-2 hover:drop-shadow-xl ${isClicked ? 'bg-blue-200' : 'bg-white'} ${isDoubleClicked ? 'border-red-500' : ''}`}
            onClick={handleClick}
        >
            <h1 className="text-yellow-600 text-lg font-bold">{horaFormateada}</h1>
            {orden.orden.map((platillos, index) => (
                <p key={index} className="text-gray-600">
                    {platillos.cantidad} {platillos.nombre} S/{platillos.precio}
                </p>
            ))}
            <p className="text-gray-700 font-bold">
                Total a Pagar: S/{orden.total}
            </p>
            {orden.tiempoentrega === 0 && (
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Tiempo de Entrega
                    </label>
                    <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-inset"
                        min="1"
                        max="20"
                        placeholder="20 minutos"
                        value={tiempoentrega}
                        onChange={e => guardarTiempoEntrega(parseInt(e.target.value))}
                    />
                    <button
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                        onClick={() => definirTiempo(orden.id)}
                    >
                        Definir Tiempo
                    </button>
                </div>
            )}

            {orden.tiempoentrega > 0 && (
                <p className="text-gray-700">
                    Teimpo de Entrega:
                    <span className="font-bold">
                        {" " + orden.tiempoentrega} Minutos
                    </span>
                </p>
            )}

            {!orden.completado && orden.tiempoentrega > 0 && (
                <button
                    type="button"
                    className="bg-blue-800 hover:bg-blue-700 w-full mt-5 p-2 text-white uppercase font-bold"
                    onClick={() => completarOrden(orden.id)}
                >
                    <i className="fas fa-hourglass-end text-white fa-sm mr-2"></i>
                    Marcar como Lista
                </button>
            )}
        </div>
    );
}

export default Orden;
