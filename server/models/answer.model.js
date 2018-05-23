const mongoose = require('mongoose')
const {Schema} = mongoose

const answerSchema = new Schema({
   user: {
    type: Schema.Types.ObjectId, ref: 'user',
  },
  content: { 
    type: String, 
    required: true 
  },
  upVote: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'user' 
  }],
  downVote: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'user' 
    }],
  question: { 
    type: Schema.Types.ObjectId, 
    ref: 'question' 
    },
 
}, {
    timestamps: true
  })

const answer = mongoose.model('answer', answerSchema)

module.exports = answer

