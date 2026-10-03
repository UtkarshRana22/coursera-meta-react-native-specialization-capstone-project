import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react';
import { TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../constants/colors';
import useDbStore from '../store/dbStore';

const Hero = () => {
    const { searchQuery, setSearchQuery } = useDbStore();
    return (
        <View style={styles.titleContainer}>
            <View style={styles.topRow}>
            <View style={styles.txtContainer}>
                <Text style={styles.appTitleTxt}>Little Lemon</Text>
                <Text style={styles.appTitleSubTxt}>Pune</Text>
                <Text style={styles.appTitleIntro} numberOfLines={4}>
                    We are family owned {"\n"}Mediterranean restaurant,
                    {"\n"}focused on traditional {"\n"}recipes served {"\n"}with a modern twist.
                </Text>
            </View>
            <View>
                <Image source={require('../assets/img/hero.png')} style={styles.heroImg} />
            </View>
            </View>
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={21} color={'#424242'} />
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholder='Search Dishes'
                />
                <Ionicons name="close-outline" size={24} color={'#424242'} onPress={() => setSearchQuery('')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        backgroundColor: colors.primary,
        paddingBottom: 12,
        paddingHorizontal: 5
    },
    topRow: {
        height: 190,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 40
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondaryGrey,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 5
    },
    searchInput: {
        flex: 1,
        padding: 10
    },
    txtContainer: {
        padding: 5
    },
    appTitleTxt: {
        marginTop: 10,
        padding: 5,
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.secondary
    },
    appTitleSubTxt: {
        padding: 5,
        fontSize: 21,
        fontWeight: 'bold',
        color: colors.secondaryGrey
    },
    appTitleIntro: {
        padding: 5,
        fontSize: 15,
        color: colors.secondaryGrey
    },
    heroImg: {
        height: 150,
        width: 150,
        resizeMode: 'cover'
    }
})

export default Hero;