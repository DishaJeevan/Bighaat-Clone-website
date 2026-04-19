const PDFDocument = require("pdfkit");
const path = require("path");

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


function generateInvoiceNumber(orderId) {
  return "INV-" + Date.now() + "-" + orderId.toString().slice(-4);
}

function generateGSTIN() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let gst = "";
  for (let i = 0; i < 15; i++) {
    gst += chars[Math.floor(Math.random() * chars.length)];
  }
  return gst;
}



function buildPDF(order, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 50 });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const GST_RATE = 18;

  const invoiceNo = generateInvoiceNumber(order._id);
  const gstin = generateGSTIN();

  const paymentMethod = order.paymentMethod;
  const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

  const logoPath = path.join(__dirname, "images", "bighaat-logo.png");

  
  doc.image(logoPath, 50, 40, { width: 160 });

  doc.fontSize(10);

  doc.text(`Invoice #: ${invoiceNo}`, 380, 50);
  doc.text(`Order ID: ${order._id}`, 380, 65);
  doc.text(`Date: ${new Date(order.datetime).toLocaleDateString("en-IN")}`, 380, 80);
  doc.text(`Payment: ${paymentMethod}`, 380, 95);
  doc.text(`Status: ${paymentStatus}`, 380, 110);
  doc.text(`Shipping: Standard Delivery`, 380, 125);
  doc.text(`Estimated: 3–5 Days`, 380, 140);
  doc.text(`Shipping Cost: Free`, 380, 155);
  doc.text(`GSTIN: ${gstin}`, 380, 170);

  doc.moveTo(50, 200).lineTo(550, 200).stroke();

 
  doc.fontSize(16).font("Helvetica-Bold");
  doc.text("OFFICIAL RECEIPT", 50, 220);

 
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Corporate Office:", 350, 220);

  doc.font("Helvetica");
  doc.text("BigHaat Agro Pvt Ltd", 350, 235);
  doc.text("19/2, SKR Tower,", 350, 250);
  doc.text("15th Cross, 4th Phase,", 350, 265);
  doc.text("Dollars Layout, J.P.Nagar,", 350, 280);
  doc.text("Bangalore - 560078", 350, 295);
  doc.text("Karnataka, India", 350, 310);
  doc.text("CIN: U74900KA2015PTC082769", 350, 325);

  // ---------------- BILLED ----------------
  const addr = order.address || {};

  doc.font("Helvetica-Bold").text("Billed To:", 50, 260);
  doc.font("Helvetica");

  let y = 275;

  doc.text(addr.name || "", 50, y); y += 15;
  doc.text(`${addr.flat || ""}, ${addr.street || ""}`, 50, y); y += 15;
  doc.text(`${addr.city || ""}, ${addr.district || ""}`, 50, y); y += 15;
  doc.text(`${addr.state || ""} - ${addr.pincode || ""}`, 50, y); y += 15;
  if (addr.landmark) {
    doc.text(`Landmark: ${addr.landmark}`, 50, y);
    y += 15;
  }
  doc.text(`Phone: ${addr.phone || ""}`, 50, y);

  let tableY = 360;

  doc.rect(50, tableY, 500, 25).fill("#dddddd");

  doc.fillColor("black").font("Helvetica-Bold");
  doc.text("Item", 60, tableY + 7);
  doc.text("Qty", 280, tableY + 7);
  doc.text("Price", 360, tableY + 7);
  doc.text("Total", 450, tableY + 7);

  tableY += 35;

  doc.font("Helvetica");

  let subtotal = 0;
  let totalGST = 0;

  order.items.forEach((item) => {
    const price = Number(item.snapPrice);
    const qty = Number(item.quantity);

    const totalWithGST = price * qty;
    const { base, gst, total } = extractGST(totalWithGST, GST_RATE);

    subtotal += base;
    totalGST += gst;

    doc.text(item.snapName, 60, tableY);
    doc.text(qty.toString(), 280, tableY);
    doc.text(`₹${price}`, 360, tableY);
    doc.text(`₹${total.toFixed(2)}`, 450, tableY);

    tableY += 25;
  });

  doc.moveTo(50, tableY).lineTo(550, tableY).stroke();


  tableY += 20;

  const grandTotal = subtotal + totalGST;

  doc.rect(300, tableY, 250, 100).stroke();

  doc.font("Helvetica");
  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 320, tableY + 15);
  doc.text(`GST (18%): ₹${totalGST.toFixed(2)}`, 320, tableY + 35);
  doc.text(`Shipping: FREE`, 320, tableY + 55);

  doc.font("Helvetica-Bold");
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 320, tableY + 75);

 
  doc.moveDown(4);

  doc.font("Helvetica");
  doc.text("Thank you for shopping with BigHaat!", 50, tableY + 130, {
    align: "center",
  });

  doc.text("This is a system-generated invoice.", 50, tableY + 150, {
    align: "center",
  });

  doc.end();
}

module.exports = { buildPDF };
