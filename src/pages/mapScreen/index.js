import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '@/src/context/authcontext';
import Slider from '@react-native-community/slider';
import strings from '@/src/utils/strings';

const MapScreen = ({ navigation }) => {
  const { token } = useAuth(); // Obtém o token do contexto
  const [region, setRegion] = useState(null); // Inicializa como null
  const [postos, setPostos] = useState([]); // Inicialize como array vazio
  const [raio, setRaio] = useState(5); // Raio inicial de 5 km

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Chama a função fetchPostos apenas quando a localização estiver disponível
      fetchPostos(location.coords.latitude, location.coords.longitude, raio);
    };

    getCurrentLocation();
  }, []); // Apenas executa uma vez quando o componente é montado

  useEffect(() => {
    if (region && region.latitude && region.longitude && token) {
      fetchPostos(region.latitude, region.longitude, raio);
    }
  }, [raio, region, token]); // Adiciona dependências necessárias para re-renderização

  const fetchPostos = async (latitude, longitude, raio) => {
    try {
      const response = await fetch(`http://${strings.ip}:3000/api/postos/proximos?latitude=${latitude}&longitude=${longitude}&raio=${raio}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Adicionando o token Bearer
        },
      });
      const data = await response.json();

      console.log(data);

      // Verifique se `data.postos` é um array
      if (Array.isArray(data.postos)) {
        setPostos(data.postos);
      } else {
        console.error('Expected an array but received:', data);
        setPostos([]);
      }
    } catch (error) {
      console.error('Error fetching postos:', error);
      setPostos([]);
    }
  };

  if (!region) {
    return <View style={styles.container}><Text>Carregando...</Text></View>; // Mostra uma mensagem de carregamento enquanto a localização está sendo obtida
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Usa o estado `region` para definir a região do mapa
        showsUserLocation={true} 
        userLocationAnnotationTitle="Você está aqui"
      >
        {postos.map((posto, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: posto.latitude,
              longitude: posto.longitude
            }}
            title={posto.nome}
            description={`Gasolina: ${posto.precosCombustiveis.gasolina} Etanol: ${posto.precosCombustiveis.etanol} Diesel: ${posto.precosCombustiveis.diesel} GNV: ${posto.precosCombustiveis.gnv}`}
          />
        ))}
      </MapView>
      <View style={styles.sliderContainer}>
        <Text>Raio: {raio} km</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={raio}
          onValueChange={(value) => setRaio(value)}
        />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPosto')}>
          <Text style={styles.buttonText}>Novo Posto</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60, // Ajuste para o espaço do slider
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  slider: {
    width: '90%',
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
});

export default MapScreen;
