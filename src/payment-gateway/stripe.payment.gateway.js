import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeGateway = async (req, res) => {
  try {
    const charge = await stripe.charges.create({
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    });

    res.status(200).json(charge);
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
