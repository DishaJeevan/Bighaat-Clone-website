const PDFDocument = require("pdfkit");

function buildPDF(order, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 50 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const GST_RATE = 18;

  // ================= HEADER =================
  doc.fontSize(16).text("Your Company Name", { align: "center" });
  doc.text("GSTIN: 29ABCDE1234F1Z5", { align: "center" });
  doc.moveDown();

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Email: ${order.email}`);
  doc.text(`Date: ${new Date(order.datetime).toLocaleString()}`);
  doc.moveDown(2);

  // ================= TABLE HEADER =================
  const tableTop = doc.y;

  const col1 = 50;   // Product
  const col2 = 250;  // Qty
  const col3 = 300;  // Price
  const col4 = 370;  // CGST
  const col5 = 440;  // SGST
  const col6 = 510;  // Total

  doc.font("Helvetica-Bold");
  doc.text("Product", col1, tableTop);
  doc.text("Qty", col2, tableTop);
  doc.text("Price", col3, tableTop);
  doc.text("CGST", col4, tableTop);
  doc.text("SGST", col5, tableTop);
  doc.text("Total", col6, tableTop);

  doc.moveTo(50, tableTop + 15)
     .lineTo(550, tableTop + 15)
     .stroke();

  doc.font("Helvetica");

  let y = tableTop + 25;

  let subtotal = 0;
  let totalGST = 0;


  order.items.forEach(item => {
    const price = item.snapPrice;
    const qty = item.quantity;

    const totalPrice = price * qty;

  
    const gst = (totalPrice * GST_RATE) / (100 + GST_RATE);
    const base = totalPrice - gst;

    const cgst = gst / 2;
    const sgst = gst / 2;

    subtotal += base;
    totalGST += gst;

    doc.text(item.snapName, col1, y, { width: 180 });
    doc.text(qty, col2, y);
    doc.text(`₹${price}`, col3, y);
    doc.text(`₹${cgst.toFixed(2)}`, col4, y);
    doc.text(`₹${sgst.toFixed(2)}`, col5, y);
    doc.text(`₹${totalPrice.toFixed(2)}`, col6, y);

    y += 25;
  });

 
  doc.moveDown();

  const cgstTotal = totalGST / 2;
  const sgstTotal = totalGST / 2;
  const grandTotal = subtotal + totalGST;

  doc.moveTo(50, y)
     .lineTo(550, y)
     .stroke();

  y += 10;

  doc.text(`Taxable Value: ₹${subtotal.toFixed(2)}`, 350, y);
  y += 20;
  doc.text(`CGST (9%): ₹${cgstTotal.toFixed(2)}`, 350, y);
  y += 20;
  doc.text(`SGST (9%): ₹${sgstTotal.toFixed(2)}`, 350, y);
  y += 20;

  doc.font("Helvetica-Bold");
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 350, y);

 
  doc.moveDown(2);
  doc.font("Helvetica");
  doc.text("Thank you for your purchase!", { align: "center" });

  doc.end();
}

module.exports = { buildPDF };
