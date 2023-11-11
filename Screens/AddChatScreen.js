import React, { useLayoutEffect } from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../Firebase";
import { collection, addDoc } from "firebase/firestore"; 

const AddChatScreen = ({ navigation }) => {

  const [input, setInput] = useState("");

  const createChat = async() => {
        try {
            await addDoc(collection(db, "Chats"), {
                chatName: input,
            })
            .then(() => {
                navigation.goBack();
            })
        } catch (error) {
            alert(error);
        }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerStyle: {
        backgroundColor: "#29a19c",
      },
      headerTintColor: "white",
      headerBackTitle: "Back to Home",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter the chat name"
        value={input}
        onChangeText={(text) => {
          setInput(text);
        }}
        leftIcon = {
            <Icon name='wechat' type="antdesign" size={24} color='black' />
        }
        onSubmitEditing={createChat}
      />
      <Button disabled={!input} title='Create new Chat' onPress={createChat} />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
});
