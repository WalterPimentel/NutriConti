/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, Fragment } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';

import globalStyles from '../styles/global';

import {
    NativeBaseProvider,
    Container,
    Divider,
    VStack, //como List
    HStack, //como ListItem
    Box, //como Body
    Image,
    Text,
    Center,
    ScrollView,
} from 'native-base';

const Menu = () => {

    // Context de Firebase
    const { menu, obtenerProductos } = useContext(FirebaseContext);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { obtenerProductos(); }, []);

    return (
        <NativeBaseProvider>
            <Container style={globalStyles.contenedor}>
                <ScrollView>
                    <Box style={styles.contenido} padding={4} marginTop={-2}>
                        {menu.map(platillo => {
                            const {
                                imagen,
                                nombre,
                                descripcion,
                                categoria,
                                id,
                                precio
                            } = platillo;
                            return (
                                <Fragment key={id}>
                                    <Box
                                        borderBottomWidth="1"
                                        borderBottomColor="gray.400"
                                        py="2"
                                    >
                                        <HStack>
                                            <Image
                                                source={{ uri: imagen }}
                                                alt={nombre}
                                                size="lg"
                                                borderRadius="2xl"
                                            />
                                            <VStack paddingLeft={2} w="64%">
                                                <Text
                                                    numberOfLines={1}
                                                    bold
                                                >{nombre}</Text>
                                                <Text
                                                    maxWidth="90%"
                                                    italic
                                                    numberOfLines={3}
                                                >{descripcion}</Text>
                                            </VStack>
                                            <Text alignSelf="flex-start"> S/{precio}</Text>
                                        </HStack>
                                    </Box>
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
    contenido: {
        backgroundColor: '#FFF',
    },
});

export default Menu;
