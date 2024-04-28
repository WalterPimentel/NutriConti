/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { config } from '@gluestack-ui/config';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';

import {
    GluestackUIProvider,
    Text,
    Button,
    ButtonText,
    ButtonIcon,
    AddIcon,
    Box,
} from '@gluestack-ui/themed';

const NuevaOrden = () => {

    const navigation = useNavigation();

    return (
        <GluestackUIProvider
            config={config}
        >
            <Box
                style={globalStyles.contenedor}
            >
                <View
                    style={[globalStyles.contenido, styles.contenido]}
                >
                    <Button
                        style={globalStyles.boton}
                        borderRadius="$full"
                        onPress={() => navigation.navigate('Menu') }
                    >
                        <ButtonText
                            style={globalStyles.botonTexto}
                        >Nueva Orden</ButtonText>
                        <ButtonIcon
                            style={globalStyles.botonIcono}
                            as={AddIcon}
                        />
                    </Button>
                </View>
            </Box>
        </GluestackUIProvider>
    );
};

const styles = StyleSheet.create({
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default NuevaOrden;
