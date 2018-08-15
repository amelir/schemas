const debug = require('debug')('app');
const mongoose = require('mongoose');

function Common(){
  this.models = {}
}

Common.prototype.init = function(){
  return new Promise(resolve => {
    const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    mongoose.connect(url, {useNewUrlParser: true});
    mongoose.Promise = Promise;

    this.models = {
      User: mongoose.model('Users', require('./schemas/User'))
    }
  
    mongoose.connection.on('connected', () => {
      debug('Database connected');
      resolve();
    });

    mongoose.connection.on('error', err => {
      debug('Mongoose error occured', err);
    });

    mongoose.connection.on('disconnected', () => {
      debug('Database disconnected');
    });

    // Setup process end tasks
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        process.exit(0);
      });
    });
  });
}

const common = new Common();
module.exports = common;