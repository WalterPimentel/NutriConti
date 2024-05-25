import React, { useReducer } from 'react';

import firebase from '../../firebase';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';
import _ from 'lodash';

import { OBTENER_PRODUCTOS_EXITO } from '../../types';

const FirebaseState = props => {

    // Crear State inicial
    const initialState = { menu: [] };

    // useReducer con dispatch para ejecutar las funciones
    const [state, dispatch] = useReducer(FirebaseReducer, initialState);

    // Función que se ejecuta para traer los productos
    const obtenerProductos = () => {

        // consultar firebase
        firebase.db
            .collection('productos')
            .where('existencia', '==', true) // traer los que existen
            .onSnapshot(manejarSnapshot);

        function manejarSnapshot(snapshot) {
            let platillos = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            // Ordenar por categoria con lodash
            platillos = _.sortBy(platillos, 'categoria');

            // Tenemos resultados de la BD
            dispatch({
                type: OBTENER_PRODUCTOS_EXITO,
                payload: platillos,
            });
        }
    };

    return (
        <FirebaseContext.Provider
            value={{
                menu: state.menu,
                firebase,
                obtenerProductos,
            }}
        >
            {props.children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseState;
