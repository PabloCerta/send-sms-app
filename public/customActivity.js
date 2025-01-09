// Create a new connection for this session, it's used to talk to Journey Builder
const connection = new Postmonger.Session();

// Constant that indicates the number of attributes that can be added
const MAX_ATTRIBUTES = 5;
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
    // Get schema
    schema = data['schema'];

    // Get all static select elements (i.e. the ones that are already in the DOM), they have the same options
    const selectElements = document.querySelectorAll(`[data-type='static']`); // document.querySelectorAll('select');

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
        const { smsMessage, phone, dynamicAttributes } = activity.arguments.execute.inArguments[0];

        // Create and populate corresponding dynamic attributes (i.e. the ones that were injected in the DOM)
        if(dynamicAttributes){
            Object.entries(dynamicAttributes).forEach(([attrName, attrValue]) => {
                setSelectElement(attrName);
                setSelectAttribute(attrName, attrValue);
            });
        }
        
        // Sets Phone static select element
        if(phone) {
            setSelectAttribute('phone', phone);
        }

        // Sets SMS Message in the textarea element
        if(smsMessage){
            document.querySelector('#sms-message').value = smsMessage;
        }

        // // Disable button if limit reached
        let selects = document.querySelectorAll('select');
        if(selects.length == MAX_ATTRIBUTES){
            document.querySelector('#button-add').disabled = true;
        }
    }
}

function onDoneButtonClick() {
    // Set metaData.isConfigured in order to tell Journey Builder that this activity is ready for activation
    activity.metaData.isConfigured = true;

    // Set inArguments with the SMS Message that the user inputs on the textarea element and the data bindings of the select elements
    let argObj = { 
        smsMessage : document.querySelector('#sms-message').value, 
        phone : document.querySelector('#phone-select').value,
        dynamicAttributes : {} 
    };
    let dynamicSelects = document.querySelectorAll(`[data-type='dynamic']`);
    dynamicSelects.forEach( s => {
        argObj.dynamicAttributes = { ...argObj.dynamicAttributes, [s.dataset.attribute] : s.value }; // Sets as key the original value that the user entered in order to retrieve it when the component loads
    });
    activity.arguments.execute.inArguments = [argObj];

    // Updates the activity structure in Journey Builder
    connection.trigger('updateActivity', activity);
}

function onCancelButtonClick() {
    // Tell Journey Builder that this activity has no changes, we wont be prompted to save changes when the inspector closes
    connection.trigger('setActivityDirtyState', false);

    // Request that Journey Builder closes the inspector/drawer
    connection.trigger('requestInspectorClose');
}

function onAddButtonClick() {
    // Get current total of select attributes
    let selects = document.querySelectorAll('select');
    if(selects.length == MAX_ATTRIBUTES) return;

    // Get add attribute input value
    let addAttrInput = document.querySelector('#add-attribute-input');

    // If it's empty or has any character different that letters then report error
    if(!addAttrInput.value || /[^a-z]/i.test(addAttrInput.value)) {
        addAttrInput.setCustomValidity('Please enter only letters without spaces.');
        addAttrInput.reportValidity();
        return;
    }

    // Create html select element
    setSelectElement(addAttrInput.value);

    // Disable button if limit reached
    selects = document.querySelectorAll('select');
    if(selects.length == MAX_ATTRIBUTES){
        document.querySelector('#button-add').disabled = true;
    }

    // Clear new attribute input
    addAttrInput.value = '';
}

function onRemoveButtonClick(e) {
    // Find wrapper attribute and remove from DOM
    let attrName = e.currentTarget.dataset.attributeIcon;
    let attributeWrapper = document.querySelector(`#${attrName.toLowerCase()}-attribute`);
    attributeWrapper.remove();

    // Re-enable add button if it was disabled
    document.querySelector('#button-add').disabled = false;
}

function setupEventHandlers() {
    // Done button click listener
    document.getElementById('button-submit').addEventListener('click', onDoneButtonClick);

    // Cancel button click listener
    document.getElementById('button-cancel').addEventListener('click', onCancelButtonClick);

    // Add button click listener
    document.getElementById('button-add').addEventListener('click', onAddButtonClick);
}

function setSelectElement(attrName) {
    // Check if already exists a select element with the same id/name (using id and not dataset because id it's standarized with lowercase)
    let selectElement = document.querySelector(`#${attrName.toLowerCase()}-select`);

    // If not exists then add element to the DOM
    if(!selectElement) {
        // Get attribute container div 
        let attributesContainer = document.querySelector('#attributes-container');
        // Create attribute wrapper div
        let div = document.createElement('div');
        div.id = `${attrName.toLowerCase()}-attribute`;
        div.className = 'input-wrapper column-flex';
        // Create label element
        let label = document.createElement('label');
        label.htmlFor = `${attrName.toLowerCase()}-select`;
        label.textContent = `${attrName} attribute`;
        // Create inner select wrapper div
        let innerDiv = document.createElement('div');
        innerDiv.className = 'row-flex'
        // Create select element
        selectElement = document.createElement('select');
        selectElement.id = `${attrName.toLowerCase()}-select`;
        selectElement.name = attrName.toLowerCase();
        selectElement.dataset.attribute = attrName;
        selectElement.dataset.type = 'dynamic';
        // Add empty option
        let option = new Option(' -- select an option -- ','');
        option.disabled = true;
        option.selected = 'selected';
        selectElement.add(option, undefined);
        // Add options to new dynamic select element
        if(schema){
            // Add available options
            schema.forEach( opt => {
                let optElement = new Option(opt.name,`{{${opt.key}}}`);
                selectElement.add(optElement, undefined);
            });
        }
        // Create remove button icon
        let buttonIcon = document.createElement('a');
        buttonIcon.id = 'button-remove';
        buttonIcon.className = 'button-remove';
        buttonIcon.dataset.attributeIcon = attrName; 
        buttonIcon.onclick= onRemoveButtonClick;
        buttonIcon.innerText = 'x';
        // Set inner wrapper
        innerDiv.append(selectElement, buttonIcon);
        // Set wrapper
        div.append(label, innerDiv);
        // Set attribute
        attributesContainer.append(div);
    }
}

function setSelectAttribute(attrName, attrValue) {
    // Sets attribute value if it's a valid option of the select element
    if(attrValue && schema.some((scm) => `{{${scm.key}}}` === attrValue)){
        document.querySelector(`#${attrName.toLowerCase()}-select`).value = attrValue; // document.querySelector(`[data-attribute='${attrName}']`).value
    }
}