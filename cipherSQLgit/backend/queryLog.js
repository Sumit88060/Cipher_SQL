const mongoose = require('mongoose');

const queryLogSchema = new mongoose.Schema({
  query:     String,
  success:   Boolean,
  error:     String,
  rowCount:  Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QueryLog', queryLogSchema);
