const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");

// Función para manejar la generación del documento Word
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_name, email, experience } = req.body;

    // Cargar la plantilla desde la carpeta
    const templatePath = path.resolve("./api", "template.docx");
    const content = fs.readFileSync(templatePath, "binary");

    // Inicializar PizZip con el contenido de la plantilla
    const zip = new PizZip(content);

    // Crear un nuevo objeto docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Proporcionar los datos dinámicos para la plantilla
    doc.setData({
      user_name,
      email,
      experience,
    });

    try {
      // Rellenar el documento con los datos proporcionados
      doc.render();
    } catch (error) {
      console.error(`Error generating the document: ${error.message}`);
      return res.status(500).send("Error generating the document");
    }

    // Generar el archivo Word y enviarlo como respuesta
    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // Configurar la respuesta para descargar el archivo
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=generated_resume.docx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buf);
  } else {
    res.status(405).json({ message: "Only POST method is allowed" });
  }
}
