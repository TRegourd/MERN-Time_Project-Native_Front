import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Login from "./pages/Login";

import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthContext } from "./AuthProvider";
import Timesheets from "./pages/Timesheets";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";

export default function App() {
  //   const [connected, setConnected] = useState(false);

  const { logged, setLogged } = useContext(AuthContext);

  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaView style={styles.container}>
      {!logged && (
        <NavigationContainer>
          <Login />
        </NavigationContainer>
      )}
      {logged && (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === "Timesheets") {
                  iconName = "ios-time";
                } else if (route.name === "Projects") {
                  iconName = "ios-list";
                } else if (route.name === "Profile") {
                  iconName = "ios-person";
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: "tomato",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen
              name="Timesheets"
              component={Timesheets}
              options={{ headerShown: false }}
            />
            <Tab.Screen
              name="Projects"
              component={Projects}
              options={{ headerShown: false }}
            ></Tab.Screen>
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});
