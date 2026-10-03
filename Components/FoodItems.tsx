import { Text, View, StyleSheet, Image, TouchableOpacity, SectionList, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import colors from '../constants/colors';
import masterData from '../assets/data/master-data.json';
import { Link, useNavigation } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { FlatList } from 'react-native-gesture-handler';
import useDbStore from '../store/dbStore';

interface Dishes {
  id: number;
  name: string;
  description: string;
  price: number;
  photo: string;
  reference_name: string;
  category_id: number;
}

const FoodItems = (props) => {
  const dishesJSON = masterData.categories.flatMap(category =>
    category.dishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: Number(dish.price),
      photo: dish.photo,
      reference_name: dish.reference_name,
      category_id: Number(category.id)
    }))
  );

  const { dbReady } = props;
  const db = useSQLiteContext();

  const [dishes, setDishes] = useState<Dishes[] | null>(null);
  const [dishesCopy, setDishesCopy] = useState<Dishes[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { categoriesReady, setFoodItemsReady, selectedCategory, searchQuery } = useDbStore();


  useEffect(() => {
    if (!dbReady || !db || !categoriesReady) return;
    let isMounted = true;

    const getDishes = async () => {
      setIsLoading(true);
      try {
        const result = await db.getAllAsync<Dishes>(`SELECT * FROM DISHES`);
        if (isMounted && result && result.length > 0) {
          setDishes(result);
          setDishesCopy(result);
          setFoodItemsReady(true);
        } else if (isMounted && result && result.length === 0) {
          await insertDishes();
        }
      } catch (e) {
        setFoodItemsReady(false);
      } finally {
        setIsLoading(false);
      }
    }

    getDishes();

    return () => {
      isMounted = false;
    };

  }, [dbReady, categoriesReady]);

  useEffect(() => {
    if (!dishesCopy || dishesCopy.length <= 0) return;

    const query = searchQuery.toLowerCase().trim();
    const filteredDishes = dishesCopy.filter(dish => {
      const matchesCategory = selectedCategory === 1 || Number(dish.category_id) === Number(selectedCategory);
      const matchesSearch = query ? dish.name.toLowerCase().includes(query) : true;
      return matchesCategory && matchesSearch;
    });
    setDishes(filteredDishes);
  }, [selectedCategory, searchQuery, dishesCopy]);


  const insertDishes = async () => {
    if (!dishesJSON || dishesJSON.length <= 0) return;
    try {

      await db.execAsync('BEGIN TRANSACTION');

      const stmt = await db.prepareAsync(
        'INSERT INTO DISHES (name, description, price, photo,reference_name, category_id) VALUES (?,?,?,?,?,?)'
      );

      for (const dish of dishesJSON) {
        await stmt.executeAsync([
          dish.name,
          dish.description,
          dish.price,
          dish.photo,
          dish.reference_name,
          dish.category_id
        ]);
      }

      await db.execAsync('COMMIT');

      const result = await db.getAllAsync<Dishes>('SELECT * FROM DISHES');
      if (result.length > 0) {
        setDishes(result);
        setDishesCopy(result);
        setFoodItemsReady(true);
      }
    } catch (e) {
      setFoodItemsReady(false);
      Alert.alert('Error', 'Something went wrong - ' + e.message);
    }
  };


  return (
    <>
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : dishes && dishes.length > 0 ? (
        <FlatList
          style={styles.scrollContainer}
          data={dishes}
          keyExtractor={(item, index) => `${item.id + index}`}
          renderItem={({ item, index }) => (
            <Link href={{
              pathname: '/(modal)/details',
              params: { id: item.id, dishName: item.name, description: item.description, photo: item.photo, price: item.price, reference_name: item.reference_name }
            }} asChild>
              <TouchableOpacity style={styles.viewContainer} key={index}>
                <View style={styles.foodCard}>
                  <Text style={styles.foodTitle}>{item.name}</Text>
                  <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.foodPrice}>$ {item.price}</Text>
                </View>
                <View style={styles.imgContainer}>
                  <Image source={{ uri: item.photo }}
                    style={styles.foodImg} />
                </View>
              </TouchableOpacity>
            </Link>
          )} />
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  sectionHeaderStyle: {
    fontSize: 18,
    color: colors.primary,
    marginTop: -10,
    padding: 5,
    backgroundColor: 'white'
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    height: 170,
    width: '100%',
    backgroundColor: colors.secondaryCream,
    padding: 5,
    borderRadius: 5,
    marginBottom: 5
  },
  imgContainer: {
    padding: 5,
    flex: 1,
    alignItems: 'flex-end',
  },
  foodCard: {
    padding: 5,
    maxWidth: '50%',
    flex: 1
  },
  foodImg: {
    height: 150,
    width: 150,
    resizeMode: 'cover'
  },
  foodTitle: {
    color: colors.secondaryOrange,
    fontSize: 24,
    fontWeight: 'bold'
  },
  foodDescription: {
    fontSize: 15,
    marginTop: 10
  },
  foodPrice: {
    fontSize: 15,
    marginTop: 10,
    color: colors.primary,
    fontWeight: 'bold'
  }
})

export default FoodItems;