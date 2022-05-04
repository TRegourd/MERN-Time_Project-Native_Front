import { Avatar, Button } from "@rneui/base";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Entypo } from "@expo/vector-icons";

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

  const onPressLogout = async () => {
    await AsyncStorage.removeItem("@jwt");
    setLogged(!logged);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Edit")}>
          <Avatar
            size={200}
            rounded
            icon={{ name: "adb", type: "material" }}
            containerStyle={{ backgroundColor: "orange" }}
          >
            <Avatar.Accessory size={60} />
          </Avatar>
        </TouchableOpacity>
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

function EditProfile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Edit your Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  headerContainer: {
    flex: 4,
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
    backgroundColor: "#FFFAFA",
    borderRadius: 10,
    marginBottom: 10,
  },
  info: {
    fontSize: 20,
  },
  infoIcon: { paddingRight: 20, paddingLeft: 10 },
});
