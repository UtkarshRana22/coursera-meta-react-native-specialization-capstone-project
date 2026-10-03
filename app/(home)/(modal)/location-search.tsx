import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";
import Ionicons from '@expo/vector-icons/Ionicons';

const LocationSearch = () => {
    const [location, setLocation] = useState(
        {
            latitude: 18.524609,
            longitude: 73.878624,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    );
    const navigation = useNavigation();
    const handleBack = () => {
        navigation.goBack();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name='close-outline' size={28} color={'lightskyblue'} />
                </TouchableOpacity>
            )
        })
    }, []);

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                placeholder='Search'
                fetchDetails={true}
                onPress={(data, details) => {
                    const point = details.geometry.location
                    if (!point) { return };
                    setLocation({
                        ...location,
                        latitude: point.lat,
                        longitude: point.lng
                    });
                }}
                query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                    language: 'en',
                }}
                styles={{
                    container: {
                        flex: 0
                    },
                    textInput: {
                        backgroundColor: 'whitesmoke',
                        borderRadius: 10
                    },
                    textInputContainer: {
                        backgroundColor: 'white',
                        padding: 4,
                    }
                }}
            />
            <MapView showsUserLocation={true} style={styles.map}
                region={location}
            ></MapView>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={handleBack}>
                    <Text style={styles.btnTxt}>Confirm Location</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        flex: 1
    },
    btnContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%'
    },
    btn: {
        backgroundColor: 'lightskyblue',
        padding: 16,
        margin: 16,
        alignItems: 'center',
        borderRadius: 8
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default LocationSearch;