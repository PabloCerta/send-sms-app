const express = require('express');
const router = express.Router();

// Called when a contact is flowing through the Journey
router.post('/execute', function(req, res) {
    console.log('debug: api/activity/execute');

    //TO-DO: Llamar API SMS
    const request = req.body;

    console.log(" req.body", JSON.stringify(req.body));

    const responseObject = {};

    console.log('Response Object', JSON.stringify(responseObject));

    return res.status(200).json(responseObject);
});

// Called when a Journey is saving the activity
router.post('/save', function(req, res) {
    console.log('debug: api/activity/save');
    return res.status(200).json({});
});

// Called when a Journey has been published
router.post('/publish', function(req, res) {
    console.log('debug: api/activity/publish');
    return res.status(200).json({});
});

// Called when Journey Builder wants you to validate the configuration to ensure the configuration is valid
router.post('/validate', function(req, res) {
    console.log('debug: api/activity/validate');
    return res.status(200).json({});
});

// Called when a Journey is stopped
router.post('/stop', function(req, res) {
    console.log('debug: api/activity/stop');
    return res.status(200).json({});
});

module.exports = router;
