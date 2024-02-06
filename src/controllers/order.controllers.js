import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
// import { getLastMonth } from "../utils/helper.js";

// ? CREATE ORDER
const createOrder = asyncHandler(async (req, res) => {
  const { userId, products, productId, quantity, amount, address, status } =
    req.body;
  try {
    const newOrder = await Order.create({
      userId,
      products,
      productId,
      quantity,
      amount,
      address,
      status,
    });
    res
      .status(201)
      .json(new ApiResponse(200, newOrder, "Order created successfully."));
  } catch (error) {
    console.log(`Error while creating Order:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? UPDATE ORDER
const updateOrder = asyncHandler(async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order updated successfully."));
  } catch (error) {
    console.log(`Error while updating Order:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? DELETE ORDER
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, deletedOrder, "Order deleted successfully."));
  } catch (error) {
    console.log(`Error while deleting Order:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? GET USER ORDER
const getUserOrder = asyncHandler(async (req, res) => {
  try {
    const userOrder = await Order.find({ userId: req.params.userId });
    res
      .status(200)
      .json(new ApiResponse(200, userOrder, "Order fetched successfully."));
  } catch (error) {
    console.log(`Error while getting user Order:`, error);
    res.status(500, new ApiError(500, error.message));
  }
});

// ? GET ALL ORDER
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      // If no orders found
      return res.status(404).json(new ApiError(404, "No orders found."));
    }

    res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully."));
  } catch (error) {
    console.log(`Error while getting all Orders:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? GET MONTHLY INCOME
const getMonthlyIncome = asyncHandler(async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res
      .status(200)
      .json(new ApiResponse(200, income, "Order stats fetched successfully."));
  } catch (error) {
    console.log(`Error while getting monthly income:`, error);
    res
      .status(500)
      .json(new ApiError(500, "Error while getting monthly income."));
  }
});

export {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrder,
  getAllOrders,
  getMonthlyIncome,
};
