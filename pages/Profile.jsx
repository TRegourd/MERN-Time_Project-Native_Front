import { Avatar, Button, Input } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Entypo } from "@expo/vector-icons";
import services from "../services";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const SettingsStack = createNativeStackNavigator();

export default function Profile() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Profile Overview"
        component={ViewProfile}
        options={{ headerShown: false }}
      />
      <SettingsStack.Screen name="Edit" component={EditProfile} />
    </SettingsStack.Navigator>
  );
}

function ViewProfile({ navigation }) {
  const { logged, setLogged, currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(currentUser);
  const isFocused = useIsFocused();

  const onPressLogout = async () => {
    await AsyncStorage.removeItem("@jwt");
    setLogged(!logged);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          size={150}
          rounded
          icon={{ name: "adb", type: "material" }}
          containerStyle={{ backgroundColor: "orange" }}
        >
          <Avatar.Accessory
            size={60}
            onPress={() => navigation.navigate("Edit")}
          />
        </Avatar>

        <Text style={styles.title}>
          {currentUser.first_name} {currentUser.last_name}
        </Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.infoContainer}>
          <Entypo
            style={styles.infoIcon}
            name="email"
            size={30}
            color="black"
          />
          <Text style={styles.info}>{currentUser.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome5
            style={styles.infoIcon}
            name="house-user"
            size={24}
            color="black"
          />
          <Text style={styles.info}>{currentUser.adress}</Text>
        </View>
        <View style={styles.infoContainer}>
          <FontAwesome5
            style={styles.infoIcon}
            name="user-check"
            size={24}
            color="black"
          />
          <Text style={styles.info}>{currentUser.position}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Logout"
          type="Clear"
          icon={{ type: "font-awesome", name: "user-times", color: "grey" }}
          onPress={onPressLogout}
        ></Button>
      </View>
    </View>
  );
}

function EditProfile({ navigation }) {
  const { currentUser, token, setCurrentUser } = useContext(AuthContext);

  const [editFirstName, setEditFirstName] = useState(currentUser.first_name);
  const [editLastName, setEditLastName] = useState(currentUser.last_name);
  const [editAdress, setEditAdress] = useState(currentUser.adress);
  const [editPosition, setEditPosition] = useState(currentUser.position);
  const [image, setImage] = useState(null);

  function onPressEditProfile() {
    const body = {
      first_name: editFirstName,
      last_name: editLastName,
      position: editPosition,
      adress: editAdress,
      email: currentUser.email,
    };

    services
      .updateCurrentUser(body, token)
      .then(() => {
        setCurrentUser(body);
        alert("Profile successfully edited");
      })
      .catch(() => alert("Impossible de charger l'utilisateur courant"));
    navigation.navigate("Profile Overview");
  }

  async function onPressEditPicutre() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {!image && (
          <Avatar
            size={150}
            rounded
            icon={{ name: "adb", type: "material" }}
            containerStyle={{ backgroundColor: "orange" }}
          >
            <Avatar.Accessory
              type={"font-awesome-5"}
              name={"camera"}
              style={{ height: 40, width: 40, borderRadius: 20 }}
              size={30}
              onPress={onPressEditPicutre}
            />
          </Avatar>
        )}
        {image && (
          <Avatar
            size={150}
            rounded
            source={{ uri: image }}
            containerStyle={{ backgroundColor: "orange" }}
          >
            <Avatar.Accessory
              type={"font-awesome-5"}
              name={"camera"}
              style={{ height: 40, width: 40, borderRadius: 20 }}
              size={30}
              onPress={onPressEditPicutre}
            />
          </Avatar>
        )}
      </View>
      <View style={styles.inputContainer}>
        <ScrollView>
          <Input
            style={styles.input}
            placeholder="First Name"
            onChangeText={setEditFirstName}
            value={editFirstName}
          />
          <Input
            style={styles.input}
            placeholder="Last Name"
            onChangeText={setEditLastName}
            value={editLastName}
          />
          <Input
            style={styles.input}
            placeholder="Adress"
            onChangeText={setEditAdress}
            value={editAdress}
          />
          <Input
            style={styles.input}
            placeholder="Position"
            onChangeText={setEditPosition}
            value={editPosition}
          />
        </ScrollView>
      </View>
      <Button
        title="Edit Profile"
        type="solid"
        icon={{ type: "font-awesome-5", name: "user-edit", color: "white" }}
        onPress={onPressEditProfile}
        style={styles.button}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  headerContainer: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    flex: 0.5,
    fontSize: 40,
    alignSelf: "center",
  },
  profileContainer: {
    flex: 3,
  },
  buttonContainer: {
    flex: 0.5,
  },
  infoContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFFAFA",
    opacity: 0.8,
    borderRadius: 10,
    marginBottom: 10,
  },
  info: {
    fontSize: 20,
  },
  infoIcon: { paddingRight: 20, paddingLeft: 10 },

  inputContainer: {
    flex: 5,
    flexDirection: "column",
  },
  input: {
    flex: 1,
    textAlign: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
