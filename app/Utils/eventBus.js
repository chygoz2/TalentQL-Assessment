const events = require("events");
const eventEmiiter = new events.EventEmitter();

if (process.env.NODE_ENV != "test") {
  require("../listeners/userListener")(eventEmiiter);
}

module.exports = eventEmiiter;
