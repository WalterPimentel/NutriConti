/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    NativeBaseProvider,
    VStack, // Column
    HStack, // como FooterTab, Footer, Header, row
    Box,
    Text,
    ScrollView,
    Button,
    Heading, // como H1
    Image,
} from 'native-base';

const ResumenPedido = () => {

    const navigation = useNavigation();

    // Context de pedido
    const { pedido, total, mostrarResumen } = useContext(PedidoContext);

    useEffect(() => {
        calcularTotal();
    }, []);

    const calcularTotal = () => {
        let nuevoTotal = 0;
        nuevoTotal = pedido.reduce((total, articulo) => {
            return total + parseFloat(articulo.total);
        }, 0);

        nuevoTotal = nuevoTotal.toFixed(2);

        mostrarResumen(nuevoTotal);
    };

    return (
        <NativeBaseProvider>
            <ScrollView>
                <Heading style={globalStyles.titulo}>Resumen Pedido</Heading>
                <VStack style={globalStyles.contenedor}>
                    {pedido.map((platillo, i) => {
                        const { cantidad, nombre, imagen, id, precio } = platillo;
                        return (
                            <Fragment key={id + i}>
                                <HStack
                                    w="100%"
                                    borderBottomWidth="1"
                                    borderBottomColor="gray.300"
                                    py="2"
                                    padding={3}
                                >
                                    <Image
                                        source={{ uri: imagen }}
                                        alt={nombre}
                                        size="lg"
                                        maxWidth="25%"
                                        minWidth="25%"
                                        w="25%"
                                        borderRadius="2xl"
                                    />

                                    <VStack paddingLeft={2} w="75%">
                                        <Text numberOfLines={1}>{nombre}</Text>
                                        <Text>Cantidad: {cantidad}</Text>
                                        <Text>Precio unidad: S/{precio}</Text>
                                    </VStack>
                                </HStack>
                            </Fragment>
                        );
                    })}
                    <Text style={globalStyles.cantidad}>
                        Total a pagar: S/{total}
                    </Text>
                    <Button
                        onPress={() => navigation.navigate('Menu')}
                        style={styles.botonSeguirPidiendo}
                        marginTop={30}
                        marginLeft="2.5%"
                        marginRight="2.5%"
                        endIcon={
                            <Icon
                                name="bowl-food"
                                size={15}
                                color="#FFF"
                            />
                        }
                    >
                        <Text style={styles.textoSeguirPidiendo}>Seguir Pidiendo</Text>
                    </Button>
                </VStack>
            </ScrollView>
            <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                flex={1}
                safeAreaTop
                width="100%"
                alignSelf="center">
                <HStack
                    safeAreaBottom
                    shadow={6}
                >
                    <Button
                        width="100%"
                        style={globalStyles.boton}
                        endIcon={
                            <Icon
                                name="clipboard-list"
                                size={15}
                                color="#000"
                            />
                        }
                        onPress={() => navigation.navigate('ProgresoPedido')}
                    >
                        <Text
                            style={globalStyles.botonTexto}
                        >Ordenar Pedido</Text>
                    </Button>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    botonSeguirPidiendo: {
        backgroundColor: '#556B2F',
    },
    textoSeguirPidiendo: {
        color: '#FFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default ResumenPedido;
