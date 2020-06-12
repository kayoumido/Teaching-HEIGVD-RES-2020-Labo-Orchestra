const dgram = require('dgram');
const moment = require('moment');
const net = require('net');
const s = dgram.createSocket('udp4');

const HOST = "127.0.0.1";
const PORT = "2205";

const instruments = new Map();
instruments.set('piano', 'ti-ta-ti');
instruments.set('trumpet', 'pouet');
instruments.set('flute', 'trulu');
instruments.set('violin', 'gzi-gzi');
instruments.set('drum', 'boum-boum');

let musicians = new Map()

s.bind(3000, () => {
  console.log("Joining the orchestra");
  s.addMembership("239.255.22.5");
});

s.on('message', (msg, src) => {
  const req = JSON.parse(msg.toString());
  musicians.set(req.uuid, {
    instrument: [...instruments].find(([key, val]) => val == req.sound)[0],
    last: req.when,
    activeSince: req.activeSince,
  });
});

setInterval(() => {
  for (let [uuid, musician] of musicians.entries()) {
    if (moment().diff(moment(musician.last), 'seconds') > 5) {
      console.log(`${uuid} is inactive`);
      musicians.delete(uuid);
    }
  }
}, 1000);

net.createServer((sock) => {
  let paylod = [];
  for (let [uuid, musician] of musicians.entries()) {
    paylod.push({
      uuid: uuid,
      instrument: musician.instrument,
      activeSince: musician.activeSince,
    });
  }

  sock.write(JSON.stringify(paylod));
  sock.end();
}).listen(PORT);