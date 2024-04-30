/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { StyleSheet, Image } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';

import {
    NativeBaseProvider,
    Container,
    VStack,
    HStack, // como FooterTab, Footer, Header
    Box,
    Card,
    Text,
    ScrollView,
    Pressable,
    Footer,
    Button,
    Heading, // como H1
} from 'native-base';

const DetallePedido = () => {

    // Pedido Context
    const { platillo:
        {
            nombre,
            imagen,
            descripcion,
            precio,
            ingredientes
        } } = useContext(PedidoContext);

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Container style={globalStyles.contenedor}>
                    <Box style={globalStyles.contenido}>
                        <Heading style={globalStyles.titulo}>{nombre}</Heading>
                        <Card>
                            <VStack>
                                <Box>
                                    <Image
                                        style={globalStyles.imagen}
                                        source={{ uri: imagen }}
                                    />
                                </Box>
                            </VStack>
                        </Card>
                    </Box>
                </Container>
            </ScrollView>
        </NativeBaseProvider>
    );
};

export default DetallePedido;
