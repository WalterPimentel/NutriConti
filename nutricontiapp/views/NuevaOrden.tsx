/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    Container,
    Text,
    Button,
} from 'native-base';

const screenWidth = StyleSheet.flatten(globalStyles.contenedor).maxWidth;
const paddingPercentage = parseFloat(StyleSheet.flatten(globalStyles.contenido).marginHorizontal) / 100; // Obtener el porcentaje
const paddingHorizontal = screenWidth * paddingPercentage; // Calcular el padding
const contentWidth = screenWidth - 2 * paddingHorizontal; // Ancho menos padding

const NuevaOrden = () => {

    const navigation = useNavigation();

    return (
        <Container style={globalStyles.contenedor}>
            <View style={[globalStyles.contenido, styles.contenido]}>
                <Button
                    style={globalStyles.boton}
                    w={contentWidth}
                    rounded="full"
                    onPress={() => { navigation.navigate('Menu'); }}
                    endIcon={
                        <Icon
                            name="circle-plus"
                            size={15}
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
    );
};

const styles = StyleSheet.create({
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default NuevaOrden;
