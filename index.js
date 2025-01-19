const express = require('express')
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://10.0.2.2:3000',
  },
})

const port = 4000

function createUniqueId() {
  return Math.random().toString(20).substring(2, 10)
}

let chatGroups = []

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

socketIO.on('connection', (socket) => {
  console.log(`${socket.id} usuário está conectado`)

  socket.on('getAllGroups', () => {
    socket.emit('groupList', chatGroups)
  })

  socket.on('createNewGroup', (currentGroupName) => {
    console.log(currentGroupName)

    chatGroups.unshift({
      id: chatGroups.length + 1,
      currentGroupName,
      messages: [],
    })
    socket.emit('groupList', chatGroups)
  })

  socket.on('findGroup', (id) => {
    const filteredGroup = chatGroups.filter((item) => item.id === id)
    socket.emit('foundGroup', filteredGroup[0].messages)
  })

  socket.on('newChatMessage', (data) => {
    const { currentChatMesage, groupIdentifier, currentUser, timeData } = data
    const filteredGroup = chatGroups.filter((item) => item.id === groupIdentifier)

    const newMessage = {
      id: createUniqueId(),
      text: currentChatMesage,
      currentUser,
      time: `${timeData.hr}:${timeData.mins}`,
    }

    socket
      .to(filteredGroup[0].currentGroupName)
      .emit('groupMessage', newMessage)
    filteredGroup[0].messages.push(newMessage)
    socket.emit('groupList', chatGroups)
    socket.emit('foundGroup', filteredGroup[0].messages)
  })
})

app.get('/api', (req, res) => {
  res.json(chatGroups)
})

http.listen(port, () => {
  console.log(`Server is listeing on ${port}`)
})
