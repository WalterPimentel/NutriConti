/* eslint-disable prettier/prettier */
import React, { useReducer } from 'react';

import PedidoReducer from './pedidosReducer';
import PedidoContext from './pedidosContext';

import {
    SELECCIONAR_PRODUCTO,
    CONFIRMAR_ORDENAR_PLATILLO,
    MOSTRAR_RESUMEN,
} from '../../types';

const  PedidoState = props => {

    // Crear State inicial
    const initialState = {
        pedido: [],
        platillo: null,
        total: 0,
    };

    // useReducer con dispatch para ejecutar las funciones
    const [ state, dispatch ] = useReducer(PedidoReducer, initialState);

    // Selecciona el producto que el usuario desea ordenar
    const seleccionarPlatillo = platillo => {
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: platillo,
        });
    };

    // Cuando el usuairo confirma un platillo
    const guardarPedido = pedido => {
        dispatch({
            type: CONFIRMAR_ORDENAR_PLATILLO,
            payload: pedido,
        });
    };

    // Muestra el total a apagar en el resumen
    const mostrarResumen = total => {
        dispatch({
            type: MOSTRAR_RESUMEN,
            payload: total,
        });
    };

    return(
        <PedidoContext.Provider
            value={{
                pedido: state.pedido,
                platillo: state.platillo,
                total: state.total,
                seleccionarPlatillo,
                guardarPedido,
                mostrarResumen,
            }}
        >
            {props.children}
        </PedidoContext.Provider>
    );
};

export default PedidoState;
