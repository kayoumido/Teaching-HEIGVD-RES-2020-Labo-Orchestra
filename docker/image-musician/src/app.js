const uuid = require('uuid');
const dgram = require('dgram');
const moment = require('moment');

const s = dgram.createSocket('udp4');

const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

const MULTICAST_PORT = 3000;
const MULTICAST_ADDR = '239.255.22.5';

// since process.argv also contains `node` and the path to the script,
// we can simply remove the first two elements
const argv = process.argv.slice(2);

// we only accepts 1 argument
if (argv.length != 1) {
  console.error("Too many or too few arguments!");
  return;
}

if (!instruments.get(argv[0])) {
  console.error("Unknown instrument!");
  return;
}

// build a musician object to keep the information
const musician = {
  uuid: uuid.v4(),
  instrument: argv[0],
  activeSince: moment().format(),
}

// play lovely music every second
setInterval(() => {

  // build the payload to send to the multicast group
  // note: we send the `instrument` and the `activeSince` from
  //       the musician to simplify auditor 
  const message = Buffer.from(JSON.stringify({
    uuid: musician.uuid,
    sound: instruments.get(musician.instrument),
    instrument: musician.instrument,
    activeSince: musician.activeSince,
  }));

  s.send(message, 0, message.length, MULTICAST_PORT, MULTICAST_ADDR, (err, bytes) => {
    console.log('Sending package yay');
  });
}, 1000);


