"use strict";

import React, { StrictMode, useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    Button,
    TouchableOpacity,
    Alert,
} from "react-native";
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
    StackedBarChart,
} from "react-native-chart-kit";
const server = "http://127.0.0.1:8080/";
let firstLoad = true;
async function getData(path) {
    const response = await fetch(server + path);
    const json = await response.json();
    return json;
}
function createQueryParametersString(params) {
    url = new URLSearchParams(params);
    return url;
}
const weekDays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
];

//visualize: temperatur, regen, luftdruck, luftfeuchtigkeit, windgeschwindigkeit,

const heroImgs = {
    sunny: "sunny.png",
    cloudy: "cloudy.png",
    rainy: "rainy.png",
    snowy: "snowy.png",
};
let currentDate = new Date();
let weatherData;
function setDay(change) {
    currentDate.setDate(currentDate.getDate() + change);
}

//sorts dict and returns
function reverseSortObject(obj) {
    return Object.entries(obj)
        .sort((a, b) => a[0] - b[0])
        .reverse();
}
//gets all values to a value
function getObjectToVal(object, toVal) {
    return object.filter((e) => e[0] <= toVal);
}
//gets all balues from a value
function getObjectFromVal(object, fromVal) {
    return object.filter((e) => e[0] >= fromVal);
}
/*
input: [ [ 'foo', 3 ], [ 'bar', 2 ] ], 1
output: [3,2]
*/
function getNthElOfElsInArray(arr, n) {
    return arr.map((el) => el[n]);
}
//returns list of data for a time in days with a resolution for a given list
function getDataOverTime(data, resolution, endOfWeek, days) {
    const steps = (86400000 * days) / resolution;
    const dataOverWeek = [];
    for (let i = resolution-1; i >= 0; i--) {
        try {
            dataOverWeek.push(getObjectToVal(data, endOfWeek - (i * steps+steps*(2/7*resolution)))[0][1]);
        } catch (e) {
            dataOverWeek.push(0);
        }
    }
    return dataOverWeek;
}

