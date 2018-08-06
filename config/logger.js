var winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format; 
const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});
 
const logger = createLogger({
  format: combine(
    label({ label: 'MyoNodeJS' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: 'node.log' }) 
  ]

});
module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};