import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../../constants/colors';
import useCartStore from '../../../store/cartStore';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';


const Cart = () => {
    const { items, total, products, addProduct, reduceProduct, clearCart } = useCartStore();
    const [order, setOrder] = useState(false);
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    }

    const placeOrder = () => {
        setOrder(true);
        clearCart();
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        );
    }

    const clear = () => {
        clearCart();
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Cart',
            headerTitleStyle: {
                fontSize: 18,
                fontWeight: 'bold',
            },
            headerLeft: () => (
                <TouchableOpacity onPress={() => (navigation.goBack())}>
                    <Ionicons name='arrow-back' size={28} color={colors.primary} />
                </TouchableOpacity>
            )
        });
    }, []);

    return (
        <>
            {
                order ? (
                    <>
                        <ConfettiCannon
                            count={200}
                            origin={{ x: -10, y: 0 }}
                            autoStart={true}
                            fallSpeed={2500}
                        />
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name='checkmark-done-circle-outline' size={48} color={colors.primary} />
                            <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={{ fontSize: 18, color: colors.primary }}>Order Placed Succesfully!</Animated.Text>
                            <TouchableOpacity style={styles.btn} onPress={handleBack}>
                                <Text style={styles.btnTxt}>Home</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : ((!order && !items) ? (

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name='pizza-outline' size={48} color={colors.primary} />
                        <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={{ fontSize: 18, color: colors.primary }}>Wow such a empty cart!</Animated.Text>
                    </View>

                ) : (!order && items) ? (
                    <>
                        <FlatList
                            data={products}
                            keyExtractor={item => (item.id + Math.random() * 100).toString()}
                            ItemSeparatorComponent={() => <View></View>}
                            ListHeaderComponent={() => <View style={{ padding: 10 }}><Text style={styles.headerTxt}>Items in your Cart</Text></View>}
                            ListFooterComponent={() => <View><View style={styles.footer}><Text style={styles.headerTxt}>Subtotal</Text><Text style={styles.headerTxt}>$ {total.toFixed(2).toString()}</Text></View></View>}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.qty}>{item.quantity.toString()}x</Text>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <View style={styles.rightSection}>
                                        <Text style={styles.price}>$ {item.price.toFixed(2).toString()}</Text>
                                        <TouchableOpacity onPress={() => {
                                            reduceProduct(item)
                                        }}>
                                            <Ionicons name='trash' size={24} color={'red'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btn1} onPress={clear}>
                                <Text style={styles.btnTxt}>Clear Cart</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn} onPress={placeOrder}>
                                <Text style={styles.btnTxt}>Order Now</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (<></>))
            }
        </>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: 'white'
    },
    name: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: colors.primary
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 20,
    },
    qty: {
        fontSize: 18,
        fontWeight: '600',
        minWidth: 30,
        textAlign: 'left',
        color: colors.secondaryOrange
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.secondaryDark,
        minWidth: 60,
        textAlign: 'right',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10
    },
    headerTxt: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary
    },
    btnContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%'
    },
    btn: {
        backgroundColor: colors.secondary,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        borderRadius: 8
    },
    btn1: {
        backgroundColor: colors.secondaryOrange,
        padding: 16,
        margin: 8,
        alignItems: 'center',
        borderRadius: 8
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default Cart;