const App = () => {
    const [currentDateHtml, setCurrentDateHtml] = useState(currentDate);
    const [currentTempDataHtml, setCurrentTempHtml] = useState();
    const [tempChart, setTempChart] = useState([]);
    const [heroImg, setHeroImg] = useState(heroImgs.cloudy);

    const updateData = async () => {
        //try {
        //  86400000 = 1 day in milliseconds
        //let url = createQueryParametersString({
        // fromDate: currentDate.getTime() - 86400000 * 7,
        // toDate: currentDate.getTime(),
        //});
        //"temp?fromDate="+(currentDate.getDate()-5).toDateString()+"&toDate="+(currentDate.getDate()+5).toDateString()
        let weatherDataTemp = {
            temperature: {},
            humidity: {},
            pressure: {},
            wind: {},
        };
        weatherData = await getData("data");
        for (const i of weatherData) {
            weatherDataTemp.temperature[i.timestamp*1000] = i.temperature;
        }
        const sortedTemperature = reverseSortObject(
            weatherDataTemp.temperature
        );
        setCurrentTempHtml(Math.round(sortedTemperature[0][1]));
        setTempChart(
            getDataOverTime(sortedTemperature, 40, currentDate.getTime(), 7)
        );
        // } catch (e) {
        //   Alert.alert("Konnte keine Verbindung zum Server herstellen!");
        // }
    };
    const setLastDay = () => {
        setDay(-1);
        setCurrentDateHtml(currentDate.toDateString());
        updateData();
    };
    const setNextDay = () => {
        setDay(1);
        setCurrentDateHtml(currentDate.toDateString());
        updateData();
    };
    if (firstLoad) {
        updateData();
        firstLoad = false;
    }
    return (
        <ScrollView
            style={{ backgroundColor: "#809EA1" }}
            snapToInterval={hp("70%")}
            snapToAlignment={"center"}
            disableIntervalMomentum={true}
            snapToEnd={false}
        >
            <View style={styles.holyWrapper}>
                <View style={styles.heroWrapper}>
                    <View style={styles.hero}>
                        <View style={styles.heroWeather}>
                            <Image
                                style={styles.heroImg}
                                source={require("./images/" + heroImg)}
                            />
                            <Text style={styles.heroTemp}>
                                {currentTempDataHtml}°C
                            </Text>
                        </View>
                        <View style={styles.weatherSwipeWrapper}>
                            <View style={styles.weatherSwipe}>
                                <TouchableOpacity
                                    style={styles.weatherSwipeBtn}
                                    onPress={setLastDay}
                                >
                                    <Image
                                        style={styles.weatherSwipeBtnIconLeft}
                                        source={require("./images/left-arrow.png")}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.weatherSwipeText}>
                                    {currentDate.toDateString()}
                                </Text>
                                <TouchableOpacity
                                    style={styles.weatherSwipeBtn}
                                    onPress={setNextDay}
                                >
                                    <Image
                                        style={styles.weatherSwipeBtnIconRight}
                                        source={require("./images/right-arrow.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.splitLine}></View>
                <View style={styles.weatherChartWrapper}>
                    <View style={styles.weatherChart}>
                        <Text style={styles.weatherChartTitle}>Temperatur</Text>
                        <LineChart
                            data={{
                                labels: [
                                    weekDays
                                        .slice(currentDate.getDay() - 6)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 5)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 4)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 3)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 2)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 1)[0]
                                        .slice(0, 2),
                                    weekDays
                                        .slice(currentDate.getDay() - 0)[0]
                                        .slice(0, 2),
                                ],
                                datasets: [
                                    {
                                        data: /*getDataOverTime(
                      tempDataHtml,
                      100,
                      currentDate.getTime(),
                      7
                    ),*/ tempChart,
                                    },
                                ],
                            }}
                            width={wp("80%")} // from react-native
                            height={160}
                            yAxisLabel=""
                            yAxisSuffix="°"
                            yAxisInterval={1} // optional, defaults to 1
                            withInnerLines={false}
                            chartConfig={{
                                color: (opacity = 1) =>
                                    `rgba(255, 255, 255, ${opacity})`,

                                backgroundColor: "#6399D1",
                                backgroundGradientFrom: "#6399D1",
                                backgroundGradientTo: "#6399D1",
                                strokeWidth: 4, // optional, default 3

                                decimalPlaces: 2, // optional, defaults to 2dp
                                labelColor: (opacity = 1) =>
                                    `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 20,
                                },
                                propsForDots: {
                                    r: "0",
                                    strokeWidth: "0",
                                    stroke: "#AAAAAA",
                                },
                            }}
                            xAxisInterval={1}
                            bezier
                            fromZero
                            style={{
                                shadowRadius: 10,
                                shadowOffset: 30,
                                backgroundColor: "#6399D1",
                                paddingVertical: 15,
                                //paddingLeft: 30,
                                marginVertical: 8,
                                borderRadius: 20,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.splitLine}></View>
            </View>
        </ScrollView>
    );
};

async function fillOut() {
    var answer = await getData("");
    console.log(answer);
}
//fillOut();

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
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        borderBottomWidth: 10,
        borderTopWidth: 10,
        borderColor: "#BFCFCF",
        paddingVertical: 8,
        borderRadius: 10,
    },
    weatherSwipeDay: {
        backgroundColor: "blue",
        width: wp("50%"),
        margin: 10,
        height: 40,
        borderRadius: 10,
        //paddingHorizontal : 30
    },
    weatherSwipeBtnIcon: {
        width: wp("10%"),
        height: wp("10%"),
        position: "absolute",
        right: 0,
    },
    weatherSwipeText: {
        fontSize: wp("5%"),
        color: "#fff",
        fontWeight: "bold",
    },
    weatherSwipeBtnIconLeft: {
        width: wp("10%"),
        height: wp("10%"),
    },
    weatherSwipeBtnIconRight: {
        width: wp("10%"),
        height: wp("10%"),
    },
    splitLine: {
        width: wp("85%"),
        backgroundColor: "#BDCCCE",
        height: 10,
        borderRadius: 26,
    },
    weatherChartTitle: {
        fontSize: wp("10%"),
        marginTop: 15,
        marginBottom: 10,
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    weatherChartWrapper: {
        marginVertical: hp("20%"),
        width: wp("100%"),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    valueRightNow: {
        fontSize: wp("8%"),
        color: "#fff",
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },
});
export default App;
