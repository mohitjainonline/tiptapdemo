const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const questionSchema = mongoose.Schema({
  name: { type: String},
  description: { type: String },
  content: {type: String},
  editMode : Boolean,
  updateTime: Date,
  updatedBy: { type: String }
});
questionSchema.plugin(uniqueValidator);

module.exports = questionSchema;