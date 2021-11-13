import React, { useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
async function getData(path) {
  const response = await fetch("https://reactnative.dev/movies.json" + path);
  const json = await response.json();
  return json;
}

const heroImgFile = "cloudy-rainy.png";
const currentTemp = 22;
const App = () => {
  return (
    <ScrollView style={{ backgroundColor: "#809EA1" }}>
      <View style={styles.holyWrapper}>
        <View style={styles.heroWrapper}>
          <View style={styles.hero}>
            <View style={styles.heroWeather}>
              <Image
                style={styles.heroImg}
                source={require("./images/" + heroImgFile)}
              />
              <Text style={styles.heroTemp}>{currentTemp + "°"}</Text>
            </View>
            <View style={styles.weatherSwipeWrapper}>
              <ScrollView
                style={styles.weatherSwipe}
                //pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                decelerationRate="fast"
                snapToInterval={wp("100%")}
                snapToAlignment={"center"}
                contentInset={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                }}
              >
                <View style={styles.weatherSwipeDay} />
                <View style={styles.weatherSwipeDay} />
                <View style={styles.weatherSwipeDay} />
                <View style={styles.weatherSwipeDay} />
                <View style={styles.weatherSwipeDay} />
              </ScrollView>
            </View>
          </View>
        </View>
        <LineChart
    data={{
      labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={wp('80%')} // from react-native
    height={220}
    yAxisLabel=""
    yAxisSuffix="°"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#809EA1",
      backgroundGradientFrom: "#809EA1",
      backgroundGradientTo: "#809E00",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
      </View>
    </ScrollView>
  );
};

async function fillOut() {
  var answer = await getData("");
  console.log(answer);
}
fillOut();

const styles = StyleSheet.create({
  holyWrapper: {
    alignItems: "center",
    width: wp("100%"),
  },
  heroWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hero: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: hp("100%"),
    width: wp("74.3%"),
  },
  heroWeather: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: wp("74.3%"),
  },
  heroImg: {
    width: wp("25%"),
    height: wp("25%"),

    resizeMode: "contain",
  },
  heroTemp: {
    fontSize: wp("25%"),
    color: "#fff",
    fontWeight: "bold",
  },
  weatherSwipeWrapper: {
    marginTop: 20,
    height: 100,
    justifyContent: "center",
    alignContent: "center",
  },
  weatherSwipe: {
    width: wp("64%"),
  },
  weatherSwipeDay: {
    backgroundColor: "blue",
    width: wp("50%"),
    margin: 10,
    height: 40,
    borderRadius: 10,
    //paddingHorizontal : 30
  },
});
export default App;
