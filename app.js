require("dotenv").config();

const express = require("express");
const app = express();

const https = require("https");

//Static Folder
app.use(express.static("public"));

//Bodyparser
app.use(express.urlencoded({ extended: true }));

//EJS - view engine
app.set("view engine", "ejs");

////////////////////////////////////////////////////////////////// SESSION

app.get("/", function (req, res) {
    res.render("home");
})


app.post("/", function (req, res) {

    //Receiving data from user input
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //Creating data object accepted by Mailchimp API
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //Mailchimp API accepts stringified version.
    const jsonData = JSON.stringify(data);

    //Mailchimp API endpoint
    const url = "https://us1.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
    //Required Options
    const options = {
        method: "POST",
        auth: "Faraz01:" + process.env.API_KEY
    }

    //Creating request
    const request = https.request(url, options, function (response) {

        if (response.statusCode == 200) {
            res.render("success");
        } else {
            res.render("failure");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    //Writing Data on mailchimp using the same request 
    request.write(jsonData);
    request.end();

});

////////////////////////////////////////////////////////////////// PORT

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}


app.listen(port, function () {
    console.log("Server has started successfully.");
});
