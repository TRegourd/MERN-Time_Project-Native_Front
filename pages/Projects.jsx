import React, { useContext, useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../AuthProvider";
import services from "../services";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";

import { ColorPicker } from "react-native-color-picker";
import hexToRgb from "../lib/hexToRgb";

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
      <ProjectStack.Screen
        name="Edit Project"
        component={ProjectsEdit}
      ></ProjectStack.Screen>
    </ProjectStack.Navigator>
  );
}

function ProjectsDisplay({ navigation }) {
  const [projectsList, setprojectsList] = useState([]);
  const { token, currentUser } = useContext(AuthContext);
  const isFocused = useIsFocused();

  function fetchAndSetProjects() {
    services
      .getProjectsList(token)
      .then((res) => {
        setprojectsList(res);
      })
      .catch(() => alert("Impossible de charger la liste des projets"));
  }

  function onPressDeleteProject(project) {
    services
      .deleteProject(project._id)
      .then(() => {
        fetchAndSetProjects();
        alert("Project Deleted");
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    fetchAndSetProjects();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Projects of {currentUser.first_name} {currentUser.last_name}
      </Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView>
          {projectsList.map((project) => {
            return (
              <View key={project._id} style={styles.projectContainer}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    marginRight: 5,
                    borderRadius: 10,
                    backgroundColor:
                      "rgb(" +
                      project.color.r +
                      "," +
                      project.color.g +
                      "," +
                      project.color.b +
                      ")",
                  }}
                ></View>
                <Text
                  style={styles.project}
                  defaultValue={project.name}
                  placeholder={project.name}
                >
                  {project.name}
                </Text>
                <Button
                  type="Clear"
                  onPress={() =>
                    navigation.navigate("Edit Project", {
                      projectId: project._id,
                      projectName: project.name,
                      projectColorR: project.color.r,
                      projectColorG: project.color.g,
                      projectColorB: project.color.b,
                    })
                  }
                  icon={{
                    type: "materialIcons",
                    name: "edit",
                    color: "grey",
                  }}
                  style={styles.editAndDeleteButton}
                ></Button>
                <Button
                  type="Clear"
                  onPress={() => {
                    onPressDeleteProject(project);
                  }}
                  icon={{
                    type: "materialIcons",
                    name: "delete-forever",
                    color: "grey",
                  }}
                  style={styles.editAndDeleteButton}
                ></Button>
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
  const [selectedColor, setSelectedColor] = useState("#FFFAFA");

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

function ProjectsEdit({ navigation, route }) {
  const [projectName, setProjectName] = useState(route.params.projectName);
  const [selectedColor, setSelectedColor] = useState();

  const onPressEditProject = () => {
    if (selectedColor) {
      services
        .updateProjectColor(route.params.projectId, hexToRgb(selectedColor))
        .then(() => {})
        .catch(() => alert("Impossible de charger la liste des projets"));
    }
    services
      .updateProjectName(route.params.projectId, projectName)
      .then(() => {
        alert("Project successfully edited");
      })
      .catch(() => alert("Impossible de charger la liste des projets"));
    navigation.navigate("My Projects");
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder={projectName}
        onChangeText={setProjectName}
        value={projectName}
      />
      <ColorPicker
        onColorSelected={(color) => setSelectedColor(color)}
        style={styles.colorPicker}
      />
      <Button
        title="Edit Project"
        type="solid"
        icon={{ type: "materialIcons", name: "edit", color: "white" }}
        onPress={onPressEditProject}
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
  title: {
    flex: 1,
    fontSize: 20,
    alignSelf: "center",
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
  scrollViewContainer: {
    flex: 4,
  },
  projectContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 2,
  },
  project: {
    flex: 3,
  },
  editAndDeleteButton: {},
  button: {
    marginTop: 5,
  },
});
