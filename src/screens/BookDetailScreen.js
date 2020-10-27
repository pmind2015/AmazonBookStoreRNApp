import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
import { Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Alert,
  ScrollView
} from "react-native";
import useBook from "../hooks/useBook";
import UserContex from "../contexts/UserContex";
import { restApiUrl } from "../../Constants";

const BookDetailScreen = props => {
  const { id } = props.route.params;
  const [book, error, deleteBook] = useBook(id);

  const height = useHeaderHeight();

  const state = useContext(UserContex);

  const deleteOneBook = () => {
    Alert.alert("Анхаар!", "Та энэ номыг устгахдаа итгэлтэй байна уу?", [
      {
        text: "Татгалзах",
        onPress: () => {}
      },
      {
        text: "Тийм, устга!",
        onPress: () => {
          deleteBook(book._id)
            .then(result => {
              props.navigation.navigate("Home", {
                deletedBook: result.data.data
              });
            })
            .catch(err => {
              Alert.alert(err.response.data.error.message);
            });
        }
      }
    ]);
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Feather
          size={25}
          style={{ marginRight: 20 }}
          name="menu"
          color="white"
          onPress={() => props.navigation.toggleDrawer()}
        />
      )
    });
  }, [props.navigation]);

  if (error) {
    return (
      <Text style={{ color: "red", margin: 30 }}>Алдаа гарлаа! {error}</Text>
    );
  }

  if (!book) {
    return null;
  }

  console.log(restApiUrl + "/upload/" + book.photo);

  return (
    <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
      {book.photo.startsWith("/") ? (
        <Image
          style={{ width: 300, height: 400, alignSelf: "center" }}
          source={{ uri: "https://data.internom.mn/media/images" + book.photo }}
        />
      ) : (
        <Image
          style={{ width: 300, height: 400, alignSelf: "center" }}
          source={{ uri: restApiUrl + "/upload/" + book.photo }}
        />
      )}

      <Text style={{ fontSize: 18, fontWeight: "bold", padding: 10 }}>
        {book.name}
      </Text>

      <Text>{book.content}</Text>

      <Button onPress={() => props.navigation.goBack()} title="Буцах" />

      {state.userRole === "admin" && (
        <View style={{ marginBottom: 100 }}>
          <Button onPress={deleteOneBook} title="Энэ номыг устга" />
        </View>
      )}
    </ScrollView>
  );
};

export default BookDetailScreen;

const styles = StyleSheet.create({});
