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
        <AuthProvider>
            <Stack.Navigator>
            
                <Stack.Screen
                    name='welcome'
                    component={Welcome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='SignIn'
                    component={SignIn}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='SignUp'
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name='MapScreen'
                    component={MapScreen}
                    options={{ headerShown: false }}
                />
                
            </Stack.Navigator>
        </AuthProvider>
    );
}
