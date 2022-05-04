import React, { useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import services from "../services";
import { AuthContext } from "../AuthProvider";

export default function ProjectPicker() {
  // RECUPERATION DE LA LISTE DE PROJET
  const [projectsList, setprojectsList] = useState([]);
  const [projectSelect, setProjectSelect] = useState("");
  const { token, currentUser } = useContext(AuthContext);

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
  );
}
