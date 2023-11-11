import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from 'react-native-elements'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../Firebase'

const LoginScreen = ({navigation}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
      const UnSubscribe = onAuthStateChanged(auth, (authUser) => {
        if(authUser ) {
          navigation.replace('Home')
        }
      })

      return UnSubscribe;
    }, [])

    const SignIn = () => {
      signInWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
      })
      .catch((error) => alert(error.message));
    }

    return (
      <KeyboardAvoidingView style= {styles.container}>
        <StatusBar style='light' />
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Signal_Blue_Icon.png"
          }}
          style={{
            width: 200,
            height: 200,
          }}
        />
        <View style={styles.inputContainer}>
          <Input placeholder='Email' autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)}/>
          <Input placeholder='Password' secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)} onSubmitEditing={SignIn}/>
        </View>
        <Button containerStyle= {styles.button} title='Login' onPress={SignIn} />
        <Button containerStyle= {styles.button} type="outline" title='Register' onPress={() => navigation.navigate('Register')}/>
      </KeyboardAvoidingView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },

  inputContainer : {
    width: 300,
  },

  button : {
    width: 200,
    marginTop: 10,
  }
})