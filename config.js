/**
 * ip address of server
 * @type {string}
 */
export const server = "http://127.0.0.1:8080/";

/**
 * objects, that the app tries to render on the screen
 * e.g.
 * {
 *       "id": "temperature",
 *       "title": "Temperatur",
 *       "unit": "°"
 *   } 
 */
export const config = [
    {
        id: "temperature",
        title: "Temperatur",
        unit: "°",
    },
    {
        id: "rain",
        title: "Regenmenge",
        unit: "",
    },
    {
        id: "humidity",
        title: "Luftfeuchtigkeit",
        unit: "%",
    },
    {
        id: "windspeed",
        title: "Wind-\ngeschwindigkeit",
        unit: "km/h",
    },
    {
        id: "pressure",
        title: "Luftdruck",
        unit: "hPa",
    },
];

/**
 * @type {boolean}
 * if true, the app will disable logging (performance advantage)
 */
export const production = false;