const mongoose = require('mongoose')
const User = require('../models/user.model')
const Question = require('../models/question.model')
const Answer = require('../models/answer.model')

module.exports = {
  addAnswer(req, res) {
	const user = req.headers.decoded.id
	const question = req.params.id
	const { content } = req.body
    Answer.create ({
		  content,
		  user,
		  question
	})
	.then(result=>{
      	let _id = req.params.id
      	Question.findByIdAndUpdate({_id}, {
        	$push: {
          	answers: result._id
        }
      	}).then(result=>{
        	res.status(200).json({
        		message:'success to add answer',
          		result
        	})
      	}).catch(err=>{
        	res.status(400).json({
				message:'can\'t to add answer',
				err
        	})
      	})
    }).catch(err=>{
		res.status(400).json({
			message: 'can\'t to add answer',
			err
		})
	})
    
  },
  updateAnswer(req,res) {

  },
  deleteAnswer(req,res) {
	const id = req.params.id
	Answer.findByIdAndRemove(id)
		.then((result) => {
		User.findByIdAndUpdate(result.userId, {
			$pull: {
				questions: result._id
			}
		})
			.then(user => {
				Answer.deleteMany({
					question: req.params.id
				})
					.exec()
					.then(answer => {
						res.status(200).json({
							message: 'success',
							result
						})
					})
			})
		}).catch((err) => {
			res.status(400).json({
				message: 'failed',
				err
			})
		});
  },
  upVote(req, res) {
	const user = req.headers.decoded.id
	const id = req.params.id
    Answer.findById(id)
      .populate('user')
      .then(result => {
		  console.log(result)
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
          Answer.findByIdAndUpdate(id, {
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
  downVote(req, res) {
	const user = req.headers.decoded.id
	const id = req.params.id
    Answer.findById(id)
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
          answerModel.findByIdAndUpdate(req.params.id, {
            $push: {
              downVote: user
            }
          })
            .then((result) => {
              res.status(200).json({
                message: 'Success To Down Vote',
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
  }
}