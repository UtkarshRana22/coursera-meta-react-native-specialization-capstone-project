import { StyleSheet } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Categories from '../../Components/Categories';
import FoodItems from '../../Components/FoodItems';
import { useNavigation } from 'expo-router';
import TopHeader from '../../Components/TopHeader';
import Hero from '../../Components/Hero';
import { useLocalSearchParams } from 'expo-router';

export default function Index() {
    const { dbReady } = useLocalSearchParams();
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <TopHeader dbReady={dbReady} />
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Hero />
            <Categories dbReady={dbReady} />
            <FoodItems dbReady={dbReady} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})