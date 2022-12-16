const { MQTTPubSub } = require("graphql-mqtt-subscriptions");
const { connect } = require("mqtt");

const MQTTbroker = "mqtt://test.mosquitto.org";
const topic = "mandevices_panel1";

const client = connect(MQTTbroker);

client.on("connect", function () {
  console.log(`Connecting to MQTT broker`);
  client.subscribe(topic, function (err) {
    if (!err) {
      client.on("message", function (topic, message) {
        console.log(`Message:`, topic);
        console.log(message.toString());
      });
    }
    console.log(err);
  });
});

const pubsub = new MQTTPubSub({
  client,
});

const resolvers = {
  query: {
    sensors: () => "Hello World!",
  },
  subscription: {
    subscribe2sensor: (_, args) => {
      return pubsub.asyncIterator(topic);
    },
  },
};

module.exports = { resolvers };
