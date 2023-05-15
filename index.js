import Razorpay from "razorpay"
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from body-parser;
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

let port = process.env.port || 3000;

export function orderGenerator (req, res, next){
    let amount = parseInt(req.body.price)
    var instance = new Razorpay({
        key_id: "rzp_test_DsSu2HhlgB0IWf",
        key_secret: "WdvQrMKGjZPa0bVrUDiubLd5",
      });
      var options = {
        amount: amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        notes: {address: "Razorpay Corporate Office", ...req.body.notes}
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
            console.error(err, 29);
            return res.status(500).send({orderId: null});
        }
        req.orderId=order.id
        next();
    });
}

app.post("/razorpay_webhook", async (req, res) => {
    const RAZORPAY_WEBHOOK_SECRET = "razorpay_webhook@123";
    const SLACK_WEBHOOK_URL =
      "https://hooks.slack.com/services/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";
      const paymentId = req.body.payload.payment.entity.id;
    // const paymentId1 = req.body.pId;
  
    const response = await axios.get(
      `https://api.razorpay.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization:
          'Basic cnpwX3Rlc3RfRHNTdTJIaGxnQjBJV2Y6V2R2UXJNS0dqWlBhMGJWclVEaXViTGQ1'
        },
      }
    );
    const data = await response.data; 
    console.log(data,"data");
  
    // sendMessage({
    //   paymentId: data.id,
    //   amount: data.amount / 100,
    //   status: data.status === "authorized" ? "Paid" : "Pending",
    //   email: data.email,
    //   transactionId: data.acquirer_data.upi_transaction_id,
    // });
    sendMessage({
        data
      });
  
    res.status(200).send({ success: "Webhook processed" });
  });

  app.post("/orderid", orderGenerator, (req, res) => {
    res.send({ orderId: req.orderId });
});

async function sendMessage (message){
    console.log('line no 75')
    try {
        let res = await fetch(
          `https://slack.com/api/chat.postMessage?channel=C054GC09QP3&text=${JSON.stringify(
            message
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer xoxp-5152408310273-5133174991334-5276949985889-f26b97d24e6e93717ca00eaa7434fa25`,
            },
          }
        );
        let data = await res.json();
        console.log(data, "data");
      } catch (error) {
        console.log("error occured");
      }
}

app.listen(port, ()=>{
    console.log('Server listening on port '+port);
});