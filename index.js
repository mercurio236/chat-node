const express = require("express")
const app = express()
const http = require('http').Server(app)
const cors = require('cors')
const socketIO = require('socket.io')(http, {
    cors:{
        origin:'http://10.0.2.2:3000'
    }
})

const port = 4000

function createUniqueId(){
    return Math.random().toString(20).substring(2,10)
}

let chatGroups = []

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())



http.listen(port, () =>{
    console.log(`Server is listeing on ${port}`)
})