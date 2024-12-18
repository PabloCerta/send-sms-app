# send-sms-app
Journey Builder Custom Activity that sends SMS message through an API

## Usage
In order to use the application as a Custom Activity in Journey Builder, follow this steps

1. Deploy the app in a hosting website (in this example, Heroku)
   
   ![image](https://github.com/user-attachments/assets/804c6751-65b5-4b27-8f85-e10bf93eace2)

   ![image](https://github.com/user-attachments/assets/028ced6e-7f3d-43ee-bcf4-b5a07af728d5)


3. Once the app is deployed, configure the following environment variables

      - CLIENT_ID
      - CLIENT_SECRET
      - SMS_ENDPOINT

![image](https://github.com/user-attachments/assets/93b850b7-19d8-44d7-bc72-2817f6a739ac)

3. Create a new Installed Package in the Salesforce Marketing Cloud instance

![image](https://github.com/user-attachments/assets/c26c15b5-99a9-4207-9d44-1ee1a95e7ef4)

4. Add the component to the Installed Package indicating the Endpoint URL of the app provided by the hosting website

![image](https://github.com/user-attachments/assets/8a27c731-4ee1-4728-b188-e87d435608d5)

5. In Journey Builder, drag and drop the new Custom Activity

![image](https://github.com/user-attachments/assets/73c74d23-0a38-496d-a798-0ccb194f509c)

6. Configure the Custom Activity

![image](https://github.com/user-attachments/assets/7915aba1-67a0-4dd2-8d3f-b1d3a1fbfd2f)

In the pick list attributes the corresponding option must be selected based on the columns/fields of the Data Source structure, for example if the Data Source has the following columns

- ContactId
- ContactName
- ContactPhone
  
These options are the ones that will appear in the Custom Activity and the corresponding one must be chosen for each attribute so that the correct contact value is obtained by the app.

These attributes can be used on the SMS Message input with the ${} notation.

The maximum length of the SMS Message is 160 characters.

SMS Message example
> We miss you! Activate a FREE plan here: https://cloud.marketing.test.com/${KeyAttribute}
