
import Stripe from 'stripe';
async function payment ({
 stripe = new Stripe(process.env.Secret_key),

  payment_method_types=['card'],
  mode='payment',
  customer_email,
  metadata,
  cancel_url=process.env.cancel_url,
  success_url=process.env.success_url,
  discounts =[],
  line_items =[]
  
}={}){
  

  const session = await stripe.checkout.sessions.create({
    payment_method_types,
    mode,
    customer_email,
    metadata,
    cancel_url,
    success_url,
    discounts ,
    line_items 
  })


  return session
} 
export default payment;

// line_items :[{
//   price_data :{
//     currency :'usd',
//     product_data :{
//       name
//     },
//     unit_amount
//   },
//   quantity
// }]