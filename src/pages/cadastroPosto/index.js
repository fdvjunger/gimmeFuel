import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/src/context/authcontext';
import strings from '@/src/utils/strings';

const AddPostoScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [endereco, setEndereco] = useState('');
  const [precosCombustiveis, setPrecosCombustiveis] = useState({
    gasolina: '',
    etanol: '',
    diesel: '',
    gnv: ''
  });
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da permissão de localização para preencher os campos automaticamente.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());

      // Chama o endpoint para verificar se já existe um posto próximo
      try {
        const response = await fetch(`${strings.ip}/api/postos/proximidade/${location.coords.latitude}/${location.coords.longitude}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const postos = await response.json();
          if (postos.length > 0) {
            // Preenche os campos com os dados do posto encontrado
            const posto = postos[0];
            console.log('Dados do posto encontrado:', posto); // Adicionado para verificar a estrutura dos dados
            setNome(posto.nome || '');
            setEndereco(posto.endereco || '');
            setPrecosCombustiveis({
              gasolina: posto.precosCombustiveis?.gasolina !== null ? posto.precosCombustiveis.gasolina.toString() : '',
              etanol: posto.precosCombustiveis?.etanol !== null ? posto.precosCombustiveis.etanol.toString() : '',
              diesel: posto.precosCombustiveis?.diesel !== null ? posto.precosCombustiveis.diesel.toString() : '',
              gnv: posto.precosCombustiveis?.gnv !== null ? posto.precosCombustiveis.gnv.toString() : ''
            });
          } else {
            console.log('Nenhum posto encontrado.');
          }
        } else {
          const error = await response.text();
          console.error('Erro ao buscar postos próximos:', error);
          Alert.alert('Erro ao buscar postos próximos', error);
        }
      } catch (error) {
        console.error('Erro ao buscar postos próximos:', error);
        Alert.alert('Erro ao buscar postos próximos', 'Ocorreu um erro ao tentar buscar postos próximos. Verifique sua conexão e tente novamente.');
      }
    })();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${strings.ip}/api/postos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          endereco,
          precosCombustiveis
        })
      });

      if (response.ok) {
        alert('Posto cadastrado com sucesso!');
        navigation.goBack(); // Volta para a tela anterior
      } else {
        const error = await response.text();
        alert(`Erro ao cadastrar posto: ${error}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar posto:', error);
      alert('Erro ao cadastrar posto');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <Text style={styles.label}>Latitude:</Text>
       
        <Text style={styles.label}>Endereço:</Text>
        <TextInput
          style={styles.input}
          value={endereco}
          onChangeText={setEndereco}
        />
        <Text style={styles.label}>Preço Gasolina:</Text>
        <TextInput
          style={styles.input}
          value={precosCombustiveis.gasolina}
          onChangeText={(text) => setPrecosCombustiveis({ ...precosCombustiveis, gasolina: text })}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Preço Etanol:</Text>
        <TextInput
          style={styles.input}
          value={precosCombustiveis.etanol}
          onChangeText={(text) => setPrecosCombustiveis({ ...precosCombustiveis, etanol: text })}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Preço Diesel:</Text>
        <TextInput
          style={styles.input}
          value={precosCombustiveis.diesel}
          onChangeText={(text) => setPrecosCombustiveis({ ...precosCombustiveis, diesel: text })}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Preço GNV:</Text>
        <TextInput
          style={styles.input}
          value={precosCombustiveis.gnv}
          onChangeText={(text) => setPrecosCombustiveis({ ...precosCombustiveis, gnv: text })}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.buttonRegister} onPress={handleSubmit}>
          <Text style={styles.registerText}>Cadastrar Posto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
  },
  buttonRegister: {
    marginTop: 14,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  registerText: {
    color: '#fff',
  },
});

export default AddPostoScreen;
