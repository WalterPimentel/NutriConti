import { useEffect } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import Ordenes from "../paginas/Ordenes";
import Menu from "../paginas/Menu";
import NuevoPlatillo from "../paginas/NuevoPlatillo";
import DetallePlato from "../paginas/DetallePlato";
import Usuarios from "../paginas/Usuarios";
import NuevoUsuario from "../paginas/NuevoUsuario";
import OrdenesPasadas from "../paginas/OrdenesPasadas";

const Routes = ({ userRole }) => {

    const location = useLocation();

    useEffect(() => {
        const routeToTitle = {
            '/': '- Ordenes',
            '/ordenes-pasadas': '- Ordenes Pasadas',
            '/usuarios': '- Usuarios',
            '/nuevo-usuario': '- Nuevo Usuario',
            '/menu': '- Menu',
            '/nuevo-platillo': '- Nuevo Platillo',
            '/menu/:platilloId': '- Detalle Plato',
        };

        document.title = `NutriConti ${routeToTitle[location.pathname] || 'Web'}`;
    }, [location]);

    return useRoutes([
        {
            path: '/ordenes-pasadas',
            element: userRole && ['administrador', 'caja']
                .includes(userRole) ? <OrdenesPasadas /> : <Navigate to="/" />
        },
        {
            path: '/usuarios',
            element: userRole && ['administrador']
                .includes(userRole) ? <Usuarios /> : <Navigate to="/" />
        },
        {
            path: '/nuevo-usuario',
            element: userRole && ['administrador']
                .includes(userRole) ? <NuevoUsuario /> : <Navigate to="/" />
        },
        {
            path: '/menu',
            element: userRole && ['administrador', 'caja', 'mesero']
                .includes(userRole) ? <Menu /> : <Navigate to="/" />
        },
        {
            path: '/nuevo-platillo',
            element: userRole && ['administrador', 'caja']
                .includes(userRole) ? <NuevoPlatillo /> : <Navigate to="/" />
        },
        {
            path: '/menu/:platilloId',
            element: userRole && ['administrador']
                .includes(userRole) ? <DetallePlato /> : <Navigate to="/" />
        },
        { path: '/', element: <Ordenes /> }
    ]);
};

export default Routes;