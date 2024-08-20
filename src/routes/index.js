import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Welcome from '../pages/welcome';
import SignIn from '../pages/signIn';
import SignUp from '../pages/signUp';
import MapScreen from '../pages/mapScreen';
import { AuthProvider } from '../context/authcontext'; // Importação corrigida

const Stack = createNativeStackNavigator();

export default function RouterStore() {
    return (
            <Stack.Navigator>
            
                <Stack.Screen
                    name='MapScreen'
                    component={MapScreen}
                    options={{ headerShown: false }}
                />
                
            </Stack.Navigator>
    );
}
