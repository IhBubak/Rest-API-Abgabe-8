const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = 5000

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
})

db.connect(err => {
    if (err) throw err
    console.log('Connected to the database')
})

app.use(bodyParser.json())

app.post('/messages', (req, res) => {
    const { time, message } = req.body
    const insertQuery = 'INSERT INTO news (time, message) VALUES (?, ?)'
    db.query(insertQuery, [time, message], (err, result) => {
        if (err) {
        res.status(500).json({ error: 'Failed to insert message' })
        } else {
        res.status(201).json({ message: 'Message inserted successfully' })
        }
    })
})

app.get('/messages/:date', (req, res) => {
  const date = req.params.date
  const selectQuery = 'SELECT * FROM news WHERE DATE(time) = ?'
  db.query(selectQuery, [date], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch messages' })
    } else {
      res.status(200).json(result)
    }
  })
})

app.put('/messages/:newsid', (req, res) => {
    const newsid = req.params.newsid
    const { time, message } = req.body
    const updateQuery = 'UPDATE news SET time = ?, message = ? WHERE newsid = ?'
    db.query(updateQuery, [time, message, newsid], (err, result) => {
        if (err) {
        res.status(500).json({ error: 'Failed to update message' })
        } else {
        res.status(200).json({ message: 'Message updated successfully' })
        }
    })
})

app.delete('/messages/:newsid', (req, res) => {
    const newsid = req.params.newsid
    const deleteQuery = 'DELETE FROM news WHERE newsid = ?'
    db.query(deleteQuery, [newsid], (err, result) => {
        if (err) {
        res.status(500).json({ error: 'Failed to delete message' })
        } else {
        res.status(200).json({ message: 'Message deleted successfully' })
        }
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
