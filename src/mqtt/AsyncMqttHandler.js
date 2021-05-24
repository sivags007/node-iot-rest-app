const mqtt = require('async-mqtt');
const AppConstants = require('../utils/AppConstants');
const logger = require('../config/logger');

class MqttHandler {
  constructor(host = 'localhost', port = 1883, userName = AppConstants.AppName, password = '') {
    this.mqttClient = null;
    this.host = host;
    this.port = port;
    this.options = {
      username: userName,
      password,
    };

    this.mqttConnectUrl = `mqtt://${this.host}:${this.port}`;
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.mqttConnectUrl, this.options);

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      logger.error(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      logger.info(`Connected to MQTT Host ${this.mqttConnectUrl}`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('mytopic', { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      logger.info(`Topic: ${topic} :::: Message: ${message.toString()}`);
    });

    this.mqttClient.on('close', () => {
      logger.info(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(topic, message) {
    logger.info(`sending ${message} to topic ${topic}`);
    return this.mqttClient.publish(topic, message);
  }

  // Subscribe to a topic
  subscribe(topic) {
    logger.info(`Subscribing to Topic : ${topic}`);
    return this.mqttClient.subscribe(topic, { qos: 0 });
  }
}

module.exports = MqttHandler;