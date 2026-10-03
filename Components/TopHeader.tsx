import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet from './BottomSheet';
import { Link } from 'expo-router';
import useCartStore from '../store/cartStore';
import colors from '../constants/colors';

const CartButton = () => {
    const { items } = useCartStore();
    return (
        <Link href={'/(modal)/cart'} asChild>
            <TouchableOpacity style={style.optionsBtn}>
                {items > 0 &&
                    <>
                        <Text style={style.cartItem}>{items}</Text>
                        <Ionicons name="cart" size={24} color={colors.secondary} />
                    </>
                }
                {items <= 0 &&
                    <Ionicons name="cart-outline" size={21} color={colors.primary} />
                }
            </TouchableOpacity>
        </Link>
    );
}

const TopHeader = (props) => {
    const { dbReady } = props;
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const openModal = () => {
        bottomSheetRef.current?.present();
    };

    return (
        <SafeAreaView style={style.safeContainer}>
            <BottomSheet ref={bottomSheetRef} />
            <View style={style.container}>
                <TouchableOpacity onPress={openModal}>
                    <Image source={require('../assets/bike.png')} style={style.bikeImg} />
                </TouchableOpacity>

                <TouchableOpacity style={style.deliveryContainer} onPress={openModal}>
                    <Text style={style.deliveryTitle}>Delivery • Now</Text>
                    <View style={style.locationContainer}>
                        <Text style={style.locationTxt}>Pune, India</Text>
                        <Ionicons name="chevron-down" size={21} color={'lightskyblue'} />
                    </View>
                </TouchableOpacity>

                <CartButton />

                <Link href={{
                    pathname: "/(modal)/account",
                    params: { dbReadyParam: dbReady }
                }} asChild>
                    <TouchableOpacity style={{ marginRight: 10 }}>
                        {
                            dbReady ? <Ionicons name="person-outline" size={21} color={'lightskyblue'} /> : <Ionicons name="person-outline" size={21} color={'grey'} />
                        }
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    )
}

export default TopHeader;

const style = StyleSheet.create({
    safeContainer: {
        backgroundColor: 'white'
    },
    container: {
        height: 60,
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    deliveryContainer: {
        flex: 1
    },
    deliveryTitle: {
        fontSize: 14,
        color: 'grey'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    locationTxt: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    bikeImg: {
        height: 30,
        width: 30
    },
    profileBtn: {
        backgroundColor: 'azure',
        padding: 10,
        borderRadius: 50
    },
    searchContainer: {
        height: 60
    },
    searchSection: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10,
        gap: 10
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: 'aliceblue',
        borderRadius: 10,
        borderColor: 'lightskyblue',
        borderWidth: 1
    },
    optionsBtn: {
        backgroundColor: 'azure',
        padding: 10,
        borderRadius: 50
    },
    searchInput: {
        padding: 10,
        flex: 1,
    },
    cartItem: {
        position: 'absolute',
        padding: 19,
        marginTop: -17,
        fontSize: 11,
        zIndex: 99
    },
    avatar: {
        marginTop: 10,
        height: 40,
        width: 40,
        borderRadius: 50,
        resizeMode: 'cover',
        borderWidth: 0.3,
        backgroundColor: 'white',
        borderColor: colors.primary
    }
});