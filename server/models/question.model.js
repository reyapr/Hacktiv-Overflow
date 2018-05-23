const mongoose = require('mongoose')
const { Schema } = mongoose

const questionSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    default: 'http://ppc.tools/wp-content/themes/ppctools/img/no-thumbnail.jpg' 
  },
  upVote: [{ 
    type: Schema.Types.ObjectId, ref: 'user' 
  }],
  downVote: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'user' 
  }],
  status: { 
    type: Boolean, 
    default: false
  },
  answers: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'answer' 
  }],
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'user',
  }
}, {
    timestamps: true
  })

const question = mongoose.model('question', questionSchema)

module.exports = question