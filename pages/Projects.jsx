import React, { useContext, useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../AuthProvider";
import services from "../services";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";

import { ColorPicker } from "react-native-color-picker";

const ProjectStack = createNativeStackNavigator();

export default function Projects() {
  return (
    <ProjectStack.Navigator>
      <ProjectStack.Screen
        name="My Projects"
        component={ProjectsDisplay}
        options={{ headerShown: false }}
      ></ProjectStack.Screen>
      <ProjectStack.Screen
        name="Add Project"
        component={ProjectsAdd}
      ></ProjectStack.Screen>
    </ProjectStack.Navigator>
  );
}

function ProjectsDisplay({ navigation }) {
  const [projectsList, setprojectsList] = useState([]);
  const { token } = useContext(AuthContext);
  const isFocused = useIsFocused();

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
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text>Projects</Text>
      <View>
        <ScrollView>
          {projectsList.map((project) => {
            return (
              <View key={project._id}>
                <Text>{project.name}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <Button
        title="Add Project"
        type="Clear"
        onPress={() => navigation.navigate("Add Project")}
        icon={{ type: "materialIcons", name: "playlist-add", color: "grey" }}
      />
    </View>
  );
}

function ProjectsAdd({ navigation }) {
  const { token, currentUser } = useContext(AuthContext);
  const [projectName, setProjectName] = useState();
  const [selectedColor, setSelectedColor] = useState("#ff0000");

  const onPressAddProject = () => {
    const body = {
      name: projectName,
      user: currentUser._id,
      r: hexToRgb(selectedColor).r,
      g: hexToRgb(selectedColor).g,
      b: hexToRgb(selectedColor).b,
    };

    services
      .createProject({ body, token })
      .then(() => {
        alert("Project successfully created");
      })
      .catch((err) => {
        console.log(err);
        alert("Incorrect entry");
      });
    navigation.navigate("My Projects");
  };

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="Project Name"
        onChangeText={setProjectName}
        value={projectName}
      />
      <ColorPicker
        onColorSelected={(color) => setSelectedColor(color)}
        style={styles.colorPicker}
      />
      <Button
        title="Add New Project"
        type="solid"
        icon={{ type: "materialIcons", name: "playlist-add", color: "white" }}
        onPress={onPressAddProject}
        style={styles.button}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    padding: 50,
  },
  input: {
    flex: 1,
    textAlign: "center",
  },
  colorPicker: {
    flex: 0.5,
    paddingLeft: 50,
    paddingRight: 50,
  },
  button: {
    marginTop: 5,
  },
});
