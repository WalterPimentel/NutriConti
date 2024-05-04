/* eslint-disable prettier/prettier */
import React, {
    useContext,
    useEffect,
    Fragment,
    useState,
} from 'react';

import { StyleSheet, Alert } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import firebase from '../firebase';

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
    Toast,
} from 'native-base';

const ResumenPedido = () => {

    const navigation = useNavigation();

    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);

    // Context de pedido
    const {
        pedido,
        total,
        mostrarResumen,
        eliminarProducto,
        pedidoRealizado,
    } = useContext(PedidoContext);

    useEffect(() => {
        calcularTotal();
        if (pedido.length === 0) {
            setBotonDeshabilitado(true);
            Toast.show({
                title: 'Agrega platillos para realizar una orden',
                duration: 3000,
                rounded: 'full',
                type: 'info',
                bgColor: 'rgba(0, 0, 0, 0.5)',
                isClosable: true,
            });
        }
    }, [pedido]);

    const calcularTotal = () => {
        let nuevoTotal = 0;
        nuevoTotal = pedido.reduce((total, articulo) => {
            return total + parseFloat(articulo.total);
        }, 0);

        nuevoTotal = nuevoTotal.toFixed(2);
        mostrarResumen(nuevoTotal);
    };

    // Rediracciona a progreso pedido
    const progresoPedido = () => {
        Alert.alert(
            'Revisa tu pedido',
            'Una vez que realizas tu pedido, no podrás cambiarlo.',
            [
                {
                    text: 'Revisar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {

                        // Crear un Objeto
                        const pedidoObj = {
                            tiempoentrega: 0,
                            completado: false,
                            total: Number(total),
                            orden: pedido, // array
                            creado: Date.now(),
                        };

                        try {
                            const pedido = await firebase.db.collection('ordenes').add(pedidoObj);
                            pedidoRealizado(pedido.id);

                            // Redireccionar a Progreso
                            navigation.navigate("ProgresoPedido");
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]
        );
    };

    // Elimina un producto del arreglo del pedido
    const confirmarEliminacion = id => {
        Alert.alert(
            '¿Deseas eliminar este artículo?',
            'Una vez eliminado no se puede recuperar.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        // Eliminar del state
                        eliminarProducto(id);
                    },
                },
            ]
        );
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
                                        <Button
                                            style={globalStyles.botonDanger}
                                            marginTop={2}
                                            endIcon={
                                                <Icon
                                                    name="trash"
                                                    size={15}
                                                    color="#FFF"
                                                />
                                            }
                                            onPress={() => confirmarEliminacion(id)}
                                        >
                                            <Text
                                                textTransform="uppercase"
                                                fontWeight="bold"
                                                color="#FFF"
                                            >Eliminar</Text>
                                        </Button>
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
                        marginBottom="20%"
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
                        isDisabled={botonDeshabilitado}
                        onPress={() => progresoPedido()}
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
