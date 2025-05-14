const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/User.model')
const Exercise = require('./models/Exercise.model')
const app = express()
const cors = require('cors')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI).then((result) => {
  console.log('Successfully connected to Mongo DB')
}).catch((err) => {
  console.error(err)
})

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use('/public', express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api/users', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

app.post('/api/users', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
  })
  await newUser.save()

  res.json(newUser)
})

app.post('/api/users/:_id/exercises', async (req, res) => {
  const user = await User.findById(req.params._id)
  const newExercise = new Exercise({
    username: user.username,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date || new Date(Date.now()),
  })
  await newExercise.save()

  res.json({
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date.toDateString(),
    _id: user._id,
  })
})

app.get('/api/users/:_id/logs', async (req, res) => {
  const user = await User.findById(req.params._id)
  let exercisesQuery = Exercise.find(
    { username: user.username },
    [ 'description', 'duration', 'date' ]
  )

  if (req.query.from) {
    exercisesQuery = exercisesQuery.where('date').gte(new Date(req.query.from))
  }
  if (req.query.to) {
    exercisesQuery = exercisesQuery.where('date').lte(new Date(req.query.to))
  }
  if (req.query.limit) {
    exercisesQuery = exercisesQuery.limit(parseInt(req.query.limit))
  }

  const exercises = await exercisesQuery.exec()

  res.json({
    _id: req.params._id,
    username: user.username,
    count: exercises.length,
    log: exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    }))
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
