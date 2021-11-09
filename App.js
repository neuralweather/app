import React, { useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Text, useWindowDimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {  TabView, SceneMap } from 'react-native-tab-view';
async function getData(path) {
  const response = await fetch("https://reactnative.dev/movies.json" + path);
  const json = await response.json();
  return json;
}
const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#ff4081' }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});
const heroImgFile = "cloudy-rainy.png";
const currentTemp = 22;
const App = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
  return (
    <ScrollView style={{ backgroundColor: "#809EA1" }}>
      <View style={styles.heroWrapper}>
        <View style={styles.hero}>
          <Image
            style={styles.heroImg}
            source={require("./images/" + heroImgFile)}
          />
          <Text style={styles.heroTemp}>{currentTemp + "°"}</Text>
        </View>
      </View>
      <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
    </ScrollView>
  );
};

async function a() {
  var answer = await getData("");
  console.log(answer);
}
a();

const styles = StyleSheet.create({
  heroWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    justifyContent: "space-Between",
    flexDirection: "row",
    height: hp("100%"),
    width: wp("74.3%"),
  },
  heroImg: {
    width: wp("23.56%"),
    height: wp("23.56%"),

    resizeMode: "contain",
  },
  heroTemp: {
    fontSize: wp("16.5%"),
    color: "#fff",
    fontWeight: "bold",
  },
});
export default App;
