const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const DATA_FILE = path.join(__dirname, 'layouts.json')
let LAYOUTS = []

try {
  if (fs.existsSync(DATA_FILE)) {
    LAYOUTS = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) || []
  }
} catch (e) { console.warn('load err', e) }

app.get('/api/layout', (req, res) => res.json(LAYOUTS))

app.post('/api/layout', (req, res) => {
  const body = req.body
  if (!Array.isArray(body)) return res.status(400).json({ error: 'expect array' })
  LAYOUTS = body
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(LAYOUTS, null, 2)) } catch (e) { console.warn('save err', e) }
  res.json({ ok: true })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log('Backend listening on', PORT))
