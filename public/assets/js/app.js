"use strict"

var client = mqtt.connect();

  client.subscribe("mqtt/demo");

  client.on("message", function(topic, payload) {
  let pp = [topic, payload].join(": ");
    //client.end();
    $('p.mqttmsg').text(pp);
  });

  client.publish("mqtt/demo", "Bonjour");

  $( document ).ready(function() {
      $('ons-button').click(function(e) {
    const pId = $('ons-page').attr('id');
        const idClicked = e.target.id;

        console.log(pId + " " + idClicked + " button clicked!.");
      });
  });
