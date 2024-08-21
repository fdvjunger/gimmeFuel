import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Location from 'expo-location';
import { useAuth } from '../../context/authcontext'; 

import strings from '../../utils/strings';


export default function SignIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useAuth(); // Usar o contexto para definir o token

    async function getCurrentLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada', 'Precisamos da sua localização para encontrar postos próximos.');
            return null;
        }

        let location = await Location.getCurrentPositionAsync({});
        return location.coords;
    }

    const handleLogin = async () => {
        console.log('Botão Acessar foi clicado');
        try {
            const response = await fetch('http://'+strings.ip+':3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                Alert.alert('Login bem-sucedido', `Bem-vindo ${data.token}`);
                
                // Armazenar o token no contexto
                setToken(data.token);

                const location = await getCurrentLocation();
                if (location) {
                    console.log('entrou if')
                    console.log(`http://${strings.ip}:3000/api/postos/proximos?latitude=${location.latitude}&longitude=${location.longitude}&raio=5`);
                    const postosResponse = await fetch(`http://${strings.ip}:3000/api/postos/proximos?latitude=${location.latitude}&longitude=${location.longitude}&raio=5`, {
                        headers: {
                            'Authorization': `Bearer ${data.token}` 
                        }
                    });
                    console.log('executou fetch')
                    const postosData = await postosResponse.json();

                    navigation.navigate('MapScreen', { postos: postosData.postos });
                }
            } else {
                Alert.alert('Erro de login', data.message || 'Ocorreu um erro durante o login');
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível conectar ao servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View 
                animation={'fadeInLeft'}
                delay={500} 
                style={styles.containerHeader}
            >
                <Text style={styles.message}>Bem-vindo(a)</Text>
            </Animatable.View>

            <Animatable.View
                animation={'fadeInUp'} style={styles.containerForm}
            >
                <Text style={styles.title}>Email:</Text>
                <TextInput 
                    placeholder='Digite seu e-mail...' 
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.title}>Senha:</Text>
                <TextInput 
                    placeholder='Digite sua senha...' 
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.registerText}>Cadastrar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#36A69D'
    },
    containerHeader:{
        marginTop:'14%',
        marginBottom:'8%',
        paddingStart: '5%'
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerForm:{
        backgroundColor:'#FFF',
        flex: 1,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        paddingStart: '5%',
        paddingEnd:'5%'
    },
    title:{
        fontSize:20,
        marginTop:28
    },
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom:12,
        fontSize: 16
    },
    button:{
        backgroundColor: '#36A69D',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#a1a1a1'
    }
});
