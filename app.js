const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static(__dirname +'/public'));
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(request, response){
    // console.log(request);
    response.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    var data = {
        members:[
          {
            email_address: email,
            status: "subscribed",
            merge_fields:{
              FNAME: firstName,
              LNAME: lastName
            }
          }
        ]
    };
    const jsonData = JSON.stringify(data)
    const url = `https://us14.api.mailchimp.com/3.0/lists/(Audience id)`
    const options={
      method:"POST",
      auth:"{Mailchimpusername}:{Mailchimpapikey}-us14"
    }
    const requires_toMailChimp = https.request(url, options, function(response){

      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }


      response.on("data", function(data){
        console.log(JSON.parse(data));
      });
    });

    requires_toMailChimp.write(jsonData);
    requires_toMailChimp.end();
});


app.post("/failure", (req, res) => {
  res.redirect("/");
});


app.listen(process.env.PORT, () =>{
  console.log("Server is up and running.");
});
