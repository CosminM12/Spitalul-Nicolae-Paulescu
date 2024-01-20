const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    telephone: {
        type: String,
        required: true
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;