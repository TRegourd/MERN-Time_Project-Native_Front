import { Button, Input } from "@rneui/base";
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../AuthProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import services from "../services";

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
  const [passwordInput, setPasswordInput] = useState();
  const [userInput, setUserInput] = useState();

  function onPressLogin(e) {
    e.preventDefault();
    const body = {
      email: userInput,
      password: passwordInput,
    };
    setLogged(true);
    services
      .login(body)
      .then((result) => {
        const { jwt } = result.data;
        //localStorage.setItem("jwt", jwt);
        setLogged(true);
        alert("Successfully logged");
      })
      .catch((err) => {
        console.log(err);
        alert("Incorrect login");
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to The Time Machine</Text>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder="Email"
          onChangeText={setUserInput}
          value={userInput}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          onChangeText={setPasswordInput}
          value={passwordInput}
          secureTextEntry={true}
        />
        <Button
          title="Login"
          type="solid"
          icon={{ type: "font-awesome", name: "user", color: "white" }}
          onPress={onPressLogin}
        ></Button>
      </View>
      <Button
        title="Don't have account yet ?"
        type="Clear"
        onPress={() => navigation.navigate("Signin Form")}
        icon={{ type: "font-awesome", name: "user-plus", color: "grey" }}
      />
    </View>
  );
}

function SigninInput({ navigation }) {
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userConfirmPassword, setUserConfirmPassword] = useState();

  const onPressSignin = () => {
    const body = {
      first_name: userFirstName,
      last_name: userLastName,
      email: userEmail,
      password: userPassword,
      confirmPassword: userConfirmPassword,
    };
    services
      .signin(body)
      .then(() => {
        alert("User successfully created");
      })
      .catch((err) => {
        console.log(err);
        alert("Incorrect entry");
      });
    navigation.navigate("Login Form");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Login</Text> */}

      <Input
        style={styles.input}
        placeholder="First Name"
        onChangeText={setUserFirstName}
        value={userFirstName}
      />
      <Input
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setUserLastName}
        value={userLastName}
      />
      <Input
        style={styles.input}
        placeholder="Email"
        onChangeText={setUserEmail}
        value={userEmail}
      />
      <Input
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setUserPassword}
        value={userPassword}
      />
      <Input
        style={styles.input}
        placeholder="Repeat Password"
        secureTextEntry={true}
        onChangeText={setUserConfirmPassword}
        value={userConfirmPassword}
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
    padding: 50,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: "grey",
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    textAlign: "center",
  },
});
