import Stripe from "stripe";
import LotteryModel from "../models/lotteryModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Payment function for lottery game
const payment = async (req, res) => {
  try {
    const { userId } = req.body;

    // Prepare line items for Stripe
    const line_items = [
      {
        price_data: {
          currency: "ETB", // Ethiopian Birr
          product_data: {
            name: "Lottery Ticket",
          },
          unit_amount: 10 * 100, // 10 ETB in cents
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "ETB",
          product_data: {
            name: "Subscription Fee",
          },
          unit_amount: 1 * 100, // 1 ETB in cents
        },
        quantity: 1,
      },
    ];

    // Create a Stripe payment session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    // Generate a random 12-digit lottery number
    const generateLotteryNumber = () => {
      return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };

    // Save the lottery entry to the database after payment verification
    const verifyPaymentAndSaveLottery = async () => {
      try {
        const lotteryNumber = generateLotteryNumber();

        const newLottery = new LotteryModel({
          lottery_number: lotteryNumber,
          user_id: userId,
        });

        await newLottery.save();
        console.log("Lottery entry saved successfully");
      } catch (error) {
        console.error("Error saving lottery entry: ", error);
      }
    };

    // Trigger the lottery save function after the payment session is created
    verifyPaymentAndSaveLottery();

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in payment: ", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};

export { payment };
