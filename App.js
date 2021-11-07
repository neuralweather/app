import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    Alert,
} from "react-native";

async function getData(path) {
    const response = await fetch("https://reactnative.dev/movies.json" + path);
    const json = await response.json();
    return json;
}

const App = () => {
    return (
        <ScrollView>
            <Text>Some text</Text>
        </ScrollView>
    );
};

async function a(){var answer = await getData(""); console.log(answer)};
a()
export default App;
