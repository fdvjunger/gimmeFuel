import React from 'react';
import { 
        View,
        Text,
        StyleSheet,
        Image,
        TouchableOpacity
     } from 'react-native';

import * as Animatable from 'react-native-animatable';

import { useNavigation } from '@react-navigation/native';

export default function Welcome(){
    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation='bounce'
                    source={require('../../assets/logo.png')}
                    style = {{width: "100%"}}
                    resizeMode='contain'
                />
            </View>

            <Animatable.View delay={600} animation='fadeInUp' style={styles.containerForm}>
                <Text style={styles.title}>Bem-vindo ao GimmeFuel!</Text>
                <Text style={styles.text}>Encontre os postos de combustível mais próximos e com os melhores preços. Personalize sua busca, escolha o combustível, e nós faremos o resto para você economizar na hora de abastecer.</Text>

                <TouchableOpacity 
                    onPress={()=>navigation.navigate('SignIn')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#38A69D'
    },
    containerLogo:{
        flex: 2,
        backgroundColor: '#38A69D',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerForm:{
        flex: 1,
        backgroundColor: '#FFF',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        color: '#a1a1a1'
    },
    button:{
        position: 'absolute',
        backgroundColor:'#38A69D',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText:{
        fontSize:18,
        color: '#FFF',
        fontWeight: 'bold'
    }

});