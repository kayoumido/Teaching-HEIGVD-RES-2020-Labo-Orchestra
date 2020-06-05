const dgram = require('dgram');

const s = dgram.createSocket('udp4');

const instruments = {
  'ti-ta-ti': 'piano',
  'pouet': 'trumpet',
  'trulu': 'flute',
  'gzi-gzi': 'violin',
  'boum-boum': 'drum',
};

let musicians = {};

s.bind(3000, () => {
  console.log("Joining the orchestra");
  s.addMembership("239.255.22.5");
});

s.on('message', (msg, src) => {
  console.log("asdfklglkjahsgjklhadjsfkhasédhgédsfhj");

  const req = JSON.parse(msg.toString());
  musicians[req.uuid] = {
    instrument: instruments[req.sound],
    last: req.when,
    activeSince: req.activeSince,
  };
});

setInterval(() => {
  for (const uuid in musicians) {
    const musician = musicians[uuid];
    if ((new Date().getTime() - new Date(musician.last).getTime()) > 5000) {
      console.log(`${uuid} is inactive`);
      delete musicians[uuid];
    }
  }
}, 5000);