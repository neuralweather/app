import React, { useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
async function getData(path) {
  const response = await fetch("https://reactnative.dev/movies.json" + path);
  const json = await response.json();
  return json;
}

const heroBgImgFile = "cloudy-rainy.png";

const App = () => {
  return (
    <ScrollView style={{backgroundColor: "#809EA1" }}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Image
        style={styles.heroBgImg}
        source={require("./images/" + heroBgImgFile)}
      />
      </View>
    </ScrollView>
    
  );
};

async function a() {
  var answer = await getData("");
  console.log(answer);
}
a();

const styles = StyleSheet.create({
  heroBgImg: {
    width: wp('50%'),
    height: wp('50%'),

    resizeMode: "contain",
  },
});
export default App;
