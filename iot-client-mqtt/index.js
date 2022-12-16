const { connect } = require("mqtt");
const MQTTbroker = "mqtt://test.mosquitto.org";
const topic = "mandevices_panel1";
const client = connect(MQTTbroker);

const getDummySensorData = () => ({
  subscribe2sensor: {
    tem_panel: 20 + Math.random() * 1,
    tem_envi: 30 + Math.random() * 1,
    bucxa: 40 + Math.random() * 1,
    warning: 1 + Math.random() * 1,
  },
});

client.on("connect", function () {
  console.log(`Connecting to MQTT broker`);
  client.subscribe(topic, function (err) {
    if (!err) {
      // setInterval(
      //   () => client.publish(topic, JSON.stringify(getDummySensorData())),
      //   3000
      // );
      // return true;
    }
    console.log(err);
  });
});

// Handlers

client.on("message", function (topic, message) {
  console.log(`Message incoming topic:`, topic);
  console.log(message.toString());
});

client.on("error", function (topic, payload) {
  console.log("Error:", topic, payload.toString());
});
client.on("message", mqtt_messsageReceived);

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {
  var message_str = message.toString(); //convert byte array to string
  message_str = message_str.replace(/\n$/, ""); //remove new line
  var message_arr = extract_string(message_str);
  //payload syntax: clientID,topic,message

  insert_message(topic, message_str, packet);

  console.log(message_arr[2].slice(-3));
}

//////////////Mysql
var mysql = require("mysql");

//Create Connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});

//insert a row into the tbl_messages table
function insert_message(topic, message_str, packet) {
  var message_arr = extract_string(message_str); //split a string into an array
  var tem_panel = message_arr[0].slice(-2);
  var tem_envi = message_arr[1].slice(-2);
  var bucxa = message_arr[2].slice(-2);
  var warning = message_arr[3].slice(-1);

  var sql = "INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)";
  var params = [
    "sensorData",
    "tem_panel",
    "tem_envi",
    "bucxa",
    "warning",
    tem_panel,
    tem_envi,
    bucxa,
    warning,
  ];
  sql = mysql.format(sql, params);

  connection.query(sql, function (error, results) {
    if (error) throw error;
    console.log("Message added: " + message_str);
  });
}

//split a string into an array of substrings
function extract_string(message_str) {
  var message_arr = message_str.split(","); //convert to array
  return message_arr;
}

//count number of delimiters in a string
var delimiter = ",";
function countInstances(message_str) {
  var substrings = message_str.split(delimiter);
  return substrings.length - 1;
}
