import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../Firebase";

const CustomListItem = ({id, chatName, enterChat}) => {

  const [ChatMessages, setChatMessages] = useState([])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'Chats', id, 'messages'), orderBy('timestamp', 'desc')),
      (querySnapshot) => {
        setChatMessages(
          querySnapshot.docs.map((doc) => ({
            data: doc.data(),
          }))
        );
      }
    );

    return unsubscribe;

    }, []);


  return (
    <ListItem key={id} bottomDivider onPress={() => {enterChat(id, chatName)}}>
      <Avatar
        rounded
        source={{
          uri: ChatMessages?.[0]?.data.photoURL || "https://th.bing.com/th/id/R.782adc2b6062ab00461359da5b02b753?rik=Y%2fJZM98TPsfXxA&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f5%2fProfile-PNG-File.png&ehk=nJ0Yls4aiMdSvREO5hB2GU7Hc3cL04UQeojwLhvL8Gk%3d&risl=&pid=ImgRaw&r=0",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{fontWeight:800}}>
            {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            {ChatMessages?.[0]?.data.displayName } : {ChatMessages?.[0]?.data.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
