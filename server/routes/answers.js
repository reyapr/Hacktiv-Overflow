const express = require('express')
const router = express.Router()
const {
  addAnswer,
  updateAnswer,
  deleteAnswer,
  findAnswer,
  upVote,
  downVote
} = require('../controllers/answers.controller')

const {
  authentication,
} = require('../middlewares/auth')

router.post('/add/:id', authentication,addAnswer)
router.put('/up-vote/:id', authentication, upVote)
router.put('/down-vote/:id', authentication, downVote)
router.delete('/:id', authentication, deleteAnswer)


module.exports = router
