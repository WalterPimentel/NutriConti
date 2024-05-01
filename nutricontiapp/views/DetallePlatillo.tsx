/* eslint-disable prettier/prettier */
import React, { useContext, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    NativeBaseProvider,
    Container,
    VStack,
    HStack, // como FooterTab, Footer, Header
    Box,
    Card,
    Text,
    ScrollView,
    Button,
    Pressable,
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

    // Redireccionar
    const navigation = useNavigation();


    // Estado para controlar la cantidad de ingredientes mostrados
    const [cantidadMostrar, setCantidadMostrar] = useState(2);
    // Estado para controlar si se muestran todos los ingredientes
    const [mostrarTodosIngredientes, setMostrarTodosIngredientes] = useState(false);

    // Función para mostrar más ingredientes
    const mostrarMasIngredientes = () => {
        setMostrarTodosIngredientes(true);
    };

    // Función para mostrar menos ingredientes
    const mostrarMenosIngredientes = () => {
        setCantidadMostrar(2); // Cambia la cantidad a mostrar
        setMostrarTodosIngredientes(false); // Cambia el estado a mostrar menos
    };

    return (
        <NativeBaseProvider>

            <Container style={[globalStyles.contenedor, { alignItems: 'center' }]}>
                <ScrollView>
                    <Box marginBottom={55} style={globalStyles.contenido}>
                        <Heading style={globalStyles.titulo}>{nombre}</Heading>
                        <Card>
                            <VStack>
                                <Box>
                                    <Image
                                        style={globalStyles.imagen}
                                        source={{ uri: imagen }}
                                    />
                                    <Text
                                        style={{ marginTop: 20 }}
                                    >{descripcion}</Text>
                                    <Heading
                                        style={globalStyles.cantidad}
                                    >Precio:
                                        <Text
                                            bold
                                            color="#93050E"> S/{precio}
                                        </Text>
                                    </Heading>
                                    <Heading textAlign="center">Ingredientes</Heading>
                                    {ingredientes.slice(0, mostrarTodosIngredientes ? ingredientes.length : cantidadMostrar).map((ingrediente, index) => (
                                        <Text textAlign="center" key={index}>{ingrediente}</Text>
                                    ))}
                                    {!mostrarTodosIngredientes && ingredientes.length > cantidadMostrar && (
                                        <Pressable onPress={mostrarMasIngredientes}>
                                            <Text textAlign="center" style={{ color: 'blue', textDecorationLine: 'underline' }}>Ver más...</Text>
                                        </Pressable>
                                    )}
                                    {mostrarTodosIngredientes && (
                                        <Pressable onPress={mostrarMenosIngredientes}>
                                            <Text textAlign="center" style={{ color: 'blue', textDecorationLine: 'underline' }}>Ver menos...</Text>
                                        </Pressable>
                                    )}
                                </Box>
                            </VStack>
                        </Card>
                        <Box marginTop={3}>
                            <Button>Ver Información Nutricional</Button>
                        </Box>
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
                        width="100%"
                        style={globalStyles.boton}
                        onPress={() => navigation.navigate('FormularioPlatillo')}
                    >
                        <Text
                            style={globalStyles.botonTexto}
                        >Ordenar Platillo</Text>
                    </Button>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default DetallePedido;
