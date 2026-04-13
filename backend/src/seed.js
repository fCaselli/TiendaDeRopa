import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/Product.js";

const products = [
  {
    name: "Blazer Tailored Ivory",
    category: "Blazers",
    price: 129900,
    stock: 8,
    description: "Blazer de corte estructurado, diseño minimalista y terminaciones premium.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
  {
    name: "Camisa Essential Black",
    category: "Camisas",
    price: 69900,
    stock: 15,
    description: "Camisa versátil de líneas limpias, ideal para looks urbanos y elegantes.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    featured: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Productos cargados correctamente");
  } catch (error) {
    console.error("Error al cargar productos:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
