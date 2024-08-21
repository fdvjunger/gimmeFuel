import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
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

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://${strings.ip}:3000/api/postos`, {
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
        alert('Erro ao cadastrar posto');
      }
    } catch (error) {
      console.error('Erro ao cadastrar posto:', error);
      alert('Erro ao cadastrar posto');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <Text style={styles.label}>Latitude:</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Longitude:</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
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
      <Button title="Cadastrar Posto" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default AddPostoScreen;
