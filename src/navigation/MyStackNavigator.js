import React from "react";
import { Alert } from "react-native";
import {
  createStackNavigator,
  HeaderBackButton
} from "@react-navigation/stack";
import { mainColor } from "../../Constants";
import HomeScreen from "../screens/HomeScreen";
import BookDetailScreen from "../screens/BookDetailScreen";

const Stack = createStackNavigator();

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: mainColor },
      headerTintColor: "white",
      headerTitleStyle: { fontSize: 22 }
    }}
    initialRouteName="Home"
  >
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        title: "Амазон номын дэлгүүр"
      })}
    />

    <Stack.Screen
      name="Detail"
      component={BookDetailScreen}
      options={({ navigation }) => ({
        title: "Амазон номын дэлгүүр",
        headerBackTitleVisible: true,
        headerBackTitle: "Буцах",
        headerTruncatedBackTitle: "",
        headerLeft: props => (
          <HeaderBackButton
            {...props}
            onPress={() => {
              Alert.alert("Анхаар!!", "Та үнэхээр буцахыг хүсч байна уу?", [
                {
                  text: "Болих",
                  onPress: () => console.log("болих")
                },
                {
                  text: "Буц",
                  onPress: () => navigation.goBack()
                }
              ]);
            }}
          />
        )
      })}
    />
  </Stack.Navigator>
);
