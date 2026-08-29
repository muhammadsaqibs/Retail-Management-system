import express from 'express'
import { ipn, returnURLAfterPayment , CreatePayment } from '../controllers/paymentIntegaration.js'
const router = express.Router()

router.post("/create" ,CreatePayment )
router.post("/return" ,returnURLAfterPayment )
router.post("/ipn" , ipn )