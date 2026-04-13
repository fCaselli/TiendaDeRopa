import Product from "../models/Product.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");

    return sendSuccess(res, {
      message: "Categorías obtenidas correctamente.",
      data: categories,
      meta: { total: categories.length },
    });
  } catch (error) {
    next(error);
  }
};
