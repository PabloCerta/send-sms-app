// Create a new connection for this session, it's used to talk to Journey Builder
const connection = new Postmonger.Session();

// Variable to store activity JSON
let activity = null;

// Wait for the document to load
document.addEventListener('DOMContentLoaded', function main() {

    // Done button click listener
    document.getElementById('button-submit').addEventListener('click', onDoneButtonClick);

    // SMS message input listener
    document.getElementById("sms-message").addEventListener("input", onSMSMessageChange);

    // Journey Builder will respond with "initActivity" after it receives the "ready" signal
    connection.on('initActivity', onInitActivity);

    // Tell parent iFrame that we are ready.
    connection.trigger('ready');
});

// This function is triggered by Journey Builder via Postmonger, Journey Builder will send us a copy of the activity here
function onInitActivity(payload) {

    // Set the activity object from this payload
    activity = payload;

    // Checks if activity objects has inArguments
    const hasInArguments = Boolean(
        activity.arguments &&
        activity.arguments.execute &&
        activity.arguments.execute.inArguments &&
        activity.arguments.execute.inArguments.length > 0
    );
    const inArguments = hasInArguments ? activity.arguments.execute.inArguments : [];

    // Gets SMS message that is stored in the activity inArguments (if any)
    const smsMessageArgument = inArguments.find((arg) => arg.smsMessage);

    // Sets SMS message in the textarea element
    if(smsMessageArgument && smsMessageArgument.smsMessage){
        document.getElementById('sms-message').value = smsMessageArgument.smsMessage;
        document.getElementById("button-submit").disabled = false;
    }else{
        document.getElementById("button-submit").disabled = true;
    }
}

function onDoneButtonClick() {
    // Set must metaData.isConfigured in order to tell Journey Builder that this activity is ready for activation
    activity.metaData.isConfigured = true;

    // Set inArguments with the SMS message that the user inputs on the textarea element
    // TO-DO: Pass Data Extension Name as env variable --> "{{Contact.Attribute."+process.env.DE_NAME+".\"Name\"}}"
    const smsMessage = document.getElementById('sms-message').value;
    activity.arguments.execute.inArguments = [{
        smsMessage,
        contactKey: "{{Contact.Key}}",
        name: "{{Contact.Attribute.PruebaSMS.Name}}",
        phone: "{{Contact.Attribute.PruebaSMS.Phone}}"
    }];

    // Updates the activity structure in Journey Builder
    connection.trigger('updateActivity', activity);
}

function onSMSMessageChange(e) {
    // Disables Done button if textarea is empty
    if (e.currentTarget.value.length > 0) {
        document.getElementById("button-submit").disabled = false;
    } else {
        document.getElementById("button-submit").disabled = true;
    }
}