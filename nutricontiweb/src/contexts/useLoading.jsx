import { createContext, useState, useContext } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={setIsLoading}>
            {children}
            <LoadingSpinner isOpen={isLoading} />
        </LoadingContext.Provider>
    );
};