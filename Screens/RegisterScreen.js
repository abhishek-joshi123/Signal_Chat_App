import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { useLayoutEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../Firebase"; 

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: "white",
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        const user = authUser.user;
        updateProfile(user, {
          displayName: name,
          photoURL:
            imageUrl ||
            "https://th.bing.com/th/id/R.782adc2b6062ab00461359da5b02b753?rik=Y%2fJZM98TPsfXxA&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-PNG-File.png&ehk=nJ0Yls4aiMdSvREO5hB2GU7Hc3cL04UQeojwLhvL8Gk%3d&risl=&pid=ImgRaw&r=0",
        })
          .then(() => {
            console.log(
              "User profile updated:",
              user.displayName,
              user.photoURL   
            );
          })
          .catch((profileError) => {
            alert(profileError.message);
          });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Signal account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Profile picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
      </View>
      <Button
        onPress={register}
        title="Register"
        raised
        containerStyle={styles.button}
      />
    </KeyboardAvoidingView>
  );
};

RegisterScreen.navigationOptions = {
  title: "Register",
  headerTintColor: "white",
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },

  inputContainer: {
    width: 300,
  },

  button: {
    width: 200,
    marginTop: 10,
  },
});
