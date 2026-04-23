import { useState } from "react";
import axios from "axios";


function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://bighaat-clone.onrender.com/contacts", form);
      setStatus(" Message sent!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("Failed to send");
    }
  };

  return (
     <div className="contact-page">
      <div className="contact-card">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          Any FeedBack Let us know 
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
  <div className="input-group">
    <input
      type="text"
      name="name"
      placeholder="NAME"
      value={form.name}
      onChange={handleChange}
      required
    />
    
  </div>

  <div className="input-group">
    <input
      type="email"
      name="email"
      placeholder="EMAIL"
      value={form.email}
      onChange={handleChange}
      required
    />
    
  </div>

  <div className="input-group">
    <textarea
      name="message"
      placeholder="MESSAGE"
      value={form.message}
      onChange={handleChange}
      rows="4"
      required
    ></textarea>
    
  </div>

  <button type="submit" className="submit-btn">
    Send Message
  </button>
</form>

<p>{status}</p>
      </div>
    </div>
  );
}

export default Contact;
