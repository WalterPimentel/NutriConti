/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, Fragment } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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
    FlatList,
    Pressable,
} from 'native-base';

const screenWidth = Dimensions.get('window').width;

const Menu = () => {

    // Context de Firebase
    const { menu, obtenerProductos } = useContext(FirebaseContext);

    // Context de pedido
    const { seleccionarPlatillo } = useContext(PedidoContext);

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
                                        onPress={ () => {
                                            seleccionarPlatillo(platillo);
                                        }}
                                    >
                                        <Box
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
                                                <VStack paddingLeft={2} w="65%"> {/* falta concluir problema responsivo */}
                                                    <Text
                                                        numberOfLines={1}
                                                        bold
                                                        maxWidth="95%"
                                                    >{nombre}</Text>
                                                    <Text
                                                        maxWidth="95%"
                                                        italic
                                                        numberOfLines={3}
                                                    >{descripcion}</Text>
                                                </VStack>
                                                <Text alignSelf="flex-start"> S/{precio}</Text>
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
        width: screenWidth,
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
