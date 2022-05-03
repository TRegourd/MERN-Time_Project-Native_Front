import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AuthContext } from "../AuthProvider";
import services from "../services";

export default function Projects() {
  const [projectsList, setprojectsList] = useState([]);
  const { token } = useContext(AuthContext);

  function fetchAndSetProjects() {
    services
      .getProjectsList(token)
      .then((res) => {
        console.log("project list", res);
        setprojectsList(res);
      })
      .catch(() => alert("Impossible de charger la liste des projets"));
  }

  useEffect(() => {
    fetchAndSetProjects();
  }, []);

  return (
    <View>
      <Text>Projects</Text>
      <View></View>
    </View>
  );
}
