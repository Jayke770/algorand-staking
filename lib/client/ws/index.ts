import { createContext } from 'react'
import { io } from "socket.io-client"
const socket = io('/client')
const socketContext = createContext(socket)
export default socketContext