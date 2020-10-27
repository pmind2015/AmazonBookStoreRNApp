import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { mainColor, lightColor, textColor, restApiUrl } from "../../Constants";
import * as Animatable from "react-native-animatable";
import FormSwitch from "../components/FormSwitch";

// Аппыг ажиллаж байхад нь дэлгэцэнд ил байхад нь сэрүүлэг үүсвэл яах ёстойг
// энд тохируулж өгч байна!
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true
  })
});

const SettingsScreen = props => {
  const [alarm, setAlarm] = useState(false);
  const [noteficatoinId, setNoteficationId] = useState(null);

  useEffect(() => {
    const notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log("Хэрэглэгч сэрүүлэг дээр дарлаа: ", response);
      }
    );

    const notificationReceivedListener = Notifications.addNotificationReceivedListener(
      notification => {
        Alert.alert("Анхаар", notification.request.content.data.message, [
          {
            text: "Очиж үзэх",
            onPress: () => {
              props.navigation.navigate("Detail", {
                id: notification.request.content.data.id
              });
            }
          },
          {
            text: "Татгалзах",
            onPress: () => {}
          }
        ]);
      }
    );

    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then(result => {
        if (result.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return result;
      })
      .then(result => {
        if (result.status === "granted") {
          Notifications.getExpoPushTokenAsync().then(result =>
            console.log("Expo result: ", result)
          );
        } else {
          Notifications.getExpoPushTokenAsync().then(result =>
            console.log("Expo result: ", result)
          );
        }
      })
      .catch(err => console.log(err));

    AsyncStorage.getItem("notificationId")
      .then(result => {
        console.log("id:", result);
        setNoteficationId(result);
      })
      .catch(err => console.log(err));

    AsyncStorage.getItem("alarm")
      .then(result => {
        setAlarm(JSON.parse(result).alarm);
      })
      .catch(err => console.log(err));

    return () => {
      notificationResponseReceivedListener.remove();
      notificationReceivedListener.remove();
    };
  }, []);

  const toggleAlarm = () => {
    setAlarm(alarm => {
      const newValue = !alarm;
      console.log("daraa", newValue);

      if (newValue) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: "Анхаар!",
            body: "Таны сонирхсон номын хямдрал дуусах гэж байна!",
            data: {
              id: "5f7b37c5f88628bca78288d9",
              message: "Таны сонирхсон номын хямдрал дуусах гэж байна!"
            }
          },
          trigger: {
            seconds: 5,
            repeats: true
          }
        })
          .then(id => {
            console.log("alarm : ", id);
            setNoteficationId(id);
            AsyncStorage.setItem("noteficationId", id);
          })
          .catch(err => console.log(err));
      } else {
        Notifications.cancelScheduledNotificationAsync(noteficatoinId)
          .then(result => {
            setNoteficationId(null);
            AsyncStorage.removeItem("noteficationId");
            console.log("alarm cancelled");
          })
          .catch(err => console.log(err));
      }

      AsyncStorage.setItem("alarm", JSON.stringify({ alarm: newValue }));

      return newValue;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: mainColor }}>
      <StatusBar backgroundColor={mainColor} barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: mainColor
        }}
      >
        <Text style={{ fontSize: 30, color: lightColor }}>
          Тохиргооны хэсэг
        </Text>
        <Text style={{ fontSize: 16, color: lightColor, marginTop: 10 }}>
          Та хямдралын талаарх тохиргоог оруулна уу
        </Text>
      </View>

      <Animatable.View
        animation="fadeInUpBig"
        duration={800}
        style={{
          flex: 5,
          paddingHorizontal: 20,
          paddingVertical: 30,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: "#fff",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30
        }}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FormSwitch
              label="Хямдрал дуусахыг сануулах эсэх"
              icon="clock"
              data={["Сануулна", "Сануулахгүй"]}
              value={alarm}
              onValueChange={toggleAlarm}
            />
          </View>
        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
