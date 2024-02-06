import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { getLastYear } from "../utils/helper.js";

// ? UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!user) {
      // If the user with the specified ID is not found, handle it accordingly
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User not found."));
    }

    res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully."));
  } catch (error) {
    // Handle any other errors that might occur during the update
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

// ? DELETE USER
const deletUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found");

    res
      .status(200)
      .json(new ApiResponse(200, user, "User deleted successfully."));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ? GET USER
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    res
      .status(200)
      .json(new ApiResponse(200, user, "User found successfully."));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ? GET ALL USERS
const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    if (!users) throw new ApiError(404, "No users available");
    res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ? GET USER STATS
const getUserStats = asyncHandler(async (req, res) => {
  const lastYear = getLastYear();
  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastYear,
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 }, // sum every registerd user
        },
      },
    ]);
    res
      .status(200)
      .json(new ApiResponse(200, data, "User stats fetched successfully."));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { updateUser, deletUser, getUser, getAllUsers, getUserStats };
