import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import serverless from "serverless-http";
import path from "path";

const app = express();
const port = 3000;
const API_Key = "9d3ccd765765f4c99cb57588cfd60b1d";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/weather", async(req, res) => {
    try {
        const city_name = req.body.city;    

        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${API_Key}`);
        const response1 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${API_Key}&units=metric`)
        const response2 = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${response.data[0].lat}&lon=${response.data[0].lon}&appid=${API_Key}&units=metric`)

        function capitalizeFirstLetter(string){
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        function roundToInteger(number){
            return Math.round(number);
        }

        app.locals.capitalizeFirstLetter = capitalizeFirstLetter;
        app.locals.roundToInteger = roundToInteger;

        const date = new Date();
        const currentDate = {
            day : date.getDate(),
            month : date.getMonth() + 1,
            year : date.getFullYear(),
        }

        res.render("weather.ejs", {

            date: currentDate,
            city: city_name,
            info: response1.data,
            info1: response2.data,

        })
        
    } catch (error) {
        res.render("index.ejs", {
            error: "No weather data available",
        });
    }
})

app.listen(port, () => {
    console.log(`Server running on port number ${port}.`);
});


