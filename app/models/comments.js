const mongoose = require('mongoose')
const { Schema, model } = mongoose
const commontchema = new Schema(
  {
    __v: { type: Number, select: false },
    content: { type: String, required: true },
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: String, required: true },
    answerId: { type: String, required: true, default: 0 },
    rootCommentId: { type: String, requierd: false },
    replyTo: { type: Schema.Types.ObjectId, ref: 'User', requierd: false }
  },
  { timestamps: true }
)
module.exports = model('Comment', commontchema)
