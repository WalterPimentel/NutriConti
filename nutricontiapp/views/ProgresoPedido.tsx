/* eslint-disable prettier/prettier */
import React, {useContext, useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import PedidoContext from '../context/pedidos/pedidosContext';

import {
    NativeBaseProvider,
    VStack,
    HStack,
    Box,
    Text,
    ScrollView,
    Button,
    Heading,
    Image,
} from 'native-base';

const ProgresoPedido = () => {

    const { idpedido } = useContext(PedidoContext);

    return (
        <NativeBaseProvider>
            <Text>{idpedido}</Text>
        </NativeBaseProvider>
     );
};

export default ProgresoPedido;
