import React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
//  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
//  Platform,
//  ActivityIndicator,
//  Alert,
//  ColorPropType,
} from "react-native";
//import { IconButton, Colors } from "react-native-paper";
//import * as ImagePicker from 'expo-image-picker';
//import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "http://m0n5terg.pythonanywhere.com";
const API_SIGNUP = "/newuser";
//const IMAGE_URL = "/static";

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
//  const [profileImage, setProfileImage] = useState(null);
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(false);
/*
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const Camera = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
    setProfileImage(result.uri);
    }
  };  */ 

  async function signup() {
    
    console.log("---- Signing Up ----");
    Keyboard.dismiss();

    if (username.length == 0 || password.length == 0) {
      setErrorText('Warning! Please enter credential')
    }

    else {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
    //      profileImage,
        });
        console.log("Success signing up!");
    //    console.log(response.data.profileImage)
        console.log(response);
        navigation.navigate("Account");
  
      } catch (error) {
        setLoading(false);
        console.log("Error signing up!");
        console.log(error.response);  
        setErrorText(error.response.data.description);
      }
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      if (token == null) {
        setError(true);
        setUsername(null);
    //    setProfileImage(null);

      } else {
        try {
          const response = await axios.get(API + API_WHOAMI, {
            headers: { Authorization: `JWT ${token}` },
          });
          setUsername(response.data.username);
    //      setProfileImage(response.data.profileImage)

          setLoading(false);
        } catch (error) {
          setError(true);
          setUsername(null);
          setLoading(false);
        }
      }
    })();
    setRefresh(false);
  }, [refresh]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        {/*
          <View style={styles.profileImage}>
            <Image
              source={profileImage ? { uri: profileImage } 
              : require("../assets/tempAvatar.jpg")}
              style={styles.image}
              resizeMode='center'
            />
          <View style={styles.camera}>
            <IconButton
              icon="camera"
              color={Colors.red500}
              size={40}
              style={styles.camera}
              onPress={Camera}
            />
          </View>
        </View>       
        */}
        <Text style={styles.fieldTitle}>Username</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={(input) => setUsername(input)}
        />
        <Text style={styles.fieldTitle}>Password</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => setPassword(input)}
        />
        <TouchableOpacity onPress={signup} style={styles.loginButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.navText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
          <Text style={styles.errorText}>{errorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  fieldTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },
  loginButton: {
    backgroundColor: "blue",
    width: 120,
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    marginBottom: 40,
    alignSelf: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center"
  },
  navText: {
    color: "royalblue",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: "center"
  },
  errorText: {
    marginTop: 20,
    color: "red",
    height: 40,
    alignSelf: "center"
  },
  
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 40,
    marginTop: 40,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 0,
    height: 50,
    width: 40,  
  },
  
  
});
