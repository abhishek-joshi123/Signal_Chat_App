import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements';
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons"
import { auth, db } from '../Firebase';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';

const ChatScreen = ({navigation, route}) => {

  const [input, setInput] = useState('')
  const [Chatmessages, setChatMessages] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'Chats',
          headerStyle: {
            backgroundColor: "#29a19c",
          },
          headerTintColor: "white",
          headerBackTitle: "Back to Home",
          headerTitleAlign: 'left',
          headerTitle: () => (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Avatar rounded 
                source={{
                  uri: Chatmessages[0]?.data.photoURL 
                }}/>
                <Text style={{color:'white', marginLeft:10, fontWeight:700}}>{route.params.chatName}</Text>
            </View>
          ),

          headerLeft: () => (
            <TouchableOpacity activeOpacity={0.5} style={{marginLeft:10}} onPress={navigation.goBack    }>
                <AntDesign name="arrowleft" size={24} color='white' />
            </TouchableOpacity>
          ),

          headerRight: () => (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight: 20,
                width: 80,
            }}>
                <TouchableOpacity activeOpacity={0.5}>
                    <FontAwesome name="video-camera" size={24} color='white' />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}>
                    <Ionicons name="call" size={24} color='white' />
                </TouchableOpacity>
            </View>
          )
        });
      }, [navigation, Chatmessages]);


      useLayoutEffect(() => {
        const unsubscribe = onSnapshot(
          query(collection(db, 'Chats', route.params.id, 'messages'), orderBy('timestamp', 'desc')),
          (querySnapshot) => {
            setChatMessages(
              querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            );
          }
        );
    
        return unsubscribe;

        }, [route]);

      const sendChat = async (id, input) => {
        try {
          const messagesCollection = collection(db, 'Chats', id, 'messages');
          const newMessage = {
            timestamp: new Date(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
          };
      
          await addDoc(messagesCollection, newMessage);
        } catch (error) {
          alert(error);
        }
      };

      const SendMessage = () => {

        Keyboard.dismiss()
        sendChat(route.params.id, input)
        setInput('');
      }

    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={90}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <>
                <ScrollView contentContainerStyle={{paddingTop: 15}}>
                  {
                    Chatmessages?.map(({id, data}) => 
                        data.email === auth.currentUser.email ? (
                            <View key={id} style= {styles.reciever}>
                              <Avatar
                                rounded
                                position="absolute"
                                bottom={-15}
                                right={-5}
                                containerStyle= {{
                                  position:"absolute",
                                  bottom: -15,
                                  right: -5
                                }}
                                size={30}
                                source={{
                                  uri: data.photoURL
                                }}
                              />
                              <Text style={styles.recieverText}>{data.message}</Text>
                            </View>
                        ) : (
                          <View key={id} style= {styles.sender}>
                            <Avatar
                                rounded
                                position="absolute"
                                bottom={-15}
                                left={-5}
                                containerStyle= {{
                                  position:"absolute",
                                  bottom: -15,
                                  left: -5
                                }}
                                size={30}
                                source={{
                                  uri: data.photoURL
                                }}
                              />
                            <Text style={styles.senderText}>{data.message}</Text>
                                <Text style={styles.senderName}>{data.displayName}</Text>
                        </View>
                        )
                    )
                  }
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput placeholder='Message' style={styles.textinput} value={input} onChangeText={(text) => {setInput(text)}} onSubmitEditing={SendMessage}/>
                    <TouchableOpacity activeOpacity={0.5} onPress={SendMessage}>
                        <Ionicons name="send" size={24} color='#00a884' />
                    </TouchableOpacity>
                </View>

          </>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  textinput : {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ECECEC',
    borderWidth: 1,
    padding: 10,
    color: 'grey',
    borderRadius: 30,
  },
  reciever : {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender : {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderName : {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: 'white',
  },
  senderText : {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  recieverText : {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  
})
