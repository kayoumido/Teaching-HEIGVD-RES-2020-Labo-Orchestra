const dgram = require('dgram');
const moment = require('moment');
const net = require('net');

const s = dgram.createSocket('udp4');

const TCP_PORT = 2205;
const MULTICAST_PORT = 3000;
const MULTICAST_ADDR = '239.255.22.5';
const MAX_INACTIVITY = 5;

let musicians = new Map()

s.bind(MULTICAST_PORT, () => {
  console.log('Joining the orchestra');
  s.addMembership(MULTICAST_ADDR);
});

s.on('message', (msg, src) => {
  const req = JSON.parse(msg.toString());
  musicians.set(req.uuid, {
    instrument: req.instrument,,
    last: moment().format(),
    activeSince: req.activeSince,
  });

  // check if there are any inactive musicians so we can remove them
  for (let [uuid, musician] of musicians.entries()) {
    if (moment().diff(moment(musician.last), 'seconds') > MAX_INACTIVITY) {
      console.log(`${uuid} is inactive`);
      musicians.delete(uuid);
    }
  }
});

// setup a TCP server so clients can get the list of active musicians
net.createServer((sock) => {
  let paylod = [];
  // since we store more info than what the clients want,
  // we build new objects with the minimum info to make the
  // client happy
  for (let [uuid, musician] of musicians.entries()) {
    paylod.push({
      uuid: uuid,
      instrument: musician.instrument,
      activeSince: musician.activeSince,
    });
  }

  sock.write(JSON.stringify(paylod));
  sock.end();
}).listen(TCP_PORT);