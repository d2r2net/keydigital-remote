"use strict"

  var client = mqtt.connect();

  client.subscribe("mqtt/demo");

  client.on("message", function(topic, payload) {
  let pp = [topic, payload].join(": ");
    //client.end();
    $('p.mqttmsg').text(pp);
  });
  client.publish("mqtt/demo", "hello world!");
