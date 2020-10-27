import React from "react";
import { StyleSheet, Text, View, Picker } from "react-native";
import { mainColor, lightColor, textColor } from "../../Constants";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";

const FormText = props => {
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
        <Picker
          selectedValue={props.value}
          onValueChange={props.onValueChange}
          style={{ flex: 1, marginTop: -15 }}
          itemStyle={{
            color: textColor,
            fontSize: 16
          }}
        >
          {props.data.map((category, index) => (
            <Picker.Item
              color={textColor}
              key={index}
              label={category}
              value={props.values[index]}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default FormText;

const styles = StyleSheet.create({});
