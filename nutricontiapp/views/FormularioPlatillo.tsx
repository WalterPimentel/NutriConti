/* eslint-disable prettier/prettier */
import React, { useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    NativeBaseProvider,
    Container,
    HStack, // como FooterTab, Footer, Header, row
    Box,
    Text,
    ScrollView,
    Button,
    Heading, // como H1
    FormControl,
    Input,
    Stack,
    Toast,
} from 'native-base';

const FormularioPlatillo = () => {


    // State para cantidades
    const [cantidad, guardarCantidad] = useState(1);
    const [total, guardarTotal] = useState(0);
    const [botonDeshabilitado, setBotonDeshabilitado] = useState(false);

    // Context
    const { platillo, guardarPedido } = useContext(PedidoContext);
    const { precio } = platillo;

    // Redireccionar
    const navigation = useNavigation();

    // En cuanto el componente carga, calcular la cantidad a pagar
    useEffect(() => {
        calcularTotal();
        if (botonDeshabilitado) {
            Toast.show({
                title: 'La cantidad debe ser al menos 1',
                duration: 3000,
                rounded: 'full',
                bgColor: 'rgba(0, 0, 0, 0.5)',
                isClosable: true,
            });
        }
    }, [cantidad]);

    // Calcula el total del platillo por su cantidad
    const calcularTotal = () => {
        const totalPagar = (precio * cantidad).toFixed(2);
        guardarTotal(totalPagar);
    };

    // Alamacena la cantidad via input
    const calcularCantidad = cantidad => {
        const esNumeroEntero = /^[1-9]\d*$/.test(cantidad);

        if (esNumeroEntero || cantidad === '') {
            guardarCantidad(cantidad);
            setBotonDeshabilitado(cantidad === '');
        }
    };

    // Decrementar en uno la cantidad
    const decrementarUno = () => {
        if (cantidad > 1) {
            const nuevaCantidad = parseInt(cantidad) - 1;
            guardarCantidad(nuevaCantidad);
        }
    };

    // Incrementar en uno la cantidad
    const incrementarUno = () => {
        const nuevaCantidad = isNaN(parseInt(cantidad)) ? 1 : parseInt(cantidad) + 1;
        guardarCantidad(nuevaCantidad);
        setBotonDeshabilitado(false);
    };

    // Confirmar si la orden es correcta
    const confirmarOrden = () => {
        Alert.alert(
            '¿Deseas confirmar tu pedido?',
            'Un pedido confirmado ya no se podrá modificar.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: () => {
                        // Almacenar el pedido principal
                        const pedido = {
                            ...platillo,
                            cantidad,
                            total,
                        };
                        guardarPedido(pedido);

                        // Navegar  hacia el resumen
                        navigation.navigate("ResumenPedido");
                    },
                },
            ]

        );
    };

    return (
        <NativeBaseProvider>
            <Container style={globalStyles.anchoPantalla}>
                <ScrollView>
                    <Box>
                        <FormControl>
                            <Heading style={globalStyles.titulo}>Cantidad</Heading>
                            <Stack direction="row">
                                <Box width="1/3">
                                    <Button
                                        backgroundColor="#556B2F"
                                        style={{ height: 80, justifyContent: 'center' }}
                                        onPress={() => decrementarUno()}
                                        startIcon={
                                            <Icon
                                                name="minus"
                                                size={40}
                                                color="#FFF"
                                            />
                                        }
                                    />
                                </Box>
                                <Box alignItems="center" width="1/3">
                                    <Input
                                        height={20}
                                        style={{ textAlign: 'center', fontSize: 20 }}
                                        value={cantidad.toString()}
                                        keyboardType="number-pad"
                                        onChangeText={calcularCantidad}
                                    />
                                </Box>
                                <Box width="1/3">
                                    <Button
                                        backgroundColor="#556B2F"
                                        style={{ height: 80, justifyContent: 'center' }}
                                        onPress={() => incrementarUno()}
                                        startIcon={
                                            <Icon
                                                name="plus"
                                                size={40}
                                                color="#FFF"
                                            />
                                        }
                                    />
                                </Box>
                            </Stack>
                            <Text style={globalStyles.cantidad}>Subtotal: S/{total}</Text>
                        </FormControl>
                    </Box>
                </ScrollView>
            </Container>
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
                        endIcon={
                            <Icon
                                name="utensils"
                                size={15}
                                color="#000"
                            />
                        }
                        isDisabled={botonDeshabilitado}
                        width="100%"
                        style={globalStyles.boton}
                        onPress={() => confirmarOrden()}
                    >
                        <Text
                            style={globalStyles.botonTexto}
                        >Agregar al Pedido</Text>
                    </Button>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default FormularioPlatillo;
