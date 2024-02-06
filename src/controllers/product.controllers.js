import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// ? CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { title, desc, img, categories, size, color, price } = req.body;

  try {
    const newProduct = await Product.create({
      title,
      desc,
      img,
      categories,
      size,
      color,
      price,
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProduct, "Product created successfully."));
  } catch (error) {
    console.log("Error while creating product:", error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res
      .status(201)
      .json(
        new ApiResponse(201, updateProduct, "Product updated successfully.")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json(
        new ApiResponse(200, deleteProduct, "Product deleted successfully.")
      );
  } catch (error) {
    console.log(`Error while deleting product:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? GET PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully."));
  } catch (error) {
    console.log(`Error while getting products:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

// ? GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, products, "All products fetched successfully.")
      );
  } catch (error) {
    console.log(`Error while getting all products:`, error);
    res.status(500).json(new ApiError(500, error.message));
  }
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getAllProducts,
};
