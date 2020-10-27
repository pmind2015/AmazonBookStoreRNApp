import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";
import UserContext from "../contexts/UserContex";

export default function({ route, navigation }) {
  const [name, setName] = useState("Цэцгээ");
  const [email, setEmail] = useState("tsetsgee@gmail.com");
  const [password1, setPassword1] = useState("1234");
  const [password2, setPassword2] = useState("1234");
  const [error, setError] = useState(null);

  const state = useContext(UserContext);

  const signupHandler = () => {
    setError(null);

    if (name.length === 0) {
      Alert.alert("Та нэрэээ бичнэ үү");
      return;
    }

    if (password1 !== password2) {
      Alert.alert("Нууц үгнүүд хоорондоо таарахгүй байна!");
      return;
    }

    state.signUp(name, email, password1);
  };

  return (
    <View>
      <Image
        style={{ width: "100%", height: "30%" }}
        source={require("../../assets/images/shop.png")}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          marginTop: 10,
          color: "gray"
        }}
      >
        Шинээр бүртгүүлэх
      </Text>

      {error && (
        <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
          {error}
        </Text>
      )}

      <MyInput
        value={name}
        placeholder="Та нэрээ оруулна уу"
        onChangeText={setName}
      />

      <MyInput
        value={email}
        keyboardType="email-address"
        placeholder="Та имэйл хаягаа оруулна уу"
        onChangeText={setEmail}
      />

      <MyInput
        value={password1}
        secureTextEntry={true}
        placeholder="Нууц үгээ оруулна уу"
        onChangeText={setPassword1}
      />

      <MyInput
        value={password2}
        secureTextEntry={true}
        placeholder="Нууц үгээ давтан оруулна уу"
        onChangeText={setPassword2}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <MyButton title="Буцах" onPress={() => navigation.goBack()} />
        <MyButton title="Бүртгүүлэх" onPress={signupHandler} />
      </View>
    </View>
  );
}

const css = StyleSheet.create({
  inputField: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10
  },
  button: {
    marginVertical: 5
  }
});
