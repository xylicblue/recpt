import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (details, items) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(details.companyName, margin, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(details.companyAddress, margin, 28);
  doc.text(details.companyPhone, margin, 34);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", pageWidth - margin, 20, { align: "right" });

  // --- Details ---
  let currentY = 50;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(details.clientName, margin, currentY + 6);
  doc.text(details.clientAddress, margin, currentY + 12);
  doc.setFont("helvetica", "bold");
  doc.text("Receipt #:", pageWidth - margin - 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(details.receiptNumber, pageWidth - margin, currentY, {
    align: "right",
  });
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - margin - 50, currentY + 6);
  doc.setFont("helvetica", "normal");
  doc.text(details.receiptDate, pageWidth - margin, currentY + 6, {
    align: "right",
  });
  currentY += 20;
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // --- Table of Items ---
  currentY += 10;
  const tableHeaders = [["Description", "Quantity", "Unit Price", "Total"]];
  let subtotal = 0;
  const tableData = items.map((item) => {
    const total = item.quantity * item.price;
    subtotal += total;
    return [
      item.description,
      item.quantity,
      `$${Number(item.price).toFixed(2)}`,
      `$${total.toFixed(2)}`,
    ];
  });

  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: currentY,
    theme: "plain",
    headStyles: {
      fillColor: [22, 22, 22],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 2.5 },
    margin: { left: margin, right: margin },
  });

  const discountAmount = Number(details.discount) || 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxRate = 0;
  const tax = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + tax;
  let totalsY = doc.lastAutoTable.finalY;
  totalsY = totalsY > pageHeight - 80 ? totalsY + 10 : pageHeight - 80;

  const totalsX = pageWidth - margin;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Subtotal:", totalsX - 50, totalsY, { align: "left" });
  doc.setFont("helvetica", "normal");
  doc.text(`$${subtotal.toFixed(2)}`, totalsX, totalsY, { align: "right" });

  if (discountAmount > 0) {
    totalsY += 7;
    doc.setFont("helvetica", "bold");
    doc.text("Discount:", totalsX - 50, totalsY, { align: "left" });
    doc.setFont("helvetica", "normal");
    doc.text(`-$${discountAmount.toFixed(2)}`, totalsX, totalsY, {
      align: "right",
    });
  }

  totalsY += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Tax (8%):", totalsX - 50, totalsY, { align: "left" });
  doc.setFont("helvetica", "normal");
  doc.text(`$${tax.toFixed(2)}`, totalsX, totalsY, { align: "right" });

  totalsY += 3;
  doc.setLineWidth(0.5);
  doc.line(totalsX - 50, totalsY, totalsX, totalsY);

  totalsY += 7;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", totalsX - 50, totalsY, { align: "left" });
  doc.text(`$${total.toFixed(2)}`, totalsX, totalsY, { align: "right" });

  const signatureY = pageHeight - margin - 30;
  const signatureX1 = margin;
  const signatureX2 = pageWidth / 2 + 10;
  const signatureLineLength = pageWidth / 2 - margin - 20;

  doc.setLineWidth(0.3);
  doc.line(
    signatureX1,
    signatureY,
    signatureX1 + signatureLineLength,
    signatureY
  );
  doc.setFontSize(10);
  doc.text("Company Signature", signatureX1, signatureY + 5);

  doc.line(
    signatureX2,
    signatureY,
    signatureX2 + signatureLineLength,
    signatureY
  );
  doc.text("Client Signature", signatureX2, signatureY + 5);

  doc.save(`receipt-${details.receiptNumber}.pdf`);
};
