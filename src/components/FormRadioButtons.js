import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { mainColor, lightColor, textColor } from "../../Constants";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import {
  RadioButton,
  Text as RadioText,
  TouchableRipple
} from "react-native-paper";

export default props => {
  return (
    <View>
      <Text style={{ fontSize: 16, paddingTop: 35, color: textColor }}>
        {props.label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          borderBottomColor: "#f2f2f2",
          borderBottomWidth: 1,
          paddingBottom: 5
        }}
      >
        <Feather name={props.icon} size={20} color={textColor} />
        <View style={{ flexDirection: "column" }}>
          {props.data.map((el, index) => {
            const categoryId = props.values[index];
            return (
              <View key={index} style={styles.row}>
                <RadioButton
                  color={mainColor}
                  value={categoryId}
                  onPress={() => {
                    props.onValueChange(categoryId);
                  }}
                  status={props.value === categoryId ? "checked" : "unchecked"}
                />
                <TouchableRipple
                  onPress={() => {
                    props.onValueChange(categoryId);
                  }}
                >
                  <RadioText style={styles.text}>{el}</RadioText>
                </TouchableRipple>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: { marginTop: 12, color: textColor, marginTop: 10 },
  row: { flexDirection: "row", marginLeft: 10 }
});
