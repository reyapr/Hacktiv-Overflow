var express = require('express');
var router = express.Router();

const {
  authentication,
  authorization
} = require('../middlewares/auth')

const {
  addQuestion,
  showQuestions,
  findQuestion,
  editQuestion,
  deleteQuestion,
  userQuestion,
  upVote,
  downVote
} = require('../controllers/questions.controller')

const upload = require('../middlewares/images')

router.post('/add', authentication,  addQuestion)
router.get('/',  showQuestions)
router.get('/user', authentication ,userQuestion)
router.get('/:id', findQuestion)
router.put('/:id', authentication, upload.multer.single('image'), upload.sendUploadToGCS, editQuestion)
router.delete('/:id', authentication, deleteQuestion)
router.put('/up-vote/:id', authentication, upVote)
router.put('/down-vote/:id', authentication, downVote)

module.exports = router

