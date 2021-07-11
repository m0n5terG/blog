import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Card, FAB, Paragraph, Title } from "react-native-paper";
import { commonStyles } from "../styles/commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API = "http://m0n5terg.pythonanywhere.com";
const API_POSTS = "/posts";

export default function IndexScreen({ navigation }) {

  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getPosts() {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });

      setPost(response.data);

      setLoading(false);
    } 
    catch (error) {
      setLoading(false);

      if (error.response) {
        console.log(error.response.data);
      } 
      else
        console.log(error); 
    }
  }

  useEffect(() => {
    const removeListener = navigation.addListener("focus", () => {
      getPosts();
    });

    getPosts();

    return removeListener;
  }, []);

  function renderItem({ item }) {
    return (
      <ScrollView>
        <View style={commonStyles.container}>
          <Card mode='outlined' style={{ width: '100%' }}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Content>
              <Title>{item.title}</Title>
              <Paragraph>{item.content}</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>         
     );
   }
   
   return (
    <View style={commonStyles.container}>
      { loading ? (<ActivityIndicator size="large" color="#0000ff" />) : 
      (<FlatList style={styles.list} data={post} renderItem={renderItem} />)}
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => navigation.navigate("Post")} 
      />
    </View>   
  );
}

const styles = StyleSheet.create({
  fab: {
    height: 50,
    width: 50,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 30,
    right: 30
  },
  bottonContainer: {
    marginTop: 540,
  },
  list: {
    width: "100%",
    height: "100%",
  }, 
});
