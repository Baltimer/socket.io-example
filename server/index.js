// ENV variables
const dotenv = require("dotenv");
dotenv.config();

const http = require('http')
var cors = require('cors')
const express = require('express')
const socketio = require('socket.io')

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

var targets = []

// Rutas
app.get("/target", (req, res) => {
  res.send(targets);
})

app.post("/target", (req, res) => {
  let target = targets.filter((t) => t.id == req.body.id)
  if(target.length == 0) {
    targets.push({id: req.body.id, name: req.body.name, active: req.body.active ?? false})
    io.emit("new-target", {id: req.body.id, name: req.body.name, active: req.body.active ?? false})
    res.send({"success": true})
  } else {
    res.send({"success": false})
  }
})

// Levantamos servidor
const server = http.createServer(app)

// Levantamos socket.io
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log(`New connection. Socket: ${socket.id}`)
  
  socket.on('disconnect', () => {
    console.log(`Disconnected. Socket: ${socket.id}`);
  });

  socket.on('new-status', (id) => {
    targets.forEach((t) => {
      if(t.id == id){
        t.active = !t.active
        io.emit('update-status', t)
      }
    })
  })
  // Para emitir a todos menos el, usaremos "broadcast"
  // socket.emit('update-status', id)
})

// Capturamos errores
server.on('error', (err) =>{
  console.error('Server error:', err)
})

// Inicializamos el servidor
server.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started at port: ${process.env.SERVER_PORT}`)
})