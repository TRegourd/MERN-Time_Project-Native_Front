// #region IMPORT
import dayjs from "dayjs";
import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../AuthProvider";
import services from "../services";
import ProjectPicker from "../components/ProjectPicker";
import { DatePicker } from "../components/DatePicker";
// #endregion IMPORT

const TimeSheetStack = createNativeStackNavigator();
export default function Timesheets() {
  return (
    <TimeSheetStack.Navigator>
      <TimeSheetStack.Screen
        name="RegisterTimesheet"
        component={RegisterTimesheet}
        options={{ headerShown: false }}
      />
      <TimeSheetStack.Screen
        name="ListTimesheet"
        component={ListTimesheet}
        options={{ title: "Your timesheet" }}
      />
    </TimeSheetStack.Navigator>
  );
}

// #region RegisterTimesheetScreen
function RegisterTimesheet({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState();
  const [duration, setDuration] = useState(0);
  const [projectsList, setprojectsList] = useState([]);

  // RECUPERATION DES DONNEES DE CONTEXT
  const { token, currentUser } = useContext(AuthContext);

  // ENREGISTREMENT DU TEMPS SAISIE
  function saveTime(e) {
    e.preventDefault();
    const time = {
      desc: description,
      date: date,
      project: projectSelect,
      duration: duration,

      user: currentUser._id,
    };
    services
      .createNewTimesheet(token, time)
      .then(() => {
        alert("Time saved");
        const dateReinitialised = new Date();
        setDate(dateReinitialised);
        setDescription("");
        setDuration(0);
        navigation.navigate("ListTimesheet");
      })
      .catch((err) => alert("Erreur : ", err, "Try again"));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <DatePicker date={date} setDate={setDate} />
        <View
          style={{
            height: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            alignContent: "space-around",
          }}
        >
          <View style={{ flex: 4, justifyContent: "center", marginTop: 20 }}>
            <Input
              style={styles.inputTemps}
              onChangeText={setDuration}
              value={duration ? String(duration) : String()}
              placeholder="0"
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>min</Text>
          </View>
        </View>
        <View
          style={{
            height: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            alignContent: "space-around",
          }}
        >
          <Input
            style={styles.inputDesc}
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
          />
        </View>

        {/* affiche la liste des projets */}
        <ProjectPicker
          projectsList={projectsList}
          setprojectsList={setprojectsList}
        />
      </View>
      <View style={styles.buttonContainer}>
        {description && duration ? (
          <Button
            style={styles.button}
            title="Save"
            onPress={saveTime}
          ></Button>
        ) : (
          <Button
            style={styles.button}
            title="Save"
            onPress={saveTime}
            disabled
          ></Button>
        )}

        <Button
          style={styles.button}
          title="  Show history"
          type="Clear"
          onPress={() => navigation.navigate("ListTimesheet")}
          icon={<FontAwesome5 name="business-time" size={18} color="grey" />}
        ></Button>
      </View>
    </View>
  );
}
// #endregion

// #region ListTimesheetScreen
function ListTimesheet({ navigation }) {
  const [listTimeSheet, setListTimeSheet] = useState([
    { project: { color: {} }, user: {}, _id: 0 },
  ]);

  // RECUPERATION DES ELEMENTS DE CONTEXT
  const { token, currentUser } = useContext(AuthContext);

  // RECUPERATION DES TEMPS
  async function fetchAndSetTimesheet() {
    await services
      .getAllTimesheetList(token)
      .then((res) => {
        setListTimeSheet(res);
      })
      .catch(() => alert("Impossible to charge list of timesheets"));
  }

  useEffect(() => {
    fetchAndSetTimesheet();
  }, []);

  // SUPPRESSION DU TEMPS
  function handleDeleteTime(time) {
    services
      .deleteTimesheetById(token, time._id)
      .then(() => {
        fetchAndSetTimesheet();
        alert("Time Deleted");
      })
      .catch((e) => console.log("Erreur delete project : ", e));
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollViewContainer}>
        {listTimeSheet.map((time) => {
          return (
            <View key={time._id} style={styles.timesheetContainer}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 9 }}>
                  {/* Haut du cadre */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {dayjs(time.date).format("DD-MM-YY")}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                        {(time.duration - (time.duration % 60)) / 60} h{" "}
                        {time.duration % 60} min
                      </Text>
                    </View>
                  </View>
                  {/* bas du cadre */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold" }}>
                        {time.project.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ textAlign: "left" }}>{time.desc}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    margin: 0,
                    alignSelf: "auto",
                  }}
                >
                  <Button
                    type="Clear"
                    onPress={() => handleDeleteTime(time)}
                    icon={{
                      type: "materialIcons",
                      name: "delete-forever",
                      color: "grey",
                    }}
                  ></Button>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// #endregion

// #region styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-start",
    padding: 10,
  },
  button: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  inputTemps: {
    padding: 2,
    textAlign: "right",
  },
  inputDesc: {
    padding: 2,
    textAlign: "center",
  },

  buttonContainer: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
  },

  timesheetContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFFAFA",
    borderRadius: 10,
    marginBottom: 10,
  },
  scrollViewContainer: {
    flex: 4,
  },
});

// #endregion
