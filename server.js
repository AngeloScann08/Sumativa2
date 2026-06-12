const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Carpeta donde se guardarán los archivos
const carpetaUploads = path.join(__dirname, "uploads");

// Crear carpeta si no existe
if (!fs.existsSync(carpetaUploads)) {
    fs.mkdirSync(carpetaUploads);
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, carpetaUploads);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Servir carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Ruta para subir archivos
app.post("/subir", upload.single("archivo"), (req, res) => {
    res.send("Archivo recibido correctamente");
});

// Ruta para listar archivos
app.get("/archivos", (req, res) => {
    fs.readdir(carpetaUploads, (err, archivos) => {
        if (err) return res.status(500).json({ error: "Error al leer carpeta" });
        res.json(archivos);
    });
});

// Ruta para descargar archivos
app.get("/descargar/:nombre", (req, res) => {
    const archivo = path.join(carpetaUploads, req.params.nombre);
    res.download(archivo);
});

// ⭐ NUEVA RUTA: borrar archivos
app.delete("/borrar/:nombre", (req, res) => {
    const archivo = path.join(carpetaUploads, req.params.nombre);

    if (!fs.existsSync(archivo)) {
        return res.status(404).json({ error: "Archivo no encontrado" });
    }

    fs.unlink(archivo, (err) => {
        if (err) return res.status(500).json({ error: "No se pudo borrar" });
        res.json({ mensaje: "Archivo borrado correctamente" });
    });
});

// Puerto para Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
