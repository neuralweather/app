/**
 * @fileoverview React Native App to visualize weather data from the server, written for a school project
 * @author Timon Gärtner
 */

"use strict";

import React, { StrictMode, useEffect, useState } from "react";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LineChart, BarChart } from "react-native-chart-kit";

/**
 * ip address of server
 * @type {string}
 */
const server = "http://127.0.0.1:8080/";

/**
 * checks if app is rendered for the first time
 * @type {boolean}
 */
let firstLoad = true;

/**
 *
 * @param {string} path to fetch
 * @returns {Promise} Promise with json data
 */
async function getData(path) {
    console.log("fetching data");
    const response = await fetch(server + path); // fetch data from server
    const json = await response.json(); // converts server response to json
    return json;
}
/**
 *
 * @param {{str: {string}, str: {string}}=} params to query (e.g. {'from': '12334321', 'to': '13254567'})
 * @returns {string} query string to be used in fetch (e.g. 'from=12334321&to=13254567')
 */
function createQueryParametersString(params) {
    const url = new URLSearchParams(params); // creates a query string from the params object
    return url;
}
/** String Array of Week Days (indexes equaling Date-Object getDay) */
const weekDays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
];

/** Object with Images to be shown in the app hero-page */
const heroImgs = {
    sunny: require("./images/sunny.png"),
    cloudy: require("./images/cloudy.png"),
    rainy: require("./images/rainy.png"),
    snowy: require("./images/snowy.png"),
};
let currentDate = new Date();
let weatherData;
function setDay(change) {
    // 86400000 = 1 day in ms
    currentDate.setTime(currentDate.getTime() + change * 86400000); // sets currentDate to currentDate + change*days
}

/**
 * sorts an Object by its keys and reverses it
 * @param {object} obj (e.g. {1: 'a', 3: 'b', 2: 'c'})
 * @returns {Array} Array of sorted keys and values (e.g. [[3, 'b'], [2, 'c'], [1, 'a']])
 */
function reverseSortObject(obj) {
    return Object.entries(obj)
        .sort((a, b) => a[0] - b[0]) // sorts by key
        .reverse(); // reverses the order
}
/**
 *
 * @param {Array} arr (e.g. [[1, 'a'], [2, 'b'], [3, 'c']])
 * @param {*} toVal (e.g. 2)
 * @returns {Array} Array (e.g. [[1, 'a'], [2, 'b']])
 */
function getArrayToVal(arr, toVal) {
    return arr.filter((e) => e[0] <= toVal); // returns array from arr where key is <= toVal
}

/**
 *
 * @param {Array} arr (e.g. [[1, 'a'], [2, 'b'], [3, 'c']])
 * @param {*} fromVal (e.g. 2)
 * @returns {Array} Array (e.g. [[2, 'b'], [3, 'c']])
 */
function getArrayFromVal(arr, fromVal) {
    return arr.filter((e) => e[0] >= fromVal); // returns array from arr where key is >= fromVal
}

/**
 *
 * @param {Array} data
 * @param {int} resolution
 * @param {int} endOfWeek
 * @param {int} days
 * @returns {Array} Array of data from endOfWeek - days to endOfWeek with length = resolution
 */
function getDataOverTime(data, resolution, endOfWeek, days) {
    const steps = (86400000 * days) / resolution; // calculates step size in ms
    const dataOverWeek = [];
    // appends resolution amount of data to dataOverWeek, appends nearest smaller key from endOfWeek - i * stepsize to endOfWeek
    for (let i = resolution - 1; i >= 0; i--) {
        try {
            dataOverWeek.push(
                getArrayToVal(
                    data,
                    endOfWeek - i * steps + 85000000 /* 85000000 offset */
                )[0][1]
            );
        } catch (e) {
            dataOverWeek.push(0); // if no data is available, append 0
        }
    }
    return dataOverWeek;
}
/**
 *
 * @param {Array} data
 * @param {int} from
 * @param {int} to
 * @returns {number} average of data from @param from to @param to
 */
