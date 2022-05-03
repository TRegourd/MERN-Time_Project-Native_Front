import AsyncStorage from "@react-native-async-storage/async-storage";

const tokenAsyncStorage = {
  async storeJwt(token) {
    try {
      const jsonValue = JSON.stringify(token);
      await AsyncStorage.setItem("@jwt", jsonValue);
    } catch (e) {
      console.log(e);
    }
  },

  async getJwt() {
    try {
      const jsonValue = await AsyncStorage.getItem("@jwt");
      return jsonValue;
    } catch (e) {
      console.log(e);
    }
  },
};

export default tokenAsyncStorage;
