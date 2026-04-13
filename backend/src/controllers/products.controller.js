import Product from "../models/Product.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search.trim(), $options: "i" };
    if (featured === "true") filter.featured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return sendSuccess(res, {
      message: "Productos obtenidos correctamente.",
      data: products,
      meta: { total: products.length },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, {
        statusCode: 404,
        message: "Producto no encontrado.",
      });
    }

    return sendSuccess(res, {
      message: "Producto obtenido correctamente.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
