# mapp-connect-client-js
Mapp Connect Client node.js

This library can be used by any application that wants to communicate with Mapp Connect. It wraps up JWT token generation part and all the HTTP communication details.

It's being packaged with NPM, in order to use it, just add it to the project as a dependency (mapp-connect-client).

Example usage


Instantiate client and specify API URL, integration ID and API key
var mcc = new lib.MappConnectClient('https://charon-test.shortest-route.com', 'fc1dd232-8302-41a0-a7e9-089d9f8f7304', 'fQbl8bQz1G9OYYukcgYypy2jJeOCi0FD')



Get list of prepared messages
let getMessagesCallback = function (data) {
    console.log(data);
}
mcc.getMessages(getMessagesCallback);



Get list of groups
let getGroupsCallback = function (data) {
    console.log(data);
}
mcc.getGroups(getGroupsCallback);



Send contact profile to be processed by Mapp Connect and saved by Engage
mcc.sendUser("{\"email\":\"test@xx.xx\"}");



Each operation can be triggered by sendXxxx method on the client, for now each of them expects the full JSON payload to be provided as an argument.
