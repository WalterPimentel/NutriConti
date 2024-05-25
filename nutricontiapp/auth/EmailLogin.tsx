import React, { useState } from 'react';
import firebase from '../firebase';
import globalStyles from '../styles/global';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    FormControl,
    Box,
    Stack,
    WarningOutlineIcon,
    Input,
    Button,
    Text,
    Divider,
    Modal,
} from 'native-base';

const EmailLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const validationSchema = yup.object()
        .shape({
            nombres: yup.string()
                .required('Este campo es requerido.')
                .min(3, 'Debe haber al menos 3 caracteres.')
                .matches(/^[a-zA-Z]+$/, 'Los Nombres solo deben contener letras.'),
            apellidos: yup.string()
                .required('Este campo es requerido.')
                .min(3, 'Debe haber al menos 3 caracteres.')
                .matches(/^[a-zA-Z]+$/, 'Los Apellidos solo deben contener letras.'),
            dni: yup.string()
                .required('Este campo es requerido.')
                .matches(/^\d{8}$/, 'El DNI no es válido.'),
            numero: yup.string()
                .required('Este campo es requerido.')
                .matches(/^9\d{8}$/, 'El Número no es válido.'),
            correo: yup.string()
                .required('Este campo es requerido.')
                .email('El Correo debe ser verídico.')
                .matches(/@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/, 'El Correo no es válido.'),
            password: yup.string()
                .required('Este campo es requerido.')
                .min(6, 'La Contraseña debe tener al menos 6 caracteres.'),
            confirmarPassword: yup.string()
                .required('Este campo es requerido.')
                .oneOf([yup.ref('password'), ''], 'Las Contraseñas no coinciden.'),
        });

    const mostrarModal = () => {
        setShowModal(true);
    };

    const handleLogin = async () => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Error en EmailLogin: ', error);
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
                        <Divider my={3} />
                        <Button backgroundColor={'emerald.400'} onPress={mostrarModal}>
                            <Text style={globalStyles.botonTexto}> Registrarse </Text>
                        </Button>
                    </Stack>
                </FormControl>
            </Box>

            <Formik
                initialValues={{ nombres: '', apellidos: '', dni: '', numero: '', correo: '', password: '', confirmarPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const perfil = 'https://firebasestorage.googleapis.com/v0/b/nutriconti-429d5.appspot.com/o/assets%2F5f404cb82ee5ee52ce0261c6_33497.png?alt=media&token=def284a8-e7e4-4457-90db-4a55340f28fb';
                    try {
                        const userCredential = await firebase.auth().createUserWithEmailAndPassword(values.correo, values.password);
                        const user = userCredential.user;

                        if (user) {
                            await firebase.db.collection('usuarios').doc(user.uid).set({
                                nombres: values.nombres,
                                apellidos: values.apellidos,
                                dni: values.dni,
                                numero: values.numero,
                                email: values.correo,
                                perfil: perfil,
                            });
                            console.log('Usuario registrado correctamente');
                        }
                    } catch (error) {
                        if (typeof error === 'object' && error !== null && 'code' in error) {
                            if (error.code === 'auth/email-already-in-use') {
                                console.log('El correo ya se encuentra registrado.');
                            } else {
                                console.error('Error en Registro: ', error);
                            }
                        }
                    }
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header>Registro</Modal.Header>
                            <Modal.Body>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.nombres && !!touched.nombres}
                                >
                                    <FormControl.Label>Nombres</FormControl.Label>
                                    <Input
                                        placeholder="Nombres"
                                        onChangeText={handleChange('nombres')}
                                        onBlur={handleBlur('nombres')}
                                        value={values.nombres}
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.nombres}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.apellidos && !!touched.apellidos}
                                >
                                    <FormControl.Label>Apellidos</FormControl.Label>
                                    <Input
                                        placeholder="Apellidos"
                                        onChangeText={handleChange('apellidos')}
                                        onBlur={handleBlur('apellidos')}
                                        value={values.apellidos}
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.apellidos}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.dni && !!touched.dni}
                                >
                                    <FormControl.Label>DNI</FormControl.Label>
                                    <Input placeholder="DNI"
                                        keyboardType="number-pad"
                                        onChangeText={handleChange('dni')}
                                        onBlur={handleBlur('dni')}
                                        value={values.dni}
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.dni}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.numero && !!touched.numero}
                                >
                                    <FormControl.Label>Número</FormControl.Label>
                                    <Input
                                        placeholder="987654321"
                                        keyboardType="number-pad"
                                        onChangeText={handleChange('numero')}
                                        onBlur={handleBlur('numero')}
                                        value={values.numero}
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.numero}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.correo && !!touched.correo}
                                >
                                    <FormControl.Label>Correo</FormControl.Label>
                                    <Input
                                        placeholder="ejemplo@dominio.com"
                                        onChangeText={handleChange('correo')}
                                        onBlur={handleBlur('correo')}
                                        value={values.correo}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.correo}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.password && !!touched.password}
                                >
                                    <FormControl.Label>Contraseña</FormControl.Label>
                                    <Input
                                        placeholder="&#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867;"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        autoCapitalize="none"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>
                                </FormControl>
                                <FormControl
                                    isRequired
                                    isInvalid={!!errors.confirmarPassword && !!touched.confirmarPassword}
                                >
                                    <FormControl.Label>Confirmar Contraseña</FormControl.Label>
                                    <Input
                                        placeholder="&#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867; &#5867;"
                                        secureTextEntry
                                        onChangeText={handleChange('confirmarPassword')}
                                        onBlur={handleBlur('confirmarPassword')}
                                        value={values.confirmarPassword}
                                        autoCapitalize="none"
                                    />
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.confirmarPassword}</FormControl.ErrorMessage>
                                </FormControl >
                            </Modal.Body >
                            <Modal.Footer>
                                <Button backgroundColor={'emerald.400'} onPress={() => handleSubmit()}>
                                    <Text style={globalStyles.botonTexto}>Registrar</Text>
                                </Button>
                            </Modal.Footer>
                        </Modal.Content >
                    </Modal >
                )}
            </Formik >
        </Box >
    );
};

export default EmailLogin;
