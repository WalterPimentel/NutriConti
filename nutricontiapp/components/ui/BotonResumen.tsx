/* eslint-disable prettier/prettier */
import React, {useContext} from 'react';
import globalStyles from '../../styles/global';
import { useNavigation } from '@react-navigation/native';
import PedidoContext from '../../context/pedidos/pedidosContext';

import {
    NativeBaseProvider,
    Button,
    Text,
} from 'native-base';

const BotonResumen = () => {

    const navigation = useNavigation();

    // Leer el objeto de pedido
    const {pedido} = useContext(PedidoContext);

    if(pedido.length === 0) return null;

    return (
        <NativeBaseProvider>
            <Button
            style={globalStyles.boton}
            marginTop={2}
            onPress={() => navigation.navigate("ResumenPedido")}
            >
                <Text style={globalStyles.botonTexto}>Ir a Pedido</Text>
            </Button>
        </NativeBaseProvider>
    );
};

export default BotonResumen;
