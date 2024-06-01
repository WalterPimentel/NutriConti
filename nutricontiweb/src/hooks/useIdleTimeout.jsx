import { useEffect } from 'react';

const useIdleTimeout = (logoutFunction, timeoutDuration) => {
    const setUserActivity = () => {
        localStorage.setItem('lastActivity', Date.now());
    };

    const checkActivity = () => {
        const lastActivity = localStorage.getItem('lastActivity');
        if (Date.now() - lastActivity > timeoutDuration) {
            logoutFunction();
        }
    };

    useEffect(() => {
        setUserActivity();
        window.addEventListener('mousemove', setUserActivity);
        window.addEventListener('keydown', setUserActivity);
        window.addEventListener('scroll', setUserActivity);

        const interval = setInterval(checkActivity, 60 * 1000);

        return () => {
            window.removeEventListener('mousemove', setUserActivity);
            window.removeEventListener('keydown', setUserActivity);
            window.removeEventListener('scroll', setUserActivity);
            clearInterval(interval);
        };
    }, []);
};

export default useIdleTimeout;