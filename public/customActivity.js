// Create a new connection for this session, it's used to talk to Journey Builder
const connection = new Postmonger.Session();

// Variable to store activity JSON
let activity = null;
// Variable to store data schema
let schema = null;

// Wait for the document to load
document.addEventListener('DOMContentLoaded', function main() {

    // Setup event handlers
    setupEventHandlers();

    // Journey Builder will respond with "initActivity" after it receives the "ready" signal
    connection.on('initActivity', onInitActivity);

    // Journey Builder will respond with "requestedSchema", this responds with the current data source schema
    connection.on('requestedSchema', onRequestedSchema);
    
    // Load data source dynamically
    connection.trigger('requestSchema');
});

function onRequestedSchema(data) {
    // Get all the select elements, they have the same options
    const selectElements = document.querySelectorAll('select');

    // Get schema
    schema = data['schema'];

    // Iterate over schema (i.e. every field value) and add them as options
    schema.forEach( opt => {
        selectElements.forEach( select => {
            let optElement = new Option(opt.name,`{{${opt.key}}}`);
            select.add(optElement, undefined);
        })
    });

    // Tell parent iFrame that we are ready.
    connection.trigger('ready');
}

// This function is triggered by Journey Builder via Postmonger, Journey Builder will send us a copy of the activity here
function onInitActivity(payload) {

    // Set the activity object from this payload
    activity = payload;

    // Checks if activity objects has inArguments
    const hasInArguments = activity.arguments?.execute?.inArguments?.length > 0

    // If there is at least one inArgument
    if(hasInArguments){
        // Get inArguments values
        const { smsMessage, contactKey, name, phone, daysOverdue } = activity.arguments.execute.inArguments[0];

        // Set Key select
        setSelectAttribute('key', contactKey);

        // Set Name select
        setSelectAttribute('name', name);

        // Set Phone select
        setSelectAttribute('phone', phone);

        // Set Days Overdue select
        setSelectAttribute('days-overdue', daysOverdue);

        // Sets SMS message in the textarea element
        if(smsMessage){
            document.getElementById('sms-message').value = smsMessage;
        }
    }
}

function onDoneButtonClick() {
    // Set metaData.isConfigured in order to tell Journey Builder that this activity is ready for activation
    activity.metaData.isConfigured = true;

    // Set inArguments with the SMS message that the user inputs on the textarea element and the data bindings of the select elements
    activity.arguments.execute.inArguments = [{ 
        smsMessage: document.getElementById('sms-message').value, 
        contactKey: document.getElementById('key-select').value, 
        name: document.getElementById('name-select').value, 
        phone: document.getElementById('phone-select').value,
        daysOverdue: document.getElementById('days-overdue-select').value
    }];

    // Updates the activity structure in Journey Builder
    connection.trigger('updateActivity', activity);
}

function onCancelButtonClick() {
    // Tell Journey Builder that this activity has no changes, we wont be prompted to save changes when the inspector closes
    connection.trigger('setActivityDirtyState', false);

    // Request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function setupEventHandlers() {
    // Done button click listener
    document.getElementById('button-submit').addEventListener('click', onDoneButtonClick);

    // Cancel button click listener
    document.getElementById('button-cancel').addEventListener('click', onCancelButtonClick);
}

function setSelectAttribute(attrName, attrValue) {
    // Sets attribute value if it's a valid option of the select element
    if(attrValue && schema.some((scm) => `{{${scm.key}}}` === attrValue)){
        document.getElementById(`${attrName}-select`).value = attrValue;
    }
}