"use strict"

var client = mqtt.connect();

  client.subscribe("outputs/out1");


  client.on("message", function(topic, payload) {
  let pp = [topic, payload].join(": ");
    //client.end();
    $('p.mqttmsg').text(pp);
  });

  client.publish("mqtt/demo", "Bonjour");

  $( document ).ready(function() {
      $('ons-button').click(function(e) {
    const idClicked = e.target.id;
    console.log(idClicked);
    validateClicked(idClicked);
      });

  });
function validateClicked(clicked) {
  let clickedOut = clicked.substring(0, clicked.indexOf(':'));
  let clickedIn = clicked.substring(clicked.indexOf(':') +1);
  console.log(clickedOut);
  console.log(clickedIn);
  if (clickedOut.match(/^out([0-9]+)$/) && clickedIn.match(/^in([0-9]+)$/)){
    client.publish("outputs/" + clickedOut,clickedIn);
  }
}
