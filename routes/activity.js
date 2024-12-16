import express from 'express';
const router = express.Router();

// Called when a contact is flowing through the Journey
router.post('/execute', async function(req, res) {
    console.log('Called: api/activity/execute');
    console.log(`Request body::: ${JSON.stringify(req.body)}`);
    try {
        //Get current Contact info from req.body
        const request = req.body;
        if(!request || !request.inArguments || request.inArguments.length == 0) return res.status(500).end();
        const { smsMessage, contactKey, name, phone } = request.inArguments[0];
        console.log(`Contact processed::: ${contactKey} - ${name}`);
        // Replace attributes
        console.log(`SMS message PRE::: ${smsMessage}`);
        const smsMessageFormatted = smsMessage.replace('${KeyAttribute}', contactKey).replace('${NameAttribute}', name).replace('${PhoneAttribute}', phone);
        console.log(`SMS message POST::: ${smsMessageFormatted}`);
        // Call ENet SMS API
        const response = await fetch(process.env.SMS_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json", "client_id": process.env.CLIENT_ID, "client_secret": process.env.CLIENT_SECRET },
            body: JSON.stringify({ "message": smsMessageFormatted, "msisdn": phone })
        });
        // Process response
        if(!response.ok) {
            console.error(`SMS Response Error::: ${response.status} - ${response.statusText}`);
            return res.status(400).end(); // Status 400 can be changed with response.status
        }
        const jsonResponse = await response.json();
        console.log(`SMS Response Success::: ${JSON.stringify(jsonResponse)}`);
        return res.status(200).json(jsonResponse);
    } catch(error) {
        console.error(`SMS Response Exception::: ${error.message}`);
        return res.status(500).end();
    }
});

// Called when a Journey is saving the activity
router.post('/save', function(req, res) {
    console.log('Called::: api/activity/save');
    return res.status(200).json({});
});

// Called when a Journey has been published
router.post('/publish', function(req, res) {
    console.log('Called::: api/activity/publish');
    return res.status(200).json({});
});

// Called when Journey Builder wants you to validate the configuration to ensure the configuration is valid
router.post('/validate', function(req, res) {
    console.log('Called::: api/activity/validate');
    return res.status(200).json({});
});

// Called when a Journey is stopped
router.post('/stop', function(req, res) {
    console.log('Called::: api/activity/stop');
    return res.status(200).json({});
});

export default router;
