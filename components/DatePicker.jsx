import React, { useState } from "react";
import { View } from "react-native";
import { Button } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

export function DatePicker({ date, setDate }) {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

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

  return (
    <View
    // style={{
    //   height: 60,
    //   flexDirection: "row",
    //   alignItems: "center",
    //   justifyContent: "center",
    //   padding: 10,
    // }}
    >
      {show && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode={mode}
          display="calendar"
          onChange={onChange}
        />
      )}
      {!show && (
        <Button
          onPress={showDatepicker}
          title={dayjs(date).format("DD-MM-YY")}
          type="outline"
        />
      )}
    </View>
  );
}
