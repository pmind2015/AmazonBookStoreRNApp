import React, { useContext } from "react";
import { Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MyStackNavigator from "./MyStackNavigator";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import DrawerContent from "../components/DrawerContent";
import SettingsScreen from "../screens/SettingsScreen";
import PushNotification from "../screens/PushNotification";

const Drawer = createDrawerNavigator();

import UserContex from "../contexts/UserContex";
import BookAdd from "../screens/BookAdd";

export default () => {
  const state = useContext(UserContex);

  if (state.isLoading === true) {
    return <SplashScreen />;
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Нүүр" component={MyStackNavigator} />
      {state.isLoggedIn ? (
        <>
          {state.userRole === "admin" && (
            <Drawer.Screen name="Шинэ ном нэмэх" component={BookAdd} />
          )}

          <Drawer.Screen name="Тохиргоо" component={SettingsScreen} />
          <Drawer.Screen name="Notification" component={PushNotification} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Бүртгүүлэх" component={SignupScreen} />
          <Drawer.Screen name="Логин" component={LoginScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
};
