import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../../constants/colors';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import useCartStore, { Product } from '../../../store/cartStore';

const details = () => {

  const { id, dishName, description, photo, price, reference_name } = useLocalSearchParams();
  const product: Product = {
    id: Number(id),
    name: dishName.toString(),
    description: description.toString(),
    photo: photo.toString(),
    price: Number(price),
    quantity: 1,
    reference_name: reference_name.toString()
  }
  const { addProduct } = useCartStore();
  const navigation = useNavigation();
  const addToCart = () => {
    addProduct(product)
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: '',
      headerTintColor: 'red',
      headerTitleStyle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      headerStyle: {
        backgroundColor: 'transparent'
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => (navigation.goBack())}>
          <Ionicons name='arrow-back' size={28} color={'white'} />
        </TouchableOpacity>
      )
    })
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animated.Image entering={FadeInDown.duration(400).delay(300)} source={{ uri: product.photo }} style={styles.img} />
        <View style={styles.foodCard}>
          <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={styles.foodTitle}>{product.name}</Animated.Text>
          <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={styles.foodDescription} numberOfLines={15}>{product.description}</Animated.Text>
          <Animated.Text entering={FadeInDown.duration(500).delay(300)} style={styles.foodPrice}>$ {product.price}</Animated.Text>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={addToCart}>
          <Text style={styles.btnTxt}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  img: {
    height: 360,
    width: '100%',
    resizeMode: 'cover'
  },
  btnContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%'
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 8
  },
  btnTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  foodCard: {
    padding: 10,
    maxWidth: '100%',
    flex: 1
  },
  foodTitle: {
    color: colors.secondaryOrange,
    fontSize: 24,
    fontWeight: 'bold'
  },
  foodDescription: {
    fontSize: 15,
    marginTop: 10,
    textAlign: 'justify'
  },
  foodPrice: {
    fontSize: 15,
    marginTop: 10,
    color: colors.primary,
    fontWeight: 'bold'
  }
})

export default details;