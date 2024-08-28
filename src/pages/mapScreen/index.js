import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '@/src/context/authcontext';
import Slider from '@react-native-community/slider';
import strings from '@/src/utils/strings';

// Importe o ícone personalizado
import CustomIcon from '../../assets/Asset 17.png';

const MapScreen = ({ navigation }) => {
  const { token } = useAuth();
  const [region, setRegion] = useState(null);
  const [postos, setPostos] = useState([]);
  const [raio, setRaio] = useState(5);
  const [combustivelSelecionado, setCombustivelSelecionado] = useState(null);

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

      fetchPostos(location.coords.latitude, location.coords.longitude, raio, combustivelSelecionado);
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (region && region.latitude && region.longitude && token) {
      fetchPostos(region.latitude, region.longitude, raio, combustivelSelecionado);
    }
  }, [raio, region, token, combustivelSelecionado]);

  const fetchPostos = async (latitude, longitude, raio, combustivel) => {
    try {
      console.log(`Fetching postos with latitude: ${latitude}, longitude: ${longitude}, raio: ${raio}, combustivel: ${combustivel}`);
      const response = await fetch(`${strings.ip}/api/postos/proximos?latitude=${latitude}&longitude=${longitude}&raio=${raio}&combustivel=${combustivel}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      console.log('Data received:', data);

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

  const findCheapestPosto = (postos, combustivel) => {
    if (!postos || postos.length === 0 || !combustivel) return null;
    return postos.reduce((cheapest, current) => {
      if (cheapest === null) return current;
      return current.precosCombustiveis[combustivel] < cheapest.precosCombustiveis[combustivel] ? current : cheapest;
    }, null);
  };

  const cheapestPosto = findCheapestPosto(postos, combustivelSelecionado);

  const handleCombustivelClick = (combustivel) => {
    console.log(`Selected fuel: ${combustivel}`);
    setCombustivelSelecionado(combustivel);
  };

  if (!region) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
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
              image={posto._id === cheapestPosto?._id ? CustomIcon : null}
            />
          ))}
        </MapView>
      </View>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleCombustivelClick('gasolina')}>
            <Text style={styles.buttonText}>Gasolina</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleCombustivelClick('etanol')}>
            <Text style={styles.buttonText}>Etanol</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleCombustivelClick('diesel')}>
            <Text style={styles.buttonText}>Diesel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleCombustivelClick('gnv')}>
            <Text style={styles.buttonText}>GNV</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddPosto')}>
          <Text style={styles.buttonText}>Cadastrar/Editar Posto</Text>
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
    flex: 1,
  },
  mapContainer: {
    flex: 4,
  },
  sliderContainer: {
    flex: 1,
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  slider: {
    width: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#36A69D',
    width: '45%',
    borderRadius: 4,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;