function getAvgDataOverTime(data, from, to) {
    let sum = 0;
    const dataFromTo = getArrayToVal(getArrayFromVal(data, from), to); // gets data "from" from to "to"
    const length = dataFromTo.length; // gets length of dataFromTo
    if (length == 0) {
        return 0; // if no data is available, return 0
    }
    for (let i = 0; i < length; i++) {
        sum += dataFromTo[i][1]; // sums up all data
    }

    return sum / length; // sum divided by length = average
}
/**
 * 
 * @param {Object} data 
 * @param {int} days 
 * @returns {Array} Array of avg data from now-days to now 
 * 
 */
function getArrayOfAvgDataPerDay(data, days) {

        // clones currentDate sets it to the time at 00:00:00
        // (needed for avg calculation, because avg is calculated from 00:00:00 to 00:00:00)
        let midNightDate = new Date(currentDate.getTime());
        midNightDate.setHours(0, 0, 0, 0);
        let response = [];
        for (let i = days-1; i >= 0; i--) {
            response.push(
                Math.round(getAvgDataOverTime(
                    data,
                    midNightDate.getTime() - 86400000 * i,
                    midNightDate.getTime() - 86400000 * (i-1)
                )*100)/100 // gets avg data the day x days before currentDate
                //Math.round(x*100)/100 // rounds to 2 decimals
            );
        }
        return response;
}
    
/**
 * 
 * @param {{"section": (string), "historyChart": Array<num>, "avgChart": (Array<num>), "segmentsAvg": (number), "segmentsHistory": (number) "unit": (char)}=} props
 * section: Content the info is about (e.g. "Temperature")
 * historyChart: history Chart Array
 * avgChart: avg Data Chart Array
 * segmentsAvg: number of y segments in the avg chart
 * segmentsHistory: number of y segments in the History chart
 * unit: unit of the data (e.g. "°")
 * @returns rendered weather info component
 */
const WeatherInfoComponent = (props) => {
    const section = props.section;
    const historyChart = props.historyChart;
    const avgChart = props.avgChart;
    const segmentsHistory = props.segmentsHistory;
    const segmentsAvg = props.segmentsAvg;
    const unit = props.unit;

    return (
        <View style={styles.holyWrapper}>
            <View style={styles.weatherChartWrapper}>
                <View style={styles.weatherChart}>
                    <Text style={styles.weatherChartTitle}>{section}</Text>
                    <Text style={styles.chartSubtitle}>Historie</Text>
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
                                    data: historyChart,
                                },
                            ],
                        }}
                        width={wp("80%")}
                        height={160}
                        yAxisLabel=""
                        yAxisSuffix={unit}
                        yAxisInterval={1}
                        withInnerLines={true}
                        withHorizontalLines={true}
                        withVerticalLines={false}
                        chartConfig={{
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,

                            backgroundColor: "#6399D1",
                            backgroundGradientFrom: "#6399D1",
                            backgroundGradientTo: "#6399D1",
                            strokeWidth: 4,

                            decimalPlaces: 0,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 20,
                            },
                        }}
                        withDots={false}
                        bezier
                        segments={segmentsHistory}
                        style={{
                            shadowRadius: 10,
                            shadowOffset: 30,
                            backgroundColor: "#6399D1",
                            paddingVertical: 15,
                            marginVertical: 8,
                            borderRadius: 20,

                            paddingRight: 40,
                        }}
                    />
                    <Text style={styles.chartSubtitle}>Durchschnitt</Text>
                    <BarChart
                        style={{
                            shadowRadius: 10,
                            shadowOffset: 30,
                            backgroundColor: "#6399D1",
                            paddingVertical: 15,
                            marginVertical: 8,
                            borderRadius: 20,

                            paddingRight: 40,
                        }}
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
                                    data: avgChart,
                                },
                            ],
                        }}
                        width={wp("80%")}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix={unit}
                        chartConfig={{
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,

                            backgroundColor: "#6399D1",
                            backgroundGradientFrom: "#6399D1",
                            backgroundGradientTo: "#6399D1",
                            strokeWidth: 4,

                            decimalPlaces: 0,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                        }}
                        segments={segmentsAvg}
                        showValuesOnTopOfBars
                    />
                </View>
            </View>
            <View style={styles.splitLine}></View>
        </View>
    );
};

