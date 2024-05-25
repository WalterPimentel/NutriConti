import React, { useContext, useState } from 'react';
import { Image } from 'react-native';
import globalStyles from '../styles/global';
import PedidoContext from '../context/pedidos/pedidosContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';

import {
    Container,
    VStack,
    HStack,
    Box,
    Card,
    Text,
    ScrollView,
    Button,
    Pressable,
    Heading,
} from 'native-base';

const DetallePedido = () => {

    // Pedido Context
    const { platillo:
        {
            nombre,
            imagen,
            descripcion,
            precio,
            ingredientes,
            informacionNutricional,
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

    const clasificarPlatillo = (informacionNutricional) => {
        if (!informacionNutricional) return ''; // Manejar el caso de datos no disponibles

        const { calories, totalNutrients } = informacionNutricional;
        const { PROCNT, CHOCDF } = totalNutrients;

        const porcentajeCarbohidratos = (CHOCDF.quantity * 4) / calories * 100;
        const porcentajeProteinas = (PROCNT.quantity * 4) / calories * 100;

        let clasificacion = '';
        if (porcentajeCarbohidratos < 45) {
            clasificacion += 'Bajo en carbohidratos';
        } else {
            clasificacion += 'Alto en carbohidratos';
        }
        if (porcentajeProteinas >= 20) {
            if (clasificacion !== '') clasificacion += ' y ';
            clasificacion += 'rico en proteínas.';
        } else {
            if (clasificacion !== '') clasificacion += ' y ';
            clasificacion += 'pobre en proteínas.';
        }

        return clasificacion;
    };

    // Función para mostrar información nutricional
    const mostrarInformacioNutricional = () => {
        if (!informacionNutricional) return null; // Manejar el caso de datos no disponibles

        const { calories, totalNutrients } = informacionNutricional;
        const { PROCNT, FAT, CHOCDF, NA, CHOLE } = totalNutrients;
        const alergenos = informacionNutricional.cautions || []; // Obtener la lista de alérgenos

        const clasificacion = clasificarPlatillo(informacionNutricional);

        return (
            <Box alignItems="center" marginTop={5}>
                <VStack alignItems="center" marginBottom={2}>
                    <Heading>Análisis Nutricional</Heading>
                    <HStack>
                        <Text bold>Calorías: </Text>
                        <Text>{calories} kcal</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Proteínas: </Text>
                        <Text>{PROCNT.quantity.toFixed(1)} {PROCNT.unit}</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Carbohidratos: </Text>
                        <Text>{CHOCDF.quantity.toFixed(1)} {CHOCDF.unit}</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Grasas: </Text>
                        <Text>{FAT.quantity.toFixed(1)} {FAT.unit}</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Sodio: </Text>
                        <Text>{NA.quantity.toFixed(1)} {FAT.unit}</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Colesterol: </Text>
                        <Text>{CHOLE.quantity.toFixed(1)} {FAT.unit}</Text>
                    </HStack>
                    <HStack>
                        <Text bold>Alérgenos: </Text>
                        <Text>{alergenos.join(', ')}</Text>
                    </HStack>
                </VStack>
                <Text
                    textAlign="center"
                    italic
                >*Análisis Nutricional según los ingredientes.</Text>
                <Text
                    textAlign="center"
                    italic
                >*{clasificacion}</Text>
            </Box>
        );
    };

    return (
        <>
            <Container alignItems="center" style={globalStyles.contenedor}>
                <ScrollView>
                    <Box marginBottom={55} style={globalStyles.contenido}>
                        <Heading style={globalStyles.titulo}>{nombre}</Heading>
                        <Card>
                            <VStack>
                                <Box>
                                    <Image
                                        style={globalStyles.imagen}
                                        source={{ uri: imagen }}
                                        alt={nombre}
                                    />
                                    <Text
                                        mt={3}
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
                                    {ingredientes
                                        .slice(0, mostrarTodosIngredientes ? ingredientes.length : cantidadMostrar)
                                        .map((ingrediente, index) => (
                                            <Text textAlign="center" key={index}>{ingrediente}</Text>
                                        ))}
                                    {!mostrarTodosIngredientes && ingredientes.length > cantidadMostrar && (
                                        <Pressable onPress={mostrarMasIngredientes}>
                                            <Text
                                                textAlign="center"
                                                color="blue.600"
                                                textDecorationLine="underline"
                                            ><Icon name="eye" /> Ver más...</Text>
                                        </Pressable>
                                    )}
                                    {mostrarTodosIngredientes && (
                                        <Pressable onPress={mostrarMenosIngredientes}>
                                            <Text
                                                textAlign="center"
                                                color="blue.600"
                                                textDecorationLine="underline"
                                            ><Icon name="eye-low-vision" /> Ver menos...</Text>
                                        </Pressable>
                                    )}
                                    {mostrarInformacioNutricional()}
                                </Box>
                            </VStack>
                        </Card>
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
        </>
    );
};

export default DetallePedido;
