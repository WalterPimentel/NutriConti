import { Route, Navigate } from 'react-router-dom';
import { UserRoleContext } from '../../contexts/UserRoleContext';

function ProtectedRoute({ roles, ...props }) {
    const userRole = useContext(UserRoleContext);

    if (roles.includes(userRole)) {
        return <Route {...props} />;
    } else {
        return <Navigate to="/" />;
    }
}

export default ProtectedRoute;