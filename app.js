const express = require('express');
const path = require('path');

const app = express();

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// set port
app.set('port', (process.env.PORT || 8000));

// Called when a contact is flowing through the Journey
app.post('/activity/execute', function(req, res) {
    console.log('debug: /activity/execute');

    //TO-DO: Llamar API SMS
    const request = req.body;

    console.log(" req.body", JSON.stringify(req.body));

    const responseObject = {};

    console.log('Response Object', JSON.stringify(responseObject));

    return res.status(200).json(responseObject);
});

// Called when a journey is saving the activity
app.post('/activity/save', function(req, res) {
    console.log('debug: /activity/save');
    return res.status(200).json({});
});

// Called when a Journey has been published
app.post('/activity/publish', function(req, res) {
    console.log('debug: /activity/publish');
    return res.status(200).json({});
});

// Called when Journey Builder wants you to validate the configuration to ensure the configuration is valid
app.post('/activity/validate', function(req, res) {
    console.log('debug: /activity/validate');
    return res.status(200).json({});
});

// Called when a Journey is stopped
app.post('/activity/stop', function(req, res) {
    console.log('debug: /activity/stop');
    return res.status(200).json({});
});

app.listen(app.get('port'), () => console.log(`Server is running...`));