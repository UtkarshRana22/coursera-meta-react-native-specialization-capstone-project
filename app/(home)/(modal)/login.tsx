import { View, StyleSheet, Image } from 'react-native'
import React from 'react'
import Hero from '../../../Components/Hero'
import LoginForm from '../../../Components/LoginForm'

const Login = (props) => {
  const { dbReady } = props;
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/img/logo.png')} style={styles.logo} />
      {/* <Hero /> */}
      <LoginForm dbReady={dbReady} btnTxt={'Login'} />
    </View>
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
  }
})

export default Login;