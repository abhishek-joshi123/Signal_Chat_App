import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomListItem from "../Components/CustomListItem";
import { Avatar } from "react-native-elements";
import { auth, db } from "../Firebase";
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons"
import { collection, getDocs, onSnapshot } from "firebase/firestore";


const HomeScreen = ({ navigation }) => {

  const [chats, setChats] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Chats"), (querySnapshot) => {
      const updatedChats = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setChats(updatedChats);
    });

    return unsubscribe;
    
  }, [navigation]);

  const SignoutUser = () => {
    auth.signOut().then(() => {
      navigation.replace('Login');
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat Craze",
      headerStyle: {
        backgroundColor: "#29a19c",
      },
      headerTintcolor: "white",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={SignoutUser}>
              <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginRight: 20,
          }}>
          <TouchableOpacity activeOpacity={0.5}>
              <AntDesign name="camerao" size={24} color='white' />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => {
            navigation.navigate('AddChat')
          }}>
              <SimpleLineIcons name="pencil" size={24} color='white' />
          </TouchableOpacity>
          </View>
      ),
    });
    
  }, [navigation]);

  const enterChat = (id, chatName) => {
      navigation.navigate("Chat", {
        id,
        chatName,
      })
  }


  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <ScrollView style={styles.container}> 
        {
          chats?.map(({id, data}) => {
            return <CustomListItem key={id} id={id} chatName= {data.chatName} enterChat={enterChat}/>
          })
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container : {
    height: '100%'
  }
});