/**
 *  @returns jsx - rendered App
 */
const App = () => {
    /*
    consts that are used in the app and change (e.g. for Charts)
    */
    const /** !string */ [currentDateHtml, setCurrentDateHtml] = useState(
            currentDate.toDateString()
        );
    const /** !number */ [currentTempDataHtml, setCurrentTempHtml] = useState();
    const /** !Array<number> */ [tempChart, setTempChart] = useState([0]);
    const /** !Array<number> */ [tempAvgChart, setTempAvgChart] = useState([0]);
    const /** !Array<number> */ [windChart, setWindChart] = useState([0]);
    const /** !Array<number> */ [windAvgChart, setWindAvgChart] = useState([0]);
    const /** !Array<number> */ [pressureChart, setPressureChart] = useState([0]);
    const /** !Array<number> */ [pressureAvgChart, setPressureAvgChart] = useState([0]);
    const /** !Array<number> */ [rainChart, setRainChart] = useState([0]);
    const /** !Array<number> */ [rainAvgChart, setRainAvgChart] = useState([0]);
    const /** !Array<number> */ [humidityChart, setHumidityChart] = useState([0]);
    const /** !Array<number> */ [humidityAvgChart, setHumidityAvgChart] = useState([0]);
    const /** !string */ [heroImg, setHeroImg] = useState(heroImgs.cloudy);

    /**
     * @name updateData()
     * updates all consts used in the app
     * @see currentDateHtml, @see currentTempDataHtml, @see tempChart, @see tempAvgChart, @see heroImg
     */
    const updateData = async () => {
        console.log("updating data");
        try {
            //  86400000 = 1 day in milliseconds
            let url = await createQueryParametersString({
                from: Math.floor((currentDate.getTime() - 86400000 * 7) / 1000),
                to: Math.floor(currentDate.getTime() / 1000),
            });
            weatherData = await getData("data?" + url);
        } catch (e) {
            Alert.alert("Konnte keine Verbindung zum Server herstellen!");
            return;
        }

        let weatherDataTemp = {
            temperature: {},
            humidity: {},
            pressure: {},
            wind: {},
            rain: {},
        };
        // loops through every object (timestamp) of weatherData and splits the categories into its own object
        for (const i of weatherData) {
            weatherDataTemp.temperature[
                i.timestamp * 1000 /* utcTimestamp in s to ms */
            ] = i.temperature;
            weatherDataTemp.humidity[i.timestamp * 1000] = i.humidity;
            weatherDataTemp.pressure[i.timestamp * 1000] = i.pressure;
            weatherDataTemp.wind[i.timestamp * 1000] = i.windspeed;
            weatherDataTemp.rain[i.timestamp * 1000] = i.rain;
        }

        const sortedTemperature = reverseSortObject(
            weatherDataTemp.temperature
        ); // sorts temperature object by its keys and reverses it (needed multiple times below)
        const sortedHumidity = reverseSortObject(weatherDataTemp.humidity);
        const sortedPressure = reverseSortObject(weatherDataTemp.pressure);
        const sortedWind = reverseSortObject(weatherDataTemp.wind);
        const sortedRain = reverseSortObject(weatherDataTemp.rain);

        try {
            // sets currentTempHtml to the first value of sortedTemperature
            // (the latest)
            setCurrentTempHtml(Math.round(sortedTemperature[0][1]));
        } catch (e) {
            setCurrentTempHtml(0); // if no data is available, set 0
        }
        console.log("updating Charts");
        setTempChart(
            getDataOverTime(
                sortedTemperature,
                40 /* resolution */,
                currentDate.getTime(),
                7 /* over x days */
            )
        );
        setTempAvgChart(getArrayOfAvgDataPerDay(sortedTemperature, 7));
        setWindChart(
            getDataOverTime(
                sortedWind,
                40 /* resolution */,
                currentDate.getTime(),
                7 /* over x days */
            )
        );
        setWindAvgChart(getArrayOfAvgDataPerDay(sortedWind, 7));
        setPressureChart(
            getDataOverTime(
                sortedPressure,
                40 /* resolution */,
                currentDate.getTime(),
                7 /* over x days */
            )
        );
        setPressureAvgChart(getArrayOfAvgDataPerDay(sortedPressure, 7));
        setRainChart(
            getDataOverTime(
                sortedRain,
                40 /* resolution */,
                currentDate.getTime(),
                7 /* over x days */
            )
        );
        setRainAvgChart(getArrayOfAvgDataPerDay(sortedRain, 7));
        setHumidityChart(
            getDataOverTime(
                sortedHumidity,
                40 /* resolution */,
                currentDate.getTime(),
                7 /* over x days */
            )
        );
        setHumidityAvgChart(getArrayOfAvgDataPerDay(sortedHumidity, 7));

        // sets the hero image
        if (sortedTemperature[0][1] > 20 && sortedRain[0][1] < 1000) {
            setHeroImg(heroImgs.sunny);
        }
        else if (sortedRain[0][1] > 1000 && sortedTemperature[0][1] > -2.2 && sortedTemperature[0][1] < 2.2) {
            setHeroImg(heroImgs.snowy);
        }
        else if (sortedRain[0][1] > 1000) {
            setHeroImg(heroImgs.rainy);
        }
        else {
            setHeroImg(heroImgs.cloudy);
        }

    }
    /**
     * @name setLastDay()
     * updates the date in the app to the date before the current date
     * loads the data for the new date
     */
    const setLastDay = () => {
        console.log("updating the apps data to the last day");
        setDay(-1);
        setCurrentDateHtml(currentDate.toDateString());
        updateData();
    };
    /**
     * @name setNextDay()
     * updates the date in the app to the date after the current date
     * loads the data for the new date
     */
    const setNextDay = () => {
        console.log("updating the apps data to the next day");
        setDay(1);
        setCurrentDateHtml(currentDate.toDateString());
        updateData();
    };

    // if the app is started for the first time, load the data
    if (firstLoad) {
        updateData();
        firstLoad = false;
    }

    // jsx
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
                                source={heroImg}
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
                                    {currentDateHtml}
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
                <WeatherInfoComponent section="Temperatur" historyChart={tempChart} avgChart={tempAvgChart} unit="°" segmentsAvg={3} segmentsHistory={5}/>
                <WeatherInfoComponent section="Regen" historyChart={rainChart} avgChart={rainAvgChart} unit="" segmentsAvg={2} segmentsHistory={2}/>
                <WeatherInfoComponent section="Luftfeuchtigkeit" historyChart={humidityChart} avgChart={humidityAvgChart} unit="%" segmentsAvg={3} segmentsHistory={5}/>
                <WeatherInfoComponent section="Luftdruck" historyChart={pressureChart} avgChart={pressureAvgChart} unit="hPa" segmentsAvg={3} segmentsHistory={5}/>
                <WeatherInfoComponent section={"Wind-\ngeschwindigkeit"} historyChart={windChart} avgChart={windAvgChart} unit="km/h" segmentsAvg={3} segmentsHistory={5}/>

            </View>
        </ScrollView>
    );
};

/**
 * Styles for the jsx (react native components)
 */
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
    chartSubtitle: {
        fontSize: wp("5%"),
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
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
