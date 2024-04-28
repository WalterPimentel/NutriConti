/* eslint-disable prettier/prettier */
import React, { useContext, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';

//import Icon from 'react-native-vector-icons/FontAwesome6';
import globalStyles from '../styles/global';

const Menu = () => {

    // Context de Firebase
    const { menu, obtenerProductos } = useContext(FirebaseContext);

    useEffect(() => {
        obtenerProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
            <Text>Menú</Text>
    );
};

export default Menu;
