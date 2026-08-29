import {Notification} from "../models/NotificationToken.model.js";
import websocket from "ws"

export const sendpendingNotification = async (userId , ws)=>{
try {
  const pending = await Notification.find({
    userId,
    status : "PENDING",
    deliveryStatuswebsocketsent : false,
    expiresAt: { $gt: new Date() },
    
  }).sort({createdAt : -1 }).limit(10)

  for(const notification of pending){
    if(ws.readystate === websocket.OPEN){
        ws.send(JSON.stringify({ type : 'NOTIFICATION' , data : notification}))
    }
  }
  await Notification.updateMany(
    { _id: { $in: pending.map((notification) => notification._id) } },
    { $set: { status: "SENT", sentAt: new Date(), deliveryStatuswebsocketsent: true } },
  );
} catch (error) {
  console.log("error in sendpendingNotification()", error)       
}} 