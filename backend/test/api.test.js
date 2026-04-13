import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import Product from "../src/models/Product.js";
import Contact from "../src/models/Contact.js";

const app = createApp();

test("GET / responde con estado operativo de la API", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.match(response.body.message, /api/i);
});

test("POST /api/contact devuelve 400 con errores por campo cuando faltan datos válidos", async () => {
  const response = await request(app)
    .post("/api/contact")
    .send({ name: " ", email: "mal", subject: "ok", message: "corto" });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.ok(response.body.errors.name);
  assert.ok(response.body.errors.email);
  assert.ok(response.body.errors.subject);
  assert.ok(response.body.errors.message);
});

test("POST /api/contact normaliza y persiste datos válidos", async () => {
  const originalCreate = Contact.create;
  Contact.create = async (payload) => ({ _id: "contact-1", ...payload });

  try {
    const response = await request(app)
      .post("/api/contact")
      .send({
        name: "  Fabricio  ",
        email: "  FABRI@example.com ",
        subject: "  Consulta de stock  ",
        message: "  Hola, quería saber si tienen talle disponible.  ",
      });

    assert.equal(response.status, 201);
    assert.equal(response.body.success, true);
    assert.equal(response.body.data.name, "Fabricio");
    assert.equal(response.body.data.email, "fabri@example.com");
    assert.equal(response.body.data.subject, "Consulta de stock");
    assert.equal(response.body.data.message, "Hola, quería saber si tienen talle disponible.");
  } finally {
    Contact.create = originalCreate;
  }
});

test("GET /api/products devuelve 400 cuando el ObjectId es inválido", async () => {
  const response = await request(app).get("/api/products/id-invalido");

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.match(response.body.message, /id/i);
});

test("GET /api/products/:id devuelve 404 si el producto no existe", async () => {
  const originalFindById = Product.findById;
  Product.findById = async () => null;

  try {
    const response = await request(app).get("/api/products/507f1f77bcf86cd799439011");

    assert.equal(response.status, 404);
    assert.equal(response.body.success, false);
    assert.match(response.body.message, /no encontrado/i);
  } finally {
    Product.findById = originalFindById;
  }
});

test("GET /api/categories devuelve categorías con metadata total", async () => {
  const originalDistinct = Product.distinct;
  Product.distinct = async () => ["Abrigos", "Blazers"];

  try {
    const response = await request(app).get("/api/categories");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.data, ["Abrigos", "Blazers"]);
    assert.equal(response.body.meta.total, 2);
  } finally {
    Product.distinct = originalDistinct;
  }
});

test("ruta inexistente devuelve 404 con metadata útil", async () => {
  const response = await request(app).get("/ruta-inexistente");

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.meta.method, "GET");
  assert.equal(response.body.meta.path, "/ruta-inexistente");
});
