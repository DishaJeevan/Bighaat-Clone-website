const PDFDocument = require("pdfkit");

function roundTwo(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}


function extractGST(totalPrice, rate) {
  const r = rate / 100;

  const base = totalPrice / (1 + r);
  const gst = totalPrice - base;

  return {
    base: roundTwo(base),
    gst: roundTwo(gst),
    total: roundTwo(totalPrice),
  };
}

function buildPDF(order, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 50 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const GST_RATE = 18;

  doc.fontSize(16).text("Your Company Name", { align: "center" });
  doc.moveDown();

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Email: ${order.email}`);
  doc.text(
    `Date: ${new Date(order.datetime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );

  doc.moveDown(2);

  const tableTop = doc.y;

  const col1 = 50;
  const col2 = 200;
  const col3 = 280;
  const col4 = 360;
  const col5 = 440;
  const col6 = 520;

  doc.font("Helvetica-Bold");

  doc.text("Product", col1, tableTop);
  doc.text("Qty", col2, tableTop);
  doc.text("Base", col3, tableTop);
  doc.text("CGST", col4, tableTop);
  doc.text("SGST", col5, tableTop);
  doc.text("Total", col6, tableTop);

  doc.moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  let y = tableTop + 25;

  doc.font("Helvetica");

  let subtotal = 0;
  let totalGST = 0;

  order.items.forEach((item, index) => {
    const price = item.snapPrice; // INCLUSIVE GST price
    const qty = item.quantity;

    const totalWithGST = price * qty;

    const { base, gst, total } = extractGST(totalWithGST, GST_RATE);

    const cgst = gst / 2;
    const sgst = gst / 2;

    subtotal += base;
    totalGST += gst;


    if (index % 2 === 0) {
      doc.rect(50, y - 5, 500, 20).fill("#f2f2f2");
      doc.fillColor("#000000");
    }

    doc.text(item.snapName, col1, y, { width: 140 });
    doc.text(qty, col2, y);
    doc.text(`₹${base.toFixed(2)}`, col3, y);
    doc.text(`₹${cgst.toFixed(2)}`, col4, y);
    doc.text(`₹${sgst.toFixed(2)}`, col5, y);
    doc.text(`₹${total.toFixed(2)}`, col6, y);

    y += 25;
  });

  doc.moveTo(50, y)
    .lineTo(550, y)
    .stroke();

  y += 20;

  const cgstTotal = totalGST / 2;
  const sgstTotal = totalGST / 2;
  const grandTotal = subtotal + totalGST;

  doc.font("Helvetica");

  doc.text(`Taxable Value: ₹${subtotal.toFixed(2)}`, 350, y);
  y += 15;

  doc.text(`CGST (9%): ₹${cgstTotal.toFixed(2)}`, 350, y);
  y += 15;

  doc.text(`SGST (9%): ₹${sgstTotal.toFixed(2)}`, 350, y);
  y += 15;

  doc.font("Helvetica-Bold");
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 350, y);

  doc.moveDown(2);

  doc.font("Helvetica");
  doc.text("Thank you for your purchase!", { align: "center" });

  doc.end();
}

module.exports = { buildPDF };
