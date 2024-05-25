/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import firebase from '../firebase';
import globalStyles from '../styles/global';
import {
    FormControl,
    Box,
    Stack,
    WarningOutlineIcon,
    Input,
    Button,
    Text,
} from 'native-base';

const EmailLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('Inicio de sesión exitoso!');
        } catch (error) {
            console.error('Error en iniciar sesión', error);
        }
    };

    return (
        <Box alignItems="center">
            <Box w="100%">
                <FormControl isRequired>
                    <Stack mx="4">
                        <FormControl.Label>Correo Electrónico</FormControl.Label>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            placeholder="ejemplo@dominio.com"
                        />
                        <FormControl.Label>Contraseña</FormControl.Label>
                        <Input
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                            secureTextEntry
                            placeholder="&#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867;"
                        />
                        <FormControl.HelperText>
                            *Ingrese su correo y contraseña.
                        </FormControl.HelperText>
                        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            El usuario no existe o la contraseña/correo es incorrecto.
                        </FormControl.ErrorMessage>
                        <Button marginTop={3} onPress={handleLogin} style={globalStyles.boton}>
                            <Text style={globalStyles.botonTexto}> Iniciar Sesión </Text>
                        </Button>
                    </Stack>
                </FormControl>
            </Box>
        </Box>
    );
};

export default EmailLogin;
