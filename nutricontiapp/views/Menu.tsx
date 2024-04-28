/* eslint-disable prettier/prettier */
import React, { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import FirebaseContext from '../context/firebase/firebaseContext';

//import Icon from 'react-native-vector-icons/FontAwesome6';
import globalStyles from '../styles/global';

import { config } from '@gluestack-ui/config';
import {
    GluestackUIProvider,
    Button,
    ButtonText,
    Box, // usar como Left, Body, Container, Content
    Divider, // usar como Sperarator
    FlatList,
    SectionList,
    Text,
    Image,
    HStack,
    VStack,
} from '@gluestack-ui/themed';

const Menu = () => {

    // Context de Firebase
    const { menu, obtenerProductos } = useContext(FirebaseContext);

    useEffect(() => {
        obtenerProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <GluestackUIProvider config={config}>
            <Box style={globalStyles.contenedor}>
                <Box py="$1" style={{ backgroundColor: '#FFF' }}>
                    <FlatList
                        data={menu}
                        renderItem={({ item }) => (
                            <Box
                                borderBottomWidth="$1"
                                $base-pl={15}
                                $base-pr={0}
                                $sm-pl="$4"
                                $sm-pr="$5"
                                py="$3"
                            >
                                <HStack space="md">
                                    <Image
                                        size="lg"
                                        borderRadius="$xl"
                                        source={{ uri: item.imagen }}
                                        alt={item.nombre}
                                    />
                                    <VStack>
                                        <Text
                                            color="$coolGray800"
                                            fontWeight="$bold"
                                            $dark-color="$warmGray100"
                                            numberOfLines={1}
                                            maxWidth="80%"
                                        >{item.nombre}</Text>
                                        <Text
                                            color="$coolGray600"
                                            $dark-color="$warmGray200"
                                            numberOfLines={2}
                                            maxWidth="88%"
                                        >{item.descripcion}</Text>
                                        <Text
                                            fontSize="$sm"
                                            fontWeight="$bold"
                                            alignSelf="flex-start"
                                        >S/. {item.precio}</Text>
                                    </VStack>
                                </HStack>
                            </Box>
                        )}
                        keyExtractor={item => item.id}
                    />
                </Box>
            </Box>
        </GluestackUIProvider>
    );
};

export default Menu;
