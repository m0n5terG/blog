import React, { useEffect, useState } from "react";
import { 
  Button, 
  StyleSheet, 
  Text, 
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity 
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { color } from "react-native-reanimated";

const API = "http://m0n5terg.pythonanywhere.com";
const API_WHOAMI = "/whoami";
//const IMAGE_URL = "/static/";

export default function AccountScreen({ navigation }) {
  
  const [username, setUsername] = useState("");
//  const [profileImage, setProfileImage] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [loading, setLoading] = useState(true);

  async function getUserData() {
    setLoading(true);
    console.log("---- Getting user profile ----");

    const token = await AsyncStorage.getItem("token");
    console.log(`Token is ${token}`);

    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });

      let joinDate = new Date(response.data.createdAt * 1000).toDateString();
      
      console.log("Got user profile!");

      setUsername(response.data.username);
      setJoinDate(joinDate);
//      setProfileImage(response.data.profileImage);

      setLoading(false);

    } catch (error) {
      console.log("Error getting user profile");
       setLoading(false)
       
       if (error.response) {
         console.log(error.response.data);
        if (error.response.data.status_code == 401) {
          signOut();
        }        
      } else {
        console.log(error);
      }
       // We should probably go back to login screen?
     }
   }

   useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getUserData();
    });

    getUserData();

    return removeListener;
  }, []);

  function signOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignIn");
  }

  return (
    <View style={commonStyles.container}>
      <Text style={styles.header}>Account Screen</Text>
      { loading ? (<ActivityIndicator size="large" color="#0000ff" />) : 
      (
        <View style={{alignItems: "center"}}>
          <Text style={styles.user}>{username}</Text>
          <Text style={styles.user}>{joinDate}</Text>         
          <Button title="Sign out" onPress={signOut} />
        </View>
      )}
    </View>
  );
}
/*
          <View style={styles.profileImage}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,' + profileImage}}
              resizeMode='center'
            />
          </View>
        <View style={styles.camera}>
          <IconButton
            icon="camera"
            color={Colors.red500}
            size={40}
            style={styles.camera}
            onPress={null}
          />
           </View>
*/

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    marginBottom: 40
  },
  user: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "royalblue"
  },
  button: {
    fontSize: 16,
    padding: 10,
  }
})
/*  
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: "hidden"
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
    alignItems: "center",
    justifyContent: "center"
  },
});*/
