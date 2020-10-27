import React, { useState, useLayoutEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Search from "../components/Search";
import useCategory from "../hooks/useCategory";
import CategoryBookList from "../components/CategoryBookList";
import Spinner from "../components/Spinner";
import MyHeaderButton from "../components/MyHeaderButton";
import UserContext from "../contexts/UserContex";

const HomeScreen = ({ navigation, route }) => {
  const [localSearchText, setLocalSearchText] = useState("");
  const [serverSearchText, setServerSearchText] = useState("");
  const [categories, errorMessage, loading] = useCategory();
  const [refresh, setRefresh] = useState(false);

  const state = useContext(UserContext);

  if (route.params && route.params.deletedBook) {
    Alert.alert(route.params.deletedBook.name + " нэртэй номыг устгалаа!");
    delete route.params.deletedBook;
    setRefresh(true);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MyHeaderButton}>
          <Item
            title="Цэс"
            iconName="ios-menu"
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
      title: state.userName
        ? "Welcome: " + state.userName
        : "Амазон номын дэлгүүр"
    });
  }, [navigation, localSearchText, state.userName]);

  const searchBookFromServer = () => {
    console.log(`Сэрвэрээс ${localSearchText} утгаар хайж эхэллээ...`);

    setServerSearchText(localSearchText);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <View>
          <Search
            value={localSearchText}
            onValueChange={setLocalSearchText}
            onFinishEnter={searchBookFromServer}
          />

          {errorMessage && (
            <Text style={{ marginHorizontal: 20, color: "red" }}>
              {errorMessage}
            </Text>
          )}
          <ScrollView style={{ marginTop: 20 }}>
            {categories.map(category => (
              <CategoryBookList
                refreshCategory={refresh}
                setRefresh={setRefresh}
                searchLocalValue={localSearchText}
                searchServerValue={serverSearchText}
                key={category._id}
                style={{ marginVertical: 10 }}
                data={category}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
