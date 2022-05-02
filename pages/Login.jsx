import { Button, Input } from "@rneui/base";
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../AuthProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const LoginStack = createNativeStackNavigator();

export default function Login() {
  return (
    <LoginStack.Navigator>
      <LoginStack.Screen
        name="Login Form"
        component={LoginInput}
        options={{ headerShown: false }}
      />
      <LoginStack.Screen name="Signin Form" component={SigninInput} />
    </LoginStack.Navigator>
  );
}

function LoginInput({ navigation }) {
  const { logged, setLogged } = useContext(AuthContext);
  const [username, setUserName] = useState();
  const [userInput, setUserInput] = useState();

  const onPressLogin = () => {
    setLogged(true);
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Login</Text> */}

      <Input
        style={styles.input}
        placeholder="Email"
        //leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        onChangeText={setUserInput}
        value={userInput}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button
        title="Login"
        type="solid"
        icon={{ type: "font-awesome", name: "user", color: "white" }}
        onPress={onPressLogin}
      ></Button>

      <Button
        title="Don't have account yet ?"
        type="Clear"
        onPress={() => navigation.navigate("Signin Form")}
        icon={{ type: "font-awesome", name: "user-plus", color: "grey" }}
      />
    </View>
  );
}

function SigninInput() {
  const [username, setUserName] = useState();
  const [userInput, setUserInput] = useState();
  const onPressSignin = () => {
    console.log("signin");
    navigation.navigate("Login Form");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Login</Text> */}

      <Input
        style={styles.input}
        placeholder="First Name"
        //leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        onChangeText={setUserInput}
        value={userInput}
      />
      <Input
        style={styles.input}
        placeholder="Last Name"
        //leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        onChangeText={setUserInput}
        value={userInput}
      />
      <Input
        style={styles.input}
        placeholder="Email"
        //leftIcon={{ type: "font-awesome", name: "chevron-left" }}
        onChangeText={setUserInput}
        value={userInput}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Input
        style={styles.input}
        placeholder="Repeat Password"
        secureTextEntry={true}
      />
      <Button
        title="Sign In"
        type="solid"
        icon={{ type: "font-awesome", name: "user", color: "white" }}
        onPress={onPressSignin}
      ></Button>
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
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    textAlign: "center",
  },
});
