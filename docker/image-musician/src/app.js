const uuid = require('uuid');
const dgram = require('dgram');
const moment = require('moment');

const s = dgram.createSocket('udp4');

const instruments = {
  piano: 'ti-ta-ti',
  trumpet: 'pouet',
  flute: 'trulu',
  violin: 'gzi-gzi',
  drum: 'boum-boum',
};

if (process.argv.length - 2 != 1) {
  console.error("Too many or too few arguments!");
  return;
}

if (!instruments[process.argv[2]]) {
  console.error("Unknown instrument!");
  return;
}

const musician = {
  uuid: uuid.v4(),
  instrument: process.argv[2],
  activeSince: moment().format(),
}

setInterval(() => {
  const message = Buffer.from(JSON.stringify({
    uuid: musician.uuid,
    sound: instruments[musician.instrument],
    when: moment().format(),
    activeSince: musician.activeSince,
  }));

  s.send(message, 0, message.length, 3000, "239.255.22.5", (err, bytes) => {
    console.log('Sending package yay');
  });
}, 1000);


