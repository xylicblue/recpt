// src/App.jsx

import { useState, useEffect } from "react";
import ReceiptForm from "./form";
import { generatePdf } from "./pdf";
import "./App.css";

function App() {
  const [details, setDetails] = useState({
    companyName: "AUTOMECH WORKSHOP",
    companyAddress: "570, Q-BLOCK, JOHAR TOWN",
    companyPhone: "03004292156",
    clientName: "",
    clientAddress: "",
    receiptNumber: "",
    receiptDate: new Date().toISOString().split("T")[0],
    discount: 0,
  });

  const [items, setItems] = useState([
    { id: 1, description: "Web Design", quantity: 1, price: 1200 },
    { id: 2, description: "Domain Name", quantity: 1, price: 15 },
  ]);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    const randomReceiptNumber = String(
      Math.floor(100000000 + Math.random() * 900000000)
    );

    setDetails((prevDetails) => ({
      ...prevDetails,
      receiptNumber: randomReceiptNumber,
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!details.companyName)
      newErrors.companyName = "Company name is required.";
    if (!details.clientName) newErrors.clientName = "Client name is required.";

    items.forEach((item, index) => {
      if (!item.description) {
        if (!newErrors.items) newErrors.items = [];
        newErrors.items[index] = "Description cannot be blank.";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePdf = () => {
    if (!validateForm()) {
      alert(
        "Please fill in all required fields before generating the receipt."
      );
      return;
    }
    generatePdf(details, items);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Receipt Generator</h1>
        <p>Create professional, downloadable PDF receipts in seconds.</p>
      </header>
      <main>
        <ReceiptForm
          details={details}
          setDetails={setDetails}
          items={items}
          setItems={setItems}
          errors={errors}
        />
        <div className="generate-button-container">
          <button className="generate-btn" onClick={handleGeneratePdf}>
            Generate Receipt
          </button>
        </div>
      </main>
      <footer className="app-footer">
        <p>Built with React & jsPDF</p>
      </footer>
    </div>
  );
}

export default App;
