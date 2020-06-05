const dgram = require('dgram');
const moment = require('moment');
const net = require('net');
const s = dgram.createSocket('udp4');

const HOST = "127.0.0.1";
const PORT = "2205";

const instruments = {
  'ti-ta-ti': 'piano',
  'pouet': 'trumpet',
  'trulu': 'flute',
  'gzi-gzi': 'violin',
  'boum-boum': 'drum',
};

let musicians = new Map()

s.bind(3000, () => {
  console.log("Joining the orchestra");
  s.addMembership("239.255.22.5");
});

s.on('message', (msg, src) => {
  const req = JSON.parse(msg.toString());
  musicians.set(req.uuid, {
    instrument: instruments[req.sound],
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
}, 5000);

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
  //sock.end();
}).listen(PORT, HOST);