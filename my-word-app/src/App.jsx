import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    experience: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los datos al backend en Vercel
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate-word`,
        formData,
        {
          responseType: "blob", // Para manejar archivos binarios
        }
      );

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "generated_resume.docx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error generating the document:", error);
    }
  };

  return (
    <div className="App">
      <h1>Generate Resume</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_name">Name:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="experience">Experience:</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Generate Word Document</button>
      </form>
    </div>
  );
}

export default App;
