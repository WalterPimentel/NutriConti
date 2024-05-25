import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import globalStyles from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import firebase from '../firebase';
import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/FontAwesome6';
import { DrawerLayout } from 'react-native-gesture-handler';

import {
    Container,
    Text,
    Button,
    Box,
    Heading,
} from 'native-base';

const screenWidth = StyleSheet.flatten(globalStyles.contenedor).maxWidth;
const paddingPercentage = parseFloat(StyleSheet.flatten(globalStyles.contenido).marginHorizontal) / 100; // Obtener el porcentaje
const paddingHorizontal = screenWidth * paddingPercentage; // Calcular el padding
const contentWidth = screenWidth - 2 * paddingHorizontal; // Ancho menos padding

const NuevaOrden = () => {

    const version = DeviceInfo.getVersion();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const drawerRef = useRef(null);
    const navigation = useNavigation();

    const barraMenu = useCallback(() => (
        <Button
            backgroundColor={'#FFDA00'}
            endIcon={
                <Icon
                    name="bars"
                    size={20}
                    color="#000"
                />
            }
            onPress={() => {
                if (isDrawerOpen) {
                    drawerRef.current.closeDrawer();
                } else {
                    drawerRef.current.openDrawer();
                }
                setIsDrawerOpen(!isDrawerOpen);
            }}
        />
    ), [isDrawerOpen]);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: barraMenu,
        });
    }, [navigation, barraMenu]);

    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error(error);
        }
    };

    const renderNavigationView = () => (
        <View>
            <Box backgroundColor={'#fff'} height={'full'}>
                <Heading>Usuario</Heading>
                <Box>

                </Box>
                <Button
                    style={globalStyles.boton}
                    onPress={signOut}
                >
                    <Text style={globalStyles.botonTexto}>Cerrar Sesión</Text>
                </Button>
                <Text>Versión {version}</Text>
            </Box>
        </View>
    );

    return (
        <DrawerLayout
            ref={drawerRef}
            drawerWidth={300}
            drawerPosition="left"
            renderNavigationView={renderNavigationView}
        >
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
        </DrawerLayout>
    );
};

const styles = StyleSheet.create({
    contenido: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

export default NuevaOrden;
