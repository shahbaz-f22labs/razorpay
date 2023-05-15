import Razorpay from "razorpay";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
import fetch from 'node-fetch';
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

let port = process.env.port || 3000;

export function orderGenerator(req, res, next) {
  let amount = parseInt(req.body.price);
  var instance = new Razorpay({
    key_id: "rzp_test_DsSu2HhlgB0IWf",
    key_secret: "WdvQrMKGjZPa0bVrUDiubLd5",
  });
  var options = {
    amount: amount, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
    notes: { address: "Razorpay Corporate Office", ...req.body.notes },
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.error(err, 29);
      return res.status(500).send({ orderId: null });
    }
    req.orderId = order.id;
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
          "Basic cnpwX3Rlc3RfRHNTdTJIaGxnQjBJV2Y6V2R2UXJNS0dqWlBhMGJWclVEaXViTGQ1",
      },
    }
  );
  const data = await response.data;
  console.log(data, "data");

  // sendMessage({
  //   paymentId: data.id,
  //   amount: data.amount / 100,
  //   status: data.status === "authorized" ? "Paid" : "Pending",
  //   email: data.email,
  //   transactionId: data.acquirer_data.upi_transaction_id,
  // });
  sendMessage({
    data,
  });

  res.status(200).send({ success: "Webhook processed" });
});

app.post("/orderid", orderGenerator, (req, res) => {
  res.send({ orderId: req.orderId });
});

async function sendMessage(message) {
  console.log(message);
  try {
    // let res = await fetch(
    //   `https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=${JSON.stringify(
    //     message
    //   )}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer xoxp-5152408310273-5133174991334-5267743204580-f11a11933d46e86888948f5e91e0ceae`,
    //     },
    //   }
    // );
    // let data = await res.json();

    // let res = axios.post(
    //   `https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=${JSON.stringify(
    //     message,
    //     {
    //       headers: {
    //         Authorization: `Bearer xoxp-5152408310273-5133174991334-5267743204580-f11a11933d46e86888948f5e91e0ceae`,
    //       },
    //     }
    //   )}`,
    // );
    // res = await res.json()
    // console.log(res, "res");
    // let res = await fetch(`https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=${JSON.stringify(message)}`,{
    //     method: 'POST',
    //       headers: {
    //         Authorization: `Bearer xoxp-5152408310273-5133174991334-5251044098007-2d82558169fc2d937da5ce0f39fc5d19`,
    //       },
    // })

    // let data = await res.json();
    // console.log(data,'data')

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=${JSON.stringify(message)}`,
        headers: { 
          'Authorization': 'Bearer xoxp-5152408310273-5133174991334-5259951082822-97569e9f735fc9c7eb8300a88ab69cb6'
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("error occured", error.message);
  }
}

async function get ( ){
    // try {
    //     let res = await fetch('https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=2ndMessage',{
    //         method: 'GET',
    //         headers: {
    //             Authorization: 'Bearer xoxp-5152408310273-5133174991334-5259951082822-97569e9f735fc9c7eb8300a88ab69cb6',
    //             'Content-Type': 'application/json'
    //           }
    //     })
    //     let data = await res.json();

    //     console.log(data,'data')
    // } catch (error) {
    //     console.log(error.message);
    // }

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://slack.com/api/chat.postMessage?channel=C0543NZGP34&text=3rdMessage',
        headers: { 
          'Authorization': 'Bearer xoxp-5152408310273-5133174991334-5269367231444-299404d1fe96654f860e707eae0387be'
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
      
}

get()

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
