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
  const paymentStatus =
    paymentMethod === "COD" ? "Pending" : "Paid";

  const shippingCost = 0;
  const estimatedDays = "1week";

 
  doc.fontSize(18).text("BigHaat Agro Pvt Ltd", { align: "left" });

  doc.fontSize(10).text(`Invoice #: ${invoiceNo}`, 400, 50);
  doc.text(`Order ID: ${order._id}`, 400, 65);
  doc.text(`Date: ${new Date(order.datetime).toLocaleDateString("en-IN")}`, 400, 80);
  doc.text(`Payment: ${paymentMethod}`, 400, 95);
  doc.text(`Status: ${paymentStatus}`, 400, 110);
  doc.text(`Shipping: Standard Delivery`, 400, 125);
  doc.text(`Estimated: ${estimatedDays}`, 400, 140);
  doc.text(`Shipping Cost: ${shippingCost === 0 ? "Free" : shippingCost}`, 400, 155);
  doc.text(`GSTIN: ${gstin}`, 400, 170);

  doc.moveDown(2);

  
  doc.font("Helvetica-Bold").text("Corporate Office:");
  doc.font("Helvetica");
  doc.text("BigHaat Agro Pvt Ltd");
  doc.text("19/2, SKR Tower,");
  doc.text("15th Cross, 4th Phase,");
  doc.text("Dollars Layout, J.P.Nagar,");
  doc.text("Bangalore - 560078");
  doc.text("Karnataka, India");
  doc.text("CIN: U74900KA2015PTC082769");

  doc.moveDown();

  doc.font("Helvetica-Bold").text("Billed To:");
  doc.font("Helvetica");

  const addr = order.address || {};

  doc.text(addr.name || "");
  doc.text(`${addr.flat || ""}, ${addr.street || ""}`);
  doc.text(`${addr.city || ""}, ${addr.district || ""}`);
  doc.text(`${addr.state || ""} - ${addr.pincode || ""}`);
  if (addr.landmark) doc.text(`Landmark: ${addr.landmark}`);
  doc.text(`Phone: ${addr.phone || ""}`);

  doc.moveDown(2);


  const tableTop = doc.y;

  const col1 = 50;
  const col2 = 250;
  const col3 = 320;
  const col4 = 420;

  doc.font("Helvetica-Bold");

  doc.text("Item", col1, tableTop);
  doc.text("Qty", col2, tableTop);
  doc.text("Price", col3, tableTop);
  doc.text("Total", col4, tableTop);

  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let y = tableTop + 25;

  doc.font("Helvetica");

  let subtotal = 0;
  let totalGST = 0;

  order.items.forEach((item, i) => {
    if (y > 750) {
      doc.addPage();
      y = 50;
    }

    const price = Number(item.snapPrice);
    const qty = Number(item.quantity);

    const totalWithGST = price * qty;

    const { base, gst, total } = extractGST(totalWithGST, GST_RATE);

    subtotal += base;
    totalGST += gst;

    doc.text(item.snapName, col1, y, { width: 180 });
    doc.text(qty, col2, y);
    doc.text(`₹${price}`, col3, y);
    doc.text(`₹${total.toFixed(2)}`, col4, y);

    y += 20;
  });

  doc.moveTo(50, y).lineTo(550, y).stroke();

  y += 20;

  const grandTotal = subtotal + totalGST;

  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, y);
  y += 15;

  doc.text(`GST (18%): ₹${totalGST.toFixed(2)}`, 350, y);
  y += 15;

  doc.text(`Shipping: FREE`, 350, y);
  y += 15;

  doc.font("Helvetica-Bold");
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 350, y);

  doc.moveDown(2);

  
  doc.font("Helvetica");
  doc.text("Support: support@bighaat.com");
  doc.text("Phone: +91 9876543210");

  doc.moveDown();
  doc.text("Thank you for shopping with BigHaat!", {
    align: "center",
  });

  doc.end();
}

module.exports = { buildPDF };
