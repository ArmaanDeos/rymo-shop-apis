import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.models.js";

// ? CREATE CART
const createCart = asyncHandler(async (req, res) => {
  try {
    const newCart = await Cart.save(req.body);
    res
      .status(201)
      .json(new ApiResponse(200, newCart, "Cart created successfully."));
  } catch (error) {
    console.log(`Error while creating cart:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? UPDATE CART
const updateCart = asyncHandler(async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(200)
      .json(new ApiResponse(200, updatedCart, "Cart updated successfully."));
  } catch (error) {
    console.log(`Error while updating cart:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? DELETE CART
const deleteCart = asyncHandler(async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, deletedCart, "Cart deleted successfully."));
  } catch (error) {
    console.log(`Error while deleting cart:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? GET USER CART
const getUserCart = asyncHandler(async (req, res) => {
  try {
    const userCart = await Cart.findOne({ userId: req.params.userId });
    res
      .status(200)
      .json(new ApiResponse(200, userCart, "Cart fetched successfully."));
  } catch (error) {
    console.log(`Error while getting user cart:`, error);
    res.status(500, new ApiError(500, error.message));
  }
});

// ? GET ALL CARTS
const getAllCarts = asyncHandler(async (req, res) => {
  try {
    const carts = await Cart.find();
    res
      .status(200)
      .json(new ApiResponse(200, carts, "Carts fetched successfully."));
  } catch (error) {
    console.log(`Error while getting all carts:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

export { createCart, updateCart, deleteCart, getUserCart, getAllCarts };
