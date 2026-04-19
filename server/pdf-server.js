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
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const GST_RATE = 18;
  const invoiceNo = generateInvoiceNumber(order._id);
  const gstin = generateGSTIN();
  const paymentMethod = order.paymentMethod;
  const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";

  const logoPath = path.join(__dirname, "images", "bighaat-logo.png");
  doc.image(logoPath, 50, 45, { width: 150 });

  doc.fontSize(10).font("Helvetica-Bold").text("Corporate Office:", 350, 45, { align: "left" });
  doc.font("Helvetica").fontSize(9);
   doc.text("BigHaat Agro Pvt Ltd", 350, 58);
  doc.text("19/2, SKR Tower, 15th Cross, 4th Phase,", 350, 70);
  doc.text("Dollars Layout, J.P.Nagar, Bangalore - 560078", 350, 82);
  doc.text("Karnataka, India", 350, 94);
  doc.text("CIN: U74900KA2015PTC082769", 350, 106);


  doc.moveTo(50, 135).lineTo(545, 135).lineWidth(1).stroke("#cccccc");

  doc.fillColor("black").fontSize(16).font("Helvetica-Bold").text("OFFICIAL RECEIPT", 50, 155);

  doc.fontSize(10).font("Helvetica-Bold");
  let gridY = 190;
  
  doc.text("Invoice #:", 50, gridY);
  doc.font("Helvetica").text(invoiceNo, 130, gridY);
  
  doc.font("Helvetica-Bold").text("Order ID:", 50, gridY + 18);
  doc.font("Helvetica").text(order._id, 130, gridY + 18);

  doc.font("Helvetica-Bold").text("Date:", 50, gridY + 36);
  doc.font("Helvetica").text(new Date(order.datetime).toLocaleDateString("en-IN"), 130, gridY + 36);

  doc.font("Helvetica-Bold").text("Payment:", 50, gridY + 54);
  doc.font("Helvetica").text(paymentMethod, 130, gridY + 54);

  doc.font("Helvetica-Bold").text("Status:", 50, gridY + 72);
  doc.font("Helvetica").text(paymentStatus, 130, gridY + 72);

  const col2X = 330;
  const col2ValueX = 430;
   doc.font("Helvetica-Bold").text("Shipping:", col2X, gridY);
  doc.font("Helvetica").text("Standard Delivery", col2ValueX, gridY);

  doc.font("Helvetica-Bold").text("Estimated:", col2X, gridY + 18);
  doc.font("Helvetica").text("3–5 Days", col2ValueX, gridY + 18);

  doc.font("Helvetica-Bold").text("Shipping Cost:", col2X, gridY + 36);
  doc.font("Helvetica").text("Free", col2ValueX, gridY + 36);

  doc.font("Helvetica-Bold").text("GSTIN:", col2X, gridY + 54);
  doc.font("Helvetica").text(gstin, col2ValueX, gridY + 54);

  doc.font("Helvetica-Bold").text("Support:", col2X, gridY + 72);
  doc.font("Helvetica").text("support@bighaat.com", col2ValueX, gridY + 72);
  
  doc.font("Helvetica-Bold").text("Phone:", col2X, gridY + 90);
  doc.font("Helvetica").text("+91 9876543210", col2ValueX, gridY + 90);


  let billedY = gridY + 120;
  doc.font("Helvetica-Bold").fontSize(11).text("Billed To:", 50, billedY);
  doc.font("Helvetica").fontSize(10);
  
  const addr = order.address || {};
  let currentY = billedY + 18;
  doc.text(addr.name || "Customer Name", 50, currentY);
  currentY += 15;
  doc.text(`${addr.flat || ""}, ${addr.street || ""}`, 50, currentY);
  currentY += 15;
  doc.text(`${addr.city || ""}, ${addr.district || ""}, ${addr.state || ""} - ${addr.pincode || ""}`, 50, currentY);

  
  let tableY = currentY + 30;
  doc.rect(50, tableY, 495, 25).fill("#f2f2f2");
  doc.fillColor("black").font("Helvetica-Bold");
  
 
  doc.text("Item", 60, tableY + 8);
  doc.text("Qty", 210, tableY + 8, { width: 30, align: "center" });
  doc.text("Price", 250, tableY + 8, { width: 60, align: "right" });
  doc.text("CGST", 320, tableY + 8, { width: 60, align: "right" });
  doc.text("SGST", 390, tableY + 8, { width: 60, align: "right" });
  doc.text("Total", 470, tableY + 8, { width: 70, align: "right" });

  let itemY = tableY + 32;
  let totalSubtotal = 0;
  let totalGST_Acc = 0;

  doc.font("Helvetica");
  order.items.forEach((item) => {
    const price = Number(item.snapPrice);
    const qty = Number(item.quantity);
    const lineTotal = roundTwo(price * qty);
    
    const { base, gst } = extractGST(lineTotal, GST_RATE);
    const cgst = roundTwo(gst / 2);
    const sgst = roundTwo(gst - cgst);

    totalSubtotal += base;
    totalGST_Acc += gst;

    doc.text(item.snapName, 60, itemY, { width: 140 });
    doc.text(qty.toString(), 210, itemY, { width: 30, align: "center" });
    doc.text(`${price.toFixed(2)}`, 250, itemY, { width: 60, align: "right" });
    doc.text(`${cgst.toFixed(2)}`, 320, itemY, { width: 60, align: "right" });
    doc.text(`${sgst.toFixed(2)}`, 390, itemY, { width: 60, align: "right" });
    doc.text(`${lineTotal.toFixed(2)}`, 470, itemY, { width: 70, align: "right" });

    itemY += 25;
  });

  doc.moveTo(50, itemY).lineTo(545, itemY).lineWidth(0.5).stroke("#cccccc");

  
  let totalsY = itemY + 20;
  const finalGrandTotal = totalSubtotal + totalGST_Acc;


  doc.font("Helvetica").fontSize(10);
  doc.text("Subtotal:", 350, totalsY, { width: 100, align: "right" });
  doc.text(`${totalSubtotal.toFixed(2)}`, 470, totalsY, { width: 70, align: "right" });

  
  doc.text("Shipping:", 350, totalsY + 18, { width: 100, align: "right" });
  doc.text("FREE", 470, totalsY + 18, { width: 70, align: "right" });


  doc.rect(320, totalsY + 45, 225, 35).fill("#f2f2f2");
  doc.fillColor("black").font("Helvetica-Bold").fontSize(12);
  doc.text("Grand Total:", 330, totalsY + 57);
  doc.text(`${finalGrandTotal.toFixed(2)}`, 445, totalsY + 57, { width: 95, align: "right" });

  doc.fontSize(10).font("Helvetica").fillColor("#333333");
  doc.text("Thank you for shopping with BigHaat!", 50, 730, { align: "center" });
  doc.fontSize(9).text("This is a system-generated invoice.", 50, 745, { align: "center" });

  doc.end();
}

module.exports = { buildPDF };
