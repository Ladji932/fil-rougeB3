const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ["culturel", "sportif", "communautaire"], required: true },
    dateCreated: { type: Date, required: true },
    dateEvent: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: Buffer }, 
    contactInfo: {
      email: { type: String },
      phone: { type: String },
    },
    createdBy: { type: String, required: true },  });
  
  const EventList = mongoose.model("EventList", EventSchema);
  
  module.exports = EventList;
  