import { useState } from "react";
import useUsuario from "../../hooks/useUsuario";

import useWindowSize from "../../hooks/useWindowSize";

const Header = ({ isSidebarVisible, setSidebarVisible, user, onLogout }) => {

    const size = useWindowSize();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { usuario } = useUsuario(user.uid);

    function capitalizeWords(string) {
        return string
            .toLowerCase()
            .split(' ')
            .slice(0, 3)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <header className="header flex items-stretch bg-gray-800 min-h-[3.3rem]">
            <div className={`flex items-center justify-center mt-1 mb-1 cursor-pointer ${isSidebarVisible && size.width >= 800 ? 'md:w-1/4 xl:w-1/5' : (size.width >= 800 ? 'w-[3.1rem]' : 'hidden')}`}>
                <img src="/icappround.png" alt="Logo" className="h-11" />
                <p className={`text-white text-center font-extrabold text-3xl overflow-hidden ${isSidebarVisible ? '' : 'hidden'}`} style={{ whiteSpace: 'nowrap' }}>
                    NutriConti
                    <span className="text-green-500">Web</span>
                </p>
            </div>
            <div className="flex justify-between flex-grow">
                <div
                    className="flex items-center justify-center w-10 cursor-pointer text-white hover:bg-gray-700 hover:text-blue-500"
                    onClick={() => setSidebarVisible(!isSidebarVisible)}
                >
                    <i className="fas fa-bars" />
                </div>
                <div className="flex items-center mr-3 cursor-pointer" onClick={() => setIsModalOpen(prevState => !prevState)}>
                    <img className="rounded-full h-9 w-9" src={user.photoURL} alt={user.displayName} />
                    <div className="ml-4">
                        <p className="text-white font-bold">{capitalizeWords(user.displayName)}</p>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsModalOpen(false)}>
                    <div className="fixed z-10 right-0 top-0 mt-12 mr-1 shadow-lg">
                        <div className="bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full border-white border">
                            <div className="px-2 pt-3 pb-2 sm:p-4 sm:pb-2">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-2 sm:mt-0 sm:ml-2 sm:text-left flex flex-col items-center">
                                        <img className="rounded-full h-16 w-16" src={user.photoURL} alt={user.displayName} />
                                        <div className="mt-2 text-center">
                                            <p className="text-xs text-white">
                                                {user.displayName}
                                            </p>
                                            <p className="text-xs text-white italic">
                                                {user.email}
                                            </p>
                                            <p className="text-sm text-white uppercase">
                                                {usuario.puesto}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex bg-red-500 hover:bg-red-700 px-1 py-1 text-white justify-center cursor-pointer"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    onLogout();
                                }}
                            >
                                <p className="uppercase font-bold">
                                    <i className="fa-solid fa-right-from-bracket fa-rotate-180 mr-2" />
                                    Cerrar Sesión
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;