import {Order} from "../models/order.model.js"
import { totalOrdersQueue } from "../queue/totallOrders.queue.js"
import { SendOrderNotification } from "./pushnotification.service.js"


export const newOrders =async ({
    userId,
    items,
    totalAmount,
})=>{
  const session  = await Order.startSession();
  session.startTransaction();
  try{
   const newOrder =new orderModel({
        userId,
        items,
        deliveryAddress,
        totalAmount,
        paymentMethod,
        status : "CONFIRMED"
     })
     await newOrder.save({session})
     if(!newOrder){
        return console.log("New Order is not save in model in order service file")
      }
      
      await SendOrderNotification(
         newOrder,
         "ORDER_CONFIRMED",
         session

      )
      // add job to total orders queue to update total orders count in dashboard
      totalOrdersQueue.add("total-orders-queue" , {
           orderId : newOrder._id,
           status : newOrder.status,
           userId : newOrder.userId
      },{
          attempts : 2,
      })
      
      
   return newOrder;
  }catch(error){
     await session.abortTransaction();
     console.error("❌ Transaction Failed, rolled back:", error)
     throw error; // Controller ko error bhein taake wo 500 status bhej sake
     
  }finally{
   session.endSession();
  }
}
    
