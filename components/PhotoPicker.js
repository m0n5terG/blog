import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API = "http://m0n5terg.pythonanywhere.com";
const IMAGE_URL = "/static";

export default function PhotoPicker({ onPick }) {
    const [image, setImage] = useState(null);
  
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
  
    const takePhoto = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri); 
        onPick(result.uri);
      }
    };
  
    return (
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
                <MaterialCommunityIcons
                 name="camera-plus" 
                 size={60} 
                 color="red" />
              </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    );
  }

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
    marginTop: 20
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10
  },
  iconButton: {
    alignSelf: 'center',
    marginLeft: '10%',
    borderRadius: 10,
    marginRight: 50
  },
})