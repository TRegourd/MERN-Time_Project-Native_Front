import { Button } from "@rneui/base";
import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      <Text>
        Profile of {currentUser.first_name} {currentUser.last_name}
      </Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("Edit")}
        icon={{ type: "font-awesome", name: "user-plus", color: "white" }}
      />
      <Button
        style={styles.logoutButton}
        title="Logout"
        type="outline"
        icon={{ type: "font-awesome", name: "user-times", color: "grey" }}
        onPress={onPressLogout}
      ></Button>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
  },
  logoutButton: {
    marginTop: 5,
    flex: 0.25,
  },
});
