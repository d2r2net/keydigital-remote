"use strict"
const client = mqtt.connect();

  $( document ).ready(function() {
      $('ons-button').click(function(e) {
    const idClicked = e.target.id;
    console.log(idClicked);
    validateClicked(idClicked);
      });

  });
function validateClicked(idClicked) {
  // clicked out
  let clickedOut = idClicked.substring(0, idClicked.indexOf(':'));
  //clicked in
  let clickedIn = idClicked.substring(idClicked.indexOf(':') +1);
  //if validation passed publish to mqtt channel
  if (clickedOut.match(/^out([0-9]+)$/) && clickedIn.match(/^in([0-9]+)$/)){
    //publish to output topic and send input to topic
    client.publish("outputs/" + clickedOut,clickedIn);
  }
}
