const Orden = ({ orden }) => {

    console.log(orden)
    return (
        <div className="sm:w-1/2 lg:w1/3 px-2 mb-4">
            <div className="p-3 shadow-md bg-white">
                <h1 className="text-yellow-600 text-lg font-bold">{orden.id}</h1>
                {orden.orden.map(platillos => (
                    <p className="text-gray-600">
                        {platillos.cantidad} {platillos.nombre} {platillos.precio}
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
                        />
                        <button
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                        >
                            Definir Tiempo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orden;