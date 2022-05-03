import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, ToastAndroid, ScrollView } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { AuthContext } from "../AuthProvider";
import services from "../services";

const TimeSheetStack = createNativeStackNavigator();
export default function Timesheets() {
  return (
    <TimeSheetStack.Navigator>
      <TimeSheetStack.Screen
        name="RegisterTimesheet"
        component={RegisterTimesheet}
        options={{ headerShown: false }}
      />
      <TimeSheetStack.Screen name="ListTimesheet" component={ListTimesheet} />
    </TimeSheetStack.Navigator>
  );
}

function RegisterTimesheet({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [description, setDescription] = useState();
  const [duration, setDuration] = useState(0);

  const [projectSelect, setProjectSelect] = useState("");

  // DATE PICKER
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // PROJECT
  const [projectsList, setprojectsList] = useState([]);
  const { token } = useContext(AuthContext);

  function fetchAndSetProjects() {
    services
      .getProjectsList(token)
      .then((res) => {
        setprojectsList(res);
      })
      .catch(() => alert("Impossible de charger la liste des projets"));
  }

  useEffect(() => {
    fetchAndSetProjects();
  }, []);

  function saveTime(e) {
    e.preventDefault();
    const time = {
      desc: description,
      date: date,
      project: projectSelect,
      duration: duration,

      user: "6270e1595cbc7e2cdac39429",
    };
    services
      .createNewTimesheet(token, time)
      .then(() => {
        alert("Time saved");
        const dateReinitialised = new Date();
        setDate(dateReinitialised);
        setDescription("");
        setDuration(0);
      })
      .catch((err) => alert("Erreur : ", err, "Try again"));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={{ textAlign: "center", margin: 20 }}>Record time</Text>
        {show && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <Text style={{ textAlign: "center" }}>
          {("0" + date.getDate()).slice(-2) +
            "/" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "/" +
            date.getFullYear()}
        </Text>
        <Button onPress={showDatepicker} title="Date" type="outline" />
        <Text style={{ marginTop: 15 }}>Description</Text>
        <Input
          style={styles.input}
          onChangeText={setDescription}
          value={description}
        />
        <Text>Duration (min)</Text>
        <Input
          style={styles.input}
          onChangeText={setDuration}
          value={duration ? String(duration) : String()}
        />
        <Picker
          selectedValue={projectSelect}
          mode={"dialog"}
          onValueChange={(itemValue, itemIndex) => setProjectSelect(itemValue)}
        >
          {projectsList.map((item) => (
            <Picker.Item
              style={{ textAlign: "center" }}
              key={item._id}
              label={item.name}
              value={item._id}
            />
          ))}
        </Picker>
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

function ListTimesheet({ navigation }) {
  const [listTimeSheet, setListTimeSheet] = useState([
    { project: { color: {} }, user: {} },
  ]);

  const { token } = useContext(AuthContext);

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

  return (
    <View style={styles.container}>
      <Text>Timesheet</Text>

      <ScrollView>
        {listTimeSheet.map((timesheet) => {
          return (
            <View
              style={{
                height: 20,
                width: 20,
                margin: 5,
                borderRadius: 10,
              }}
            >
              <Text>{timesheet.desc}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  button: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    padding: 2,
    textAlign: "center",
  },

  buttonContainer: {
    flex: 0.25,
    flexDirection: "row",
    justifyContent: "center",
  },
});
