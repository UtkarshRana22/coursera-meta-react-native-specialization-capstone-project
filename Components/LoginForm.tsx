import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useState, useLayoutEffect, useEffect } from 'react'
import colors from '../constants/colors'
import { useNavigation } from 'expo-router';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useDbStore from '../store/dbStore';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSQLiteContext } from 'expo-sqlite';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

interface formData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  image: string;
}

const LoginForm = (props) => {

  const { dbReadyParam } = useLocalSearchParams();
  const { dbReady } = props;
  const { btnTxt } = props;

  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState<formData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    postal_code: '',
    image: ''
  });

  const navigation = useNavigation();
  const logoutAuth = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clearCart);
  const clearDB = useDbStore((s) => s.clearDB);

  const db = useSQLiteContext();

  useEffect(() => {
    let isMounted = true;

    const getUser = async () => {

      if (btnTxt === 'Update Profile') {
        if (!dbReadyParam) return;
      } else {
        if (!dbReady) return;
      }

      try {
        const result = await db.getAllAsync<formData>(`SELECT * FROM USER`);
        if (isMounted && result && result.length > 0) {
          setForm(result[0]);
        }
      } catch (e) {
        console.log('DB ERROR -', e);
      } finally {
        console.log('DB SUCCESS');
      }
    }

    getUser();

    return () => {
      isMounted = false;
    };

  }, [dbReady]);


  const validateForm = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return form.name.trim().length > 0 && emailOk;
  }

  const logout = () => {
    Alert.alert('Log out', 'This will clear all your profile data. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await db.runAsync('DELETE FROM USER');
            if (form.image) {
              await FileSystem.deleteAsync(form.image, { idempotent: true });
            }
          } catch (e) {
            console.log('Logout cleanup error', e);
          }
          setForm({ name: '', email: '', phone: '', address: '', postal_code: '', image: '' });
          setImage(null);
          clearCart();
          clearDB();
          await logoutAuth();
        }
      }
    ]);
  }

  const login = async () => {
    const validated = validateForm();
    if (validated) {

      if (btnTxt === 'Update Profile') {
        //UPDATE PROFILE
        try {
          await db.runAsync(
            'UPDATE USER SET name = ?, email = ?, phone = ?, address = ?, postal_code = ?, image = ?',
            [form.name, form.email, form.phone, form.address, form.postal_code, form.image]
          );
          Alert.alert('Success', 'User details updated successfully');
        } catch (e) {
          Alert.alert('Error', ' Something went wrong - ' + e.message);
        } finally {
          navigation.goBack();
        }
      }
    } else {
      Alert.alert('Error', 'Please enter a valid name and email address');
      return;
    }

  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      await saveImageLocally(result.assets[0].uri);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => (navigation.goBack())}>
          <Ionicons name='arrow-back' size={28} color={colors.primary} />
        </TouchableOpacity>
      )
    })
  }, []);

  useLayoutEffect(() => {
    updateAvatar();
  }, [form.image]);

  const updateAvatar = async () => {
    if (form.image) {
      const fileInfo = await FileSystem.getInfoAsync(form.image);
      console.log('FIlE INFO -', fileInfo);
      if (fileInfo.exists) {
        setImage(fileInfo.uri);
        setForm({ ...form, image: fileInfo.uri });
      }
    }
  }

  const saveImageLocally = async (imageUri) => {
    try {
      const filename = `avatar_${Date.now()}.jpg`;
      const localUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: localUri,
      });

      setImage(localUri);
      setForm({ ...form, image: localUri });
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <ScrollView>
      <>
        <View style={styles.container1}>
          {
            !image && <Ionicons style={styles.person} name="person-outline" size={60} color={colors.primary} />
          }
          {
            image && <Image style={styles.avatar} source={{ uri: image }} />

          }

          <TouchableOpacity style={styles.btn1} onPress={pickImage}>
            <Text style={styles.btnTxt1}>Upload Photo</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.formContainer}>
            <Text>Name<Text style={styles.ast}>*</Text></Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='John Appleseed'
              style={styles.forTxtName}
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
            />
            <Text>Email<Text style={styles.ast}>*</Text></Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='email@examle.com'
              keyboardType='email-address'
              style={styles.forTxtName}
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
            />
            <Text>Phone</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='+1 111 111 111'
              keyboardType='numeric'
              style={styles.forTxtName}
              value={form.phone}
              onChangeText={text => setForm({ ...form, phone: text })}
            />
            <Text>Address</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='CZ48, New York'
              style={styles.forTxtName}
              value={form.address}
              onChangeText={text => setForm({ ...form, address: text })}
            />
            <Text>Postal Code</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              placeholder='07008'
              keyboardType='numeric'
              style={styles.forTxtName}
              value={form.postal_code}
              onChangeText={text => setForm({ ...form, postal_code: text })}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btn} onPress={login}>
              <Text style={styles.btnTxt}>{btnTxt}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutTxt}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5
  },
  logo: {
    height: 70,
    width: '100%',
    resizeMode: 'contain',
    padding: 10
  },
  btnContainer: {
    width: '100%'
  },
  btn: {
    backgroundColor: colors.secondary,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  logoutBtn: {
    backgroundColor: colors.secondaryGrey,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary
  },
  logoutTxt: {
    color: colors.secondaryDark,
    fontWeight: 'bold',
    fontSize: 16
  },
  btnTxt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  formContainer: {
    padding: 10,
    margin: 10,
  },
  forTxtName: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    margin: 10,
    height: 40,
    backgroundColor: 'white'
  },
  ast: {
    color: 'red'
  },
  container1: {
    alignItems: 'center',
    textAlign: 'center'
  },
  person: {
    margin: 25,
    padding: 10,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderColor: colors.primary
  },
  avatar: {
    margin: 25,
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderColor: colors.primary
  },
  btn1: {
    backgroundColor: colors.secondaryOrange,
    padding: 8,
    margin: 8,
    alignItems: 'center',
    borderRadius: 8
  },
  btnTxt1: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  }
})

export default LoginForm;