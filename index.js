require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const CustomError = require("./CustomError");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post("/api/analyze", (req, res, next) => {
    if (!req.body) {
        return next(new CustomError("Please provide text to analyze"));
    }

    const options = {
        method: "POST",
        url: "https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.API_KEY,
            "X-RapidAPI-Host": "text-analysis12.p.rapidapi.com",
        },
        data: {
            language: "english",
            text: req.body.text,
        },
    };

    axios
        .request(options)
        .then((response) => {
            if (response.data.sentiment === "positive") {
                let confidence = Math.ceil(response.data.aggregate_sentiment.pos * 100);
                res.status(200).json({
                    result: "Positive",
                    confidencePercentage: confidence,
                });
            }
            if (response.data.sentiment === "negative") {
                let confidence = Math.ceil(response.data.aggregate_sentiment.neg * 100);
                res.status(200).json({
                    result: "Negative",
                    confidencePercentage: confidence,
                });
            }
            if (response.data.sentiment === "neutral") {
                let confidence = Math.ceil(response.data.aggregate_sentiment.neu * 100);
                res.status(200).json({
                    result: "Neutral",
                    confidencePercentage: confidence,
                });
            }
        })
        .catch((err) => {
            return next(new CustomError(err, 400));
        });
});

app.listen(PORT, () => {
    console.log("Server started successfully at port " + PORT);
});
