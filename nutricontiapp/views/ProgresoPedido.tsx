/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import PedidoContext from '../context/pedidos/pedidosContext';
import firebase from '../firebase';
import Countdown from 'react-countdown';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    Text,
    Button,
    Heading,
    Container,
    Center,
    CheckCircleIcon,
} from 'native-base';

const ProgresoPedido = () => {

    const screenWidth = StyleSheet
        .flatten(globalStyles.contenedor)
        .maxWidth;
    const paddingPercentage = parseFloat(
        StyleSheet
            .flatten(
                globalStyles.contenido
            ).marginHorizontal
    ) / 100;
    const paddingHorizontal = screenWidth * paddingPercentage;
    const contentWidth = screenWidth - 2 * paddingHorizontal;

    const navigation = useNavigation();

    const { idpedido } = useContext(PedidoContext);

    const [tiempo, guardarTiempo] = useState(0);
    const [completado, guardarCompletado] = useState(false);

    useEffect(() => {
        const obtenerProducto = () => {
            firebase.db.collection('ordenes')
                .doc(idpedido)
                .onSnapshot(function (doc) {
                    guardarTiempo(doc.data().tiempoentrega);
                    guardarCompletado(doc.data().completado);
                });
        };
        obtenerProducto();
    }, []);

    // Muestra el Countdown en la pantalla
    const renderer = ({ minutes, seconds }) => {

        return (
            <Heading style={styles.tiempo} fontSize={60}>
                {minutes}:{seconds}
            </Heading>
        );
    };

    return (
        <Center flex={1}>
            <Container style={globalStyles.contenedor} marginTop={-20}>
                <View
                    style={[
                        globalStyles.contenido,
                        styles.contenido,
                    ]}>
                    {tiempo === 0 && (
                        <>
                            <Text textAlign="center" bold>Hemos recibido tu orden...</Text>
                            <Text textAlign="center" bold>Estamos calculando el tiempo de entrega</Text>
                            <Button isLoading size="lg" variant="outline" borderColor="white" w={contentWidth} />
                        </>
                    )}

                    {!completado && tiempo > 0 && (
                        <>
                            <Text w={contentWidth} textAlign="center" fontSize="xl" bold>Su orden estara lista en: </Text>

                            <Countdown
                                date={Date.now() + tiempo * 60000}
                                renderer={renderer}
                            />

                        </>
                    )}

                    {completado && (
                        <>
                            <Center>
                                <CheckCircleIcon size="10" mt="0.5" color="emerald.500" />
                                <Heading
                                    color="emerald.500"
                                    fontSize="3xl"
                                    bold
                                    style={styles.textoCompletado}
                                >Orden Lista</Heading>
                                <Text fontSize="xl">Su pedido ya está listo</Text>
                                <Button
                                    style={globalStyles.boton}
                                    marginTop={100}
                                    rounded="full"
                                    w={contentWidth}
                                    endIcon={
                                        <Icon
                                            name="circle-plus"
                                            size={15}
                                            color="#000"
                                        />
                                    }
                                    onPress={() => navigation.navigate('Menu')}
                                >
                                    <Text
                                        style={globalStyles.botonTexto}
                                    >Comenzar una Orden Nueva</Text>
                                </Button>
                            </Center>
                        </>
                    )}
                </View>
            </Container>
        </Center>
    );
};

const styles = StyleSheet.create({
    tiempo: {
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20,
    },
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    textoCompletado: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        marginTop: 7,
    },
});

export default ProgresoPedido;
