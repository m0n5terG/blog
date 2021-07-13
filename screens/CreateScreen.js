import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableHighlight, TextInput, ActivityIndicator, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import PhotoPicker from "../components/PhotoPicker";

const API = "http://m0n5terg.pythonanywhere.com";
const API_CREATE = "/create";
const IMAGE_URL = "/static";

export default function CreateScreen({ navigation }) {

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState("");

  async function submitPost() { 
    console.log("--- Post ---")
    Keyboard.dismiss();

    if (title == "" || content == "") {
      setErrorText("Input cannot be blank");
    }
    else {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(API + API_CREATE, 
          {
            title,
            content,
            image,
          },
          {
          headers: { Authorization: `JWT ${token}` },
          }
        );
          setLoading(false);
          console.log("Post success!");
          console.log(response.data);
          console.log(response.data.image);
          
          console.log(response);
          navigation.navigate('Index');
      } 
      catch (error) {
        setLoading(false);
        console.log(error.response);
        setErrorText(error.response.data.content);
      }
    }
  }

  const resultRef = useRef()

  const photoPickHandler = uri => {
    resultRef.current  = uri
  }


  return (
    <View style={commonStyles.container}>
      { loading ? 
      (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView>
      
      <PhotoPicker onPick={photoPickHandler} />
      <TextInput style={styles.title}
        placeholder=" Title"
        value={title}
        onChangeText={(input) => setTitle(input)}/>
      <TextInput style={styles.content}
        placeholder=" Post"
        multiline = {true}
        numberOfLines = {4}
        value={content}
        onChangeText={(input) => setContent(input)}/>
      <TouchableHighlight style={styles.button} onPress={submitPost} underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableHighlight>
      <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("Index")} underlayColor='#99d9f4'>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableHighlight>
      <Text style={styles.errorText}>{errorText}</Text>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    height: 40,
    width: 280,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10
  },
  errorText: {
    marginTop: 20,
    color: "red",
    height: 40,
    alignSelf: "center"
  },
  content : {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    height: 100,
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
