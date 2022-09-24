import { Server } from "colyseus"
import { AlgoRoom } from './rooms/AlgoRoom'
const port = parseInt(process.env.PORT, 10) || 3000

const gameServer = new Server()
gameServer.define("AlgoRoom", AlgoRoom)
gameServer.listen(port)
console.log(`[GameServer] Listening on Port: ${port}`)
