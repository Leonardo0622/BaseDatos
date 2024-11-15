const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");


// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// Conexión a MongoDB Atlas
mongoose.connect(
  "mongodb+srv://leonardobanoy48:Lion22**@cluster0.sylkb.mongodb.net/crud",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => console.log("Conexión exitosa a MongoDB Atlas"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Esquema y Modelo de Usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

// Rutas del CRUD

// Crear usuario (Create)
app.post("/users", async (req, res) => {
  try {
    const { name, age } = req.body;
    const newUser = new User({ name, age });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario", details: error });
  }
});

// Leer todos los usuarios (Read)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios", details: error });
  }
});

// Leer un usuario por ID (Read)
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario", details: error });
  }
});

// Actualizar un usuario (Update)
app.put("/users/:id", async (req, res) => {
  try {
    const { name, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, age },
      { new: true } // Devuelve el documento actualizado
    );
    if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario", details: error });
  }
});

// Eliminar un usuario (Delete)
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario", details: error });
  }
});

// Iniciar el servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});
