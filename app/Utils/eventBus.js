const events = require("events");
const eventEmiiter = new events.EventEmitter();

require("../listeners/userListener")(eventEmiiter);

module.exports = eventEmiiter;
