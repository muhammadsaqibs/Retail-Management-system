import crypto from 'crypto'
import { connection } from '../config/Keydb.connection.js'
import jwt from "jsonwebtoken"
import { sendpendingNotification } from '../utils/websocket.utils.js'

const REDISKEY = (userId) => `user:${userId}:connection`

export const extractUserIdFromRequest = ()=>{
 const token = req.header["authorization"?.split("  ")[1]]
 if(!token) {
   console.log("Cannot Find Token from authorization header")
   return null;
 }
 try { 
  const payload = jwt.verify(token, process.env.JWT_SECTRET)
    return payload.userId
 } catch (error) {
    console.log("failed to verify jwt token in extractUserIdFromRequest")
    return null
 }
}

export const  handleWebsocketConnection = async (ws,req ,wss)=>{
  const userId = extractUserIdFromRequest(req)
  if(!userId){
    ws.close(1008, "Unauthorized User")
    console.log("Unauthorized userId ")
  } 
  const socketId = crypto.randomUUID()
  
  //save in memory
  await connection.sadd(REDISKEY(userId),socketId)
  wss.clientsMap.set(socketId , ws)
  
  // sendpendingNotification
  await sendpendingNotification(userId,ws)
  
  //cleanup in momory userId and SocketId
  const cleanup = async ()=>{
     connection.srem(REDISKEY(userId),socketId)
     wss.clientsMap.delete(socketId,ws)
  } 
  ws.on("close" , cleanup)
  ws.on("error" , cleanup)
}