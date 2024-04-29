/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    Container,
    Text,
    NativeBaseProvider,
    Button,
    HStack,
    Center,
} from 'native-base';

const NuevaOrden = () => {

    const navigation = useNavigation();

    return (
        <NativeBaseProvider>
            <Container style={globalStyles.contenedor}>
                <View style={[globalStyles.contenido, styles.contenido]}>
                    {/* <HStack space={3} justifyContent="center">
                        <Center h="40" w="20" />
                        <Center h="40" w="20" />
                        <Center h="40" w="20" />
                        <Center h="40" w="20" />
                        <Center h="40" w="20" />
                    </HStack> */}
                    <Button
                        style={globalStyles.boton}
                        onPress={() => { navigation.navigate('Menu')}}
                        rounded="full"
                        width="100%"
                        textAlign="center"
                        endIcon={
                            <Icon
                                name="circle-plus"
                                size={20}
                                color="#000"
                            />
                        }
                    >
                        <Text
                            style={globalStyles.botonTexto}
                        >Crear Nueva Orden</Text>
                    </Button>
                </View>
            </Container>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default NuevaOrden;
