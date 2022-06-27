const { Schema, model } = require('mongoose');

const CommunicationSchema = new Schema(
  {
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected', 'unfriend', 'blocked'],
    },

  },
  { timestamps: true },
);
CommunicationSchema.index({ '$**': 'text' });
module.exports = model('Communication', CommunicationSchema);
