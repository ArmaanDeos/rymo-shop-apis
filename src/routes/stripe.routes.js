// import { Router } from "express";
// import { getPaymentGateway } from "../controllers/payment.stripe.controllers.js";
// const router = Router();

// router.route("/payment").post(getPaymentGateway);

// export default router;

// const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY);
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
import { Router } from "express";
const router = Router();

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

export default router;
