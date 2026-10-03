import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItem, Button } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from 'expo-router';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import categoriesData from '../../../assets/data/data.json';
import Ionicons from '@expo/vector-icons/Ionicons';


interface Category {
  id: number,
  name: string,
  checked?: boolean
}

const categories = categoriesData;

const Filter = () => {

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => (navigation.goBack())}>
          <Ionicons name='close-outline' size={28} color={'lightskyblue'} />
        </TouchableOpacity>
      )
    })
  }, []);

  const [fitlerItems, setFilterItems] = useState<Category[]>(categories);
  const clearAll = () => {
    const updatedItems = fitlerItems.map(item => {
      item.checked = false;
      return item;
    });
    setFilterItems(updatedItems);
  }

  const renderItem: ListRenderItem<Category> = ({ item, index }) => (
    <View style={styles.listItemView}>
      <Text style={styles.filterTxt}>{item.name}</Text>
      <BouncyCheckbox
        isChecked={item.checked}
        size={25}
        fillColor="lightskyblue"
        unFillColor="white"
        useBuiltInState={false}
        iconStyle={{ borderColor: "aliceblue", borderRadius: 5, borderWidth: 2 }}
        innerIconStyle={{ borderWidth: 2, borderRadius: 5 }}
        onPress={(isChecked: boolean) => {
          const updatedItems = fitlerItems.map(item => {
            if (item.name === fitlerItems[index].name) {
              item.checked = !isChecked;
            }
            return item;
          });
          setFilterItems(updatedItems);
        }}
      />
    </View>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.headerTxt}>Categories</Text>
      <View>
        <FlatList data={fitlerItems} renderItem={renderItem} />
        <Button color="87CEFA" title="Clear All" onPress={clearAll} />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={() => {
          navigation.goBack()
        }}>
          <Text>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20
  },
  bottomContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    elevation: 10,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  applyButton: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'lightskyblue',
    padding: 16,
    margin: 10,
    borderRadius: 10
  },
  headerTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 20
  },
  listItemView: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  filterTxt: {
    fontSize: 15
  }
});

export default Filter;