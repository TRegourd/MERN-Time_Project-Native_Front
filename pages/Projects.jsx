import React, { useContext, useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../AuthProvider";
import services from "../services";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  }, [projectsList]);

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

  const onPressAddProject = () => {
    const body = {
      name: projectName,
      user: currentUser._id,
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
      <Button
        title="Add New Project"
        type="solid"
        icon={{ type: "materialIcons", name: "playlist-add", color: "white" }}
        onPress={onPressAddProject}
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
  input: {
    flex: 1,
    textAlign: "center",
  },
});
