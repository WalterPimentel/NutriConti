/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, Fragment } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FirebaseContext from '../context/firebase/firebaseContext';
import PedidoContext from '../context/pedidos/pedidosContext';

import globalStyles from '../styles/global';

import {
    NativeBaseProvider,
    Container,
    VStack,
    HStack,
    Box,
    Image,
    Text,
    ScrollView,
    Pressable,
} from 'native-base';

const Menu = () => {

    // Context de Firebase
    const { menu, obtenerProductos } = useContext(FirebaseContext);

    // Context de pedido
    const { seleccionarPlatillo } = useContext(PedidoContext);

    // Hook para redireccionar
    const navigation = useNavigation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { obtenerProductos(); }, []);

    const mostrarHeading = (categoria, i) => {

        if (i > 0) {
            const categoriaAnterior = menu[i - 1].categoria;

            if (categoriaAnterior !== categoria) {
                return (
                    <Box style={styles.separador} p={4}>
                        <Text style={styles.separadorTexto}>{categoria}</Text>
                    </Box>
                );
            }
        } else {
            return (
                <Box style={styles.separador} p={4}>
                    <Text style={styles.separadorTexto}>{categoria}</Text>
                </Box>
            );
        }

    };

    return (
        <NativeBaseProvider>
            <Container style={[globalStyles.contenedor, styles.contenedor]}>
                <ScrollView>
                    <Box style={styles.contenido}>
                        {menu.map((platillo, i) => {
                            const {
                                imagen,
                                nombre,
                                descripcion,
                                categoria,
                                id,
                                precio,
                            } = platillo;
                            return (
                                <Fragment key={id}>
                                    {mostrarHeading(categoria, i)}
                                    <Pressable
                                        onPress={() => {

                                            // Eliminar algunas propiedades del platillo
                                            const {
                                                existencia,
                                                categoria,
                                                ...platillo2
                                            } = platillo;

                                            seleccionarPlatillo(platillo2);

                                            navigation.navigate('DetallePlatillo')
                                        }}
                                    >
                                        <Box
                                            w="66%"
                                            borderBottomWidth="1"
                                            borderBottomColor="gray.300"
                                            py="2"
                                            padding={4}
                                        >
                                            <HStack>
                                                <Image
                                                    source={{ uri: imagen }}
                                                    alt={nombre}
                                                    size="lg"
                                                    borderRadius="2xl"
                                                />
                                                <VStack paddingLeft={2} w="100%">
                                                    <Text
                                                        numberOfLines={1}
                                                        bold
                                                    >{nombre}</Text>
                                                    <Text
                                                        italic
                                                        numberOfLines={3}
                                                    >{descripcion}</Text>
                                                </VStack>
                                                <Text
                                                    alignSelf="flex-start"
                                                    bold
                                                    color="#93050E"
                                                > S/{precio}</Text>
                                            </HStack>
                                        </Box>
                                    </Pressable>
                                </Fragment>
                            );
                        })}
                    </Box>
                </ScrollView>
            </Container>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
    },
    contenido: {
        backgroundColor: '#FFF',
    },
    separador: {
        backgroundColor: '#556B2F',
    },
    separadorTexto: {
        color: '#FFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default Menu;
