const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketName: {
    type: String,
    required: true,
  },
  ticketDescription: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  email: { type: String, required: false },
  status: {
    type: String,
    enum: ['pending', 'completed','assigned','Completed','Incompleted'],
    default: 'pending', 
  },
  developerMail: { 
    type: String,
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
