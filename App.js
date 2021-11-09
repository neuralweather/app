import React, { useEffect } from "react";
import { View, ScrollView, Image, StyleSheet, Text, Animated, FlatList, SafeAreaView, StatusBar } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Swipeable from 'react-native-gesture-handler/Swipeable';

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
      <View style={styles.heroWrapper}>
        <View style={styles.hero}>
          <Image
            style={styles.heroImg}
            source={require("./images/" + heroImgFile)}
          />
          <Text style={styles.heroTemp}>{currentTemp + "°"}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const todoList = [
  { id: '1', text: 'Learn JavaScript' },
  { id: '2', text: 'Learn React' },
  { id: '3', text: 'Learn TypeScript' },
];
const Separator = () => <View style={styles.itemSeparator} />;
const LeftSwipeActions = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
    >
      <Text
        style={{
          color: '#40394a',
          paddingHorizontal: 10,
          fontWeight: '600',
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Bookmark
      </Text>
    </View>
  );
};
const rightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: '#ff8303',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Text
        style={{
          color: '#1b1a17',
          paddingHorizontal: 10,
          fontWeight: '600',
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};
const swipeFromLeftOpen = () => {
  alert('Swipe from left');
};
const swipeFromRightOpen = () => {
  alert('Swipe from right');
};
const ListItem = ({ text }) => (
  <Swipeable
    renderLeftActions={LeftSwipeActions}
    renderRightActions={rightSwipeActions}
    onSwipeableRightOpen={swipeFromRightOpen}
    onSwipeableLeftOpen={swipeFromLeftOpen}
  >
    <View
      style={{
        paddingHorizontal: 30,
        paddingVertical: 20,
        backgroundColor: 'white',
      }}
    >
      <Text style={{ fontSize: 24 }} style={{ fontSize: 20 }}>
        {text}
      </Text>
    </View>
  </Swipeable>
);
const SwipeGesture = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          Swipe right or left
        </Text>
        <FlatList
          data={todoList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListItem {...item} />}
          ItemSeparatorComponent={() => <Separator />}
        />
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
});

async function a() {
  var answer = await getData("");
  console.log(answer);
}
a();

/*const styles = StyleSheet.create({
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
});*/
export default SwipeGesture;
