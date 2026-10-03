import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log('Error storing data', e);
    }
};


export const getItem = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Error retrieving data', e);
    }
};

export const removeItem = async (value) => {
    try {
      await AsyncStorage.removeItem(value);
    } catch (e) {
      console.log('Error removing data', e);
    }
};

export const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log('Error clearing storage', e);
    }
}

