import React, { useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Text } from "react-native";

async function getData(path) {
    const response = await fetch("https://reactnative.dev/movies.json" + path);
    const json = await response.json();
    return json;
}

const heroBgImgFile = "cloudy-rainy.png";

const HeroBg = () => {
    return (
        <View>
            <Image style={styles.heroBgImg} source={require("./images/"+heroBgImgFile)} />
            <Text>hallo</Text>
        </View>
    );
};

const App = () => {
    return (
        <ScrollView style={{backgroundColor: '#809EA1'}}>
            <View style={{ height: 1000, flex: 1, alignItems: 'center'}}>
                <HeroBg/>
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
        height: '50%',
        resizeMode: 'contain'
    },
});
export default App;
