import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from './firebase';
import { NativeBaseProvider, Button } from 'native-base';

import NuevaOrden from './views/NuevaOrden';
import Menu from './views/Menu';
import DetallePlatillo from './views/DetallePlatillo';
import FormularioPlatillo from './views/FormularioPlatillo';
import ResumenPedido from './views/ResumenPedido';
import ProgresoPedido from './views/ProgresoPedido';
import Login from './views/Login';

// Components
import BotonResumen from './components/ui/BotonResumen';

// Importar state de context
import FirebaseState from './context/firebase/firebaseState';
import PedidoState from './context/pedidos/pedidosState';
import { isNull } from 'lodash';

const Stack = createStackNavigator();

const App = () => {

  const [initializing, setInitializing] = useState(true);
  const drawerRef = useRef(null);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  const barraMenu = () => (
    <Button
      onPress={() => drawerRef.current.openDrawer()}
    />
  );

  return (
    <>
      <FirebaseState>
        <PedidoState>
          <NavigationContainer>
            <NativeBaseProvider>
              <Stack.Navigator
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#FFDA00',
                  },
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerTitleAlign: 'center',
                  headerTintColor: '#000',
                }}
              >
                {user ? (
                  <>
                    <Stack.Screen
                      name="NuevaOrden"
                      component={NuevaOrden}
                      options={{
                        title: 'NutriConti',
                        headerLeft: barraMenu,
                      }}
                    />
                    <Stack.Screen
                      name="Menu"
                      component={Menu}
                      options={{
                        title: 'Nuestro Menú',
                        headerRight: props => <BotonResumen />
                      }}
                    />
                    <Stack.Screen
                      name="DetallePlatillo"
                      component={DetallePlatillo}
                      options={{
                        title: 'Detalle Platillo',
                      }}
                    />
                    <Stack.Screen
                      name="FormularioPlatillo"
                      component={FormularioPlatillo}
                      options={{
                        title: 'Ordenar Platillo',
                      }}
                    />
                    <Stack.Screen
                      name="ResumenPedido"
                      component={ResumenPedido}
                      options={{
                        title: 'Resumen Pedido',
                      }}
                    />
                    <Stack.Screen
                      name="ProgresoPedido"
                      component={ProgresoPedido}
                      options={{
                        title: 'Progreso de Pedido',
                        headerLeft: isNull,
                      }}
                    />
                  </>
                ) : (
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      title: 'NutriConti',
                    }}
                  />
                )}
              </Stack.Navigator>
            </NativeBaseProvider>
          </NavigationContainer>
        </PedidoState>
      </FirebaseState>
    </>
  );
};
export default App;
