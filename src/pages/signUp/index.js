import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

import strings from '../../utils/strings';

export default function SignUp({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleConfirmPassword = (value) => {
        setConfirmPassword(value);
        setPasswordMatch(value === password);
    };

    const handleRegister = async () => {
        if (passwordMatch) {
            try {
                const response = await fetch('http://'+strings.ip+':3000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                });

                const data = await response.json();
                if (response.status === 201) {
                    Alert.alert('Sucesso', 'Usuário registrado com sucesso');
                    navigation.navigate('SignIn'); 
                } else {
                    Alert.alert('Erro', data.error || 'Ocorreu um erro ao registrar');
                }
            } catch (error) {
                Alert.alert('Erro', 'Erro na comunicação com o servidor');
                console.log(error);
            }
        } else {
            Alert.alert('Erro', 'As senhas não coincidem');
        }
    };

    return (
        <View style={styles.container}>
            <Animatable.View 
                animation={'fadeInLeft'} 
                delay={500} 
                style={styles.containerHeader}>
                <Text style={styles.message}>Cadastre-se</Text>
            </Animatable.View>

            <Animatable.View 
                animation={'fadeInUp'} 
                style={styles.containerForm}>
                
                <Text style={styles.title}>Nome:</Text>
                <TextInput 
                    placeholder='Digite seu nome...' 
                    style={styles.input}
                    onChangeText={setUsername}
                />

                <Text style={styles.title}>Email:</Text>
                <TextInput 
                    placeholder='Digite seu e-mail...' 
                    style={styles.input} 
                    onChangeText={setEmail}
                />

                <Text style={styles.title}>Senha:</Text>
                <TextInput 
                    placeholder='Digite sua senha...' 
                    style={styles.input} 
                    secureTextEntry
                    onChangeText={(value) => {
                        setPassword(value);
                        setPasswordMatch(value === confirmPassword);
                    }}
                />

                <Text style={styles.title}>Confirmar Senha:</Text>
                <TextInput 
                    placeholder='Confirme sua senha...' 
                    style={[
                        styles.input,
                        !passwordMatch && { borderColor: 'red', borderWidth: 1 }
                    ]}
                    secureTextEntry
                    onChangeText={handleConfirmPassword}
                />
                {!passwordMatch && (
                    <Text style={styles.errorText}>As senhas não coincidem</Text>
                )}

                <TouchableOpacity 
                    style={styles.button}
                    disabled={!passwordMatch}
                    onPress={handleRegister}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.buttonBack}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#36A69D',
    },
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    },
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    input: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#36A69D',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonBack: {
        marginTop: 14,
        alignSelf: 'center',
    },
    backText: {
        color: '#a1a1a1',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 14,
    },
});
