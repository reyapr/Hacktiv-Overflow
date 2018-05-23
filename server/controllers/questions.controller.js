const User = require('../models/user.model')
const Question = require('../models/question.model')
const Answer = require('../models/answer.model')

module.exports = {
  addQuestion(req, res) {
    const user = req.headers.decoded.id
    const { title, content} = req.body
    Question.create({ 
      title, 
      content, 
      user
    }).then((result) => {
        User.findByIdAndUpdate(result.user, {
          $push: {
            questions: result._id
          }
        })
          .then(user => {
            res.status(200).json({
              message: 'success',
              result
            })
          })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  showQuestions(req, res) {
    Question.find()
      .populate('user')
      .populate({
        path: 'answers',
        populate:{path:'user'}
      })
      .then((result) => {

        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  findQuestion(req, res) {
    Question.findById(req.params.id)
      .populate('user')
      .populate('answers')
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  userQuestion(req, res) {
    const user = req.headers.decoded.id
    Question.find({
      user
    })
      .populate('user')
      .populate({
        path: 'answers',
        populate: {
          path: 'user'
        }
      })
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  editQuestion(req, res) {
    const { title, content, imgUrl} = req.body
    Question.findByIdAndUpdate(req.params.id, {
      title,
      content, 
      image: imgUrl
    })
      .then((result) => {
        res.status(200).json({
          message: 'success',
          result
        })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  deleteQuestion(req, res) {
    Question.findByIdAndRemove(req.params.id)
      .then((result) => {
        console.log(result)
        User.findByIdAndUpdate(result.user, {
          $pull: {
            questions: result._id
          }
        })
          .then(user => {
            Answer.deleteMany({
              questionId: req.params.id
            })
              .exec()
              .then(answer => {
                res.status(200).json({
                  message: 'success to delete post',
                  answer
                })
              })
          })
      }).catch((err) => {
        res.status(400).json({
          message: 'failed to delete post',
          err
        })
      });
  },
  upVote(req,res) {
    const user = req.headers.decoded.id
    Question.findById(req.params.id)
      .populate('user')
      .then(result => {
        if(result.user._id==user){
          res.status(404).json({
            message: 'can\'t vote your own post'
          })
        }
        let isFound = false
        result.upVote.forEach(u => {
          if (u == user) {
            isFound = true
          }
        })
        result.downVote.forEach(u => {
          if (u == user) {
            isFound = true
          }
        })
        if (!isFound) {
          Question.findByIdAndUpdate(req.params.id, {
            $push: {
              upVote: user
            }
          })
            .then((result) => {
              res.status(200).json({
                message: 'Success To Up Vote',
                result
              })
            })
        } else {
          res.status(401).json({
            message: 'failed you has already voted'
          })
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  },
  downVote(req,res) {
    const user  = req.headers.decoded.id
    Question.findById(req.params.id)
      .populate('user')
      .then(result => {
        if (result.user._id == user) {
          res.status(404).json({
            message: 'can\'t vote your own post'
          })
        }
        let isFound = false
        result.upVote.forEach(userVote => {
          if (userVote == user) {
            isFound = true
          }
        })
        result.downVote.forEach(userVote => {
          if (userVote == user) {
            isFound = true
          }
        })
        if (!isFound) {
          Question.findByIdAndUpdate(req.params.id, {
            $push: {
              downVote: user
            }
          })
            .then((question) => {
              res.status(200).json({
                message: 'Success To Down Vote',
                question
              })
            })
        } else {
          res.status(401).json({
            message: 'failed you has already voted'
          })
        }
      })
      .catch((err) => {
        res.status(400).json({
          message: 'failed',
          err
        })
      });
  }
}