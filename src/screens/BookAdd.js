import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  Platform,
  Button,
  Image
} from "react-native";
import { mainColor, lightColor, textColor, restApiUrl } from "../../Constants";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import Feather from "react-native-vector-icons/Feather";
import * as Animatable from "react-native-animatable";
import FormText from "../components/FormText";
import FormSwitch from "../components/FormSwitch";
import FormPicker from "../components/FormPicker";
import FormRadioButtons from "../components/FormRadioButtons";
import useCategory from "../hooks/useCategory";
import Spinner from "../components/Spinner";
import MyButton from "../components/MyButton";
import axios from "axios";

const BookAdd = props => {
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, errorMessage, loading] = useCategory();
  const [book, setBook] = useState({
    name: "Элон Маск",
    photo: "photo.jpg",
    author: "Ашли Ванс",
    rating: 4.0,
    balance: 6,
    price: "20000",
    content:
      "Элон маскийн амьдрал, бизнесийн салбарын хэрхэн оргилд хүрсэн тухай гайхалтай түүхийг өөрийнх нь ярианаас сэдэвлэн бичсэн гайхалтай ном.",
    bestseller: true,
    category: null,
    available: ["old"]
  });

  const [serverError, setServerError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleUploadComplete = (event, bookId) => {
    console.log("Upload completed!");
    setUploadProgress(0);
    setUploadTotal(0);
    props.navigation.navigate("Detail", { id: bookId });
  };

  const handleUploadProgress = event => {
    if (uploadTotal === 0) setUploadTotal(event.total);

    setUploadProgress(uploadProgress => {
      console.log("Upload total : " + uploadTotal);
      console.log("Upload progress: " + uploadProgress);
      return Math.round((event.loaded * 100) / event.total);
    });
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Анхаар!",
            "Уучлаарай, та утаснаас зураг сонгох эрхийг зөвшөөрч байж зураг оруулах боломжтой. Та утасныхаа тохиргооны цонхноос энэ апп-д зураг үзэх бичих эрхийг нээж өгнө үү.",
            [
              {
                text: "Тохиргоог нээх",
                onPress: () => {
                  if (Platform.OS === "ios") Linking.openURL("app-settings:");
                  // else {
                  //   // android intent
                  //   IntentLauncher.startActivityAsync(
                  //     IntentLauncher.ACTION_APPLICATION_SETTINGS
                  //   );
                  // }
                }
              },
              { text: "Ok", onPress: () => {} }
            ]
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.cancelled) {
      setBook({ ...book, photo: result.uri });
    }
  };

  const sendBookToServer = () => {
    if (book.category !== null) {
      setSaving(true);

      const fileUri = book.photo;
      const fileExt = fileUri.substring(fileUri.lastIndexOf(".") + 1);
      book.photo = `photo__${new Date().getTime()}.${fileExt}`;

      axios
        .post(`${restApiUrl}/api/v1/books`, book)
        .then(result => {
          const newBook = result.data.data;

          const xhr = new XMLHttpRequest();
          xhr.addEventListener("load", event =>
            handleUploadComplete(event, newBook._id)
          );
          xhr.upload.addEventListener("progress", handleUploadProgress);

          const data = new FormData();

          data.append("file", {
            uri: fileUri,
            type: `image/${fileExt}`,
            name: book.photo
          });

          xhr.open(
            "PUT",
            `${restApiUrl}/api/v1/books/${newBook._id}/upload-photo`
          );
          xhr.send(data);
        })
        .catch(err => {
          if (err.response) setServerError(err.response.data.error.message);
          else setServerError(err.message);
        })
        .finally(() => {
          setSaving(false);
        });
    } else {
      Alert.alert("Та номын категорийг сонгоно уу!");
    }
  };

  const [error, setError] = useState({
    name: false,
    author: false,
    price: false,
    content: false
  });

  const checkName = text => {
    setError({
      ...error,
      name: text.length < 5 || text.length > 20
    });

    setBook({
      ...book,
      name: text
    });
  };

  const checkPrice = text => {
    setError({
      ...error,
      price: text < 1000
    });

    setBook({
      ...book,
      price: text
    });
  };

  const checkAuthor = text => {
    setError({
      ...error,
      author: text.length < 5 || text.length > 15
    });

    setBook({
      ...book,
      author: text
    });
  };

  const checkContent = text => {
    setError({
      ...error,
      content: text.length < 5 || text.length > 1000
    });

    setBook({
      ...book,
      content: text
    });
  };

  const toggleBestseller = () => {
    setBook({
      ...book,
      bestseller: !book.bestseller
    });
  };

  if (uploadTotal > 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ marginBottom: 20, fontWeight: "bold", fontSize: 16 }}>
          Түр хүлээнэ үү. Зургийг илгээж байна...
        </Text>

        <View
          style={{
            height: 50,
            backgroundColor: "red",
            width: 200
          }}
        >
          <View
            style={{
              height: 50,
              backgroundColor: "green",
              width: uploadProgress * 2,
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", flex: 1, marginTop: 15 }}>
              {uploadProgress}%
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
          Шинээр ном нэмэх
        </Text>
        <Text style={{ fontSize: 16, color: lightColor, marginTop: 10 }}>
          Та номын мэдээллээ оруулна уу
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
        {loading || saving ? (
          <Spinner />
        ) : (
          <ScrollView>
            {serverError &&
              Alert.alert("Анхаар", serverError, [
                {
                  text: "Ойлголоо",
                  onPress: () => setServerError(null)
                }
              ])}
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Button title="Номын зургийг сонгоно уу" onPress={pickImage} />
              {book.photo && (
                <Image
                  source={{ uri: book.photo }}
                  style={{ width: 100, height: 100 }}
                />
              )}
            </View>
            <FormText
              label="Номын нэрийг оруулна уу"
              placeholder="Номын нэр"
              icon="book-open"
              value={book.name}
              onChangeText={checkName}
              errorText="Номын нэрийн урт 4-20 тэмдэгтээс тогтоно."
              errorShow={error.name}
            />

            <FormText
              label="Номын зохиогчийг оруулна уу"
              placeholder="Зохиогчийн нэр"
              icon="user"
              value={book.author}
              onChangeText={checkAuthor}
              errorText="Зохиогчийн нэрийн урт 5 - 15 үсгээс тогтоно."
              errorShow={error.author}
            />

            <FormText
              label="Номын үнийг оруулна уу"
              keyboardType="numeric"
              placeholder="Номын үнэ"
              icon="dollar-sign"
              value={book.price}
              onChangeText={checkPrice}
              errorText="Номын үнэ 1000 төгрөгөөс дээш байна."
              errorShow={error.price}
            />

            <FormText
              label="Номын тайлбарыг оруулна уу"
              placeholder="Номын тайлбар 1000 тэмдэгтээс хэтрэхгүй"
              style={{ fontSize: 10 }}
              icon="edit"
              multiline
              numberOfLines={10}
              value={book.content}
              onChangeText={checkContent}
              errorText="Номын тайлбар 10 - 1000 тэмдэгтээс тогтоно."
              errorShow={error.content}
            />

            <FormSwitch
              label="Бестсэллэр мөн эсэх"
              icon="trending-up"
              data={["Бестсэллэр мөн", "Бестсэллэр биш"]}
              value={book.bestseller}
              onValueChange={toggleBestseller}
            />

            <FormRadioButtons
              label="Номын категори :"
              icon="layers"
              data={categories.map(el => el.name)}
              value={book.category}
              values={categories.map(el => el.id)}
              onValueChange={(value, index) => {
                console.log(value);
                setBook({ ...book, category: value });
              }}
            />

            {/**
               * <FormPicker
              label="Номын категори :"
              value={book.category}
              icon="layers"
              data={categories.map(el => el.name)}
              values={categories.map(el => el.id)}
              onValueChange={(value, index) => {
                console.log(value);
                setBook({ ...book, category: value });
              }}
            /> */}

            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <MyButton
                title="Буцах"
                onPress={() => props.navigation.goBack()}
              />
              <MyButton title="Бүртгэх" onPress={sendBookToServer} />
            </View>
          </ScrollView>
        )}
      </Animatable.View>
    </SafeAreaView>
  );
};

export default BookAdd;

const styles = StyleSheet.create({});
