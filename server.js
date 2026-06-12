const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, "public")));


app.post("/subir", upload.single("archivo"), (req, res) => {
    if (!req.file) return res.status(400).send("No subiste ningún archivo");
    res.send("Archivo recibido correctamente");
});

app.get("/archivos", (req, res) => {
    fs.readdir("uploads", (err, files) => {
        if (err) return res.status(500).send("Error leyendo archivos");
        res.json(files);
    });
});

app.get("/descargar/:nombre", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.nombre);
    res.download(filePath);
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto " + PORT);
});
