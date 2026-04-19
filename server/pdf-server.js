const PDFDocument = require("pdfkit");
const path = require("path");

function roundTwo(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Inclusive GST Logic:
 * Extracts the tax already hidden inside the snapPrice.
 */
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
  return "INV-" + Date.now() + "-" + (orderId ? orderId.toString().slice(-4) : "0000");
}

function buildPDF(order, dataCallback, endCallback) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const GST_RATE = 18;
  const invoiceNo = generateInvoiceNumber(order._id);
  const paymentStatus = order.paymentMethod === "COD" ? "Pending" : "Paid";

  // --- Logo & Header ---
  const logoPath = path.join(__dirname, "images", "bighaat-logo.png");
  try {
    doc.image(logoPath, 50, 45, { width: 130 });
  } catch (e) {
    doc.fontSize(14).font("Helvetica-Bold").text("BigHaat", 50, 45);
  }

  doc.fontSize(10).font("Helvetica-Bold").text("Corporate Office:", 350, 45);
  doc.font("Helvetica").fontSize(9).text("BigHaat Agro Pvt Ltd", 350, 58);
  doc.text("19/2, SKR Tower, 15th Cross, Bangalore", 350, 70);

  doc.moveTo(50, 135).lineTo(545, 135).lineWidth(1).stroke("#cccccc");
  doc.fillColor("black").fontSize(16).font("Helvetica-Bold").text("TAX INVOICE", 50, 155);

  // --- Table Header Definitions ---
  let tableY = 320; 
  doc.rect(50, tableY, 500, 25).fill("#f2f2f2");
  doc.fillColor("black").font("Helvetica-Bold").fontSize(9);
  
  // Column X Positions
  const cItem = 60;
  const cQty = 220;
  const cBase = 260;
  const cCGST = 330;
  const cSGST = 400;
  const cTotal = 480;

  doc.text("Item", cItem, tableY + 8);
  doc.text("Qty", cQty, tableY + 8);
  doc.text("Base", cBase, tableY + 8, { width: 60, align: "right" });
  doc.text("CGST(9%)", cCGST, tableY + 8, { width: 60, align: "right" });
  doc.text("SGST(9%)", cSGST, tableY + 8, { width: 60, align: "right" });
  doc.text("Total", cTotal, tableY + 8, { width: 60, align: "right" });

  // --- Table Rows ---
  let itemY = tableY + 32;
  let totalSubtotal = 0;
  let totalGST_Accumulator = 0;

  doc.font("Helvetica").fontSize(8.5); // Slightly smaller to fit columns
  order.items.forEach((item) => {
    const qty = Number(item.quantity);
    const lineTotal = roundTwo(Number(item.snapPrice) * qty);
    
    const { base, gst } = extractGST(lineTotal, GST_RATE);
    
    // Split the GST
    const cgst = roundTwo(gst / 2);
    const sgst = roundTwo(gst - cgst); // Handles rounding pennies correctly

    totalSubtotal += base;
    totalGST_Accumulator += gst;

    doc.text(item.snapName, cItem, itemY, { width: 155 });
    doc.text(qty.toString(), cQty, itemY, { width: 25, align: "center" });
    doc.text(`₹${base.toFixed(2)}`, cBase, itemY, { width: 60, align: "right" });
    doc.text(`₹${cgst.toFixed(2)}`, cCGST, itemY, { width: 60, align: "right" });
    doc.text(`₹${sgst.toFixed(2)}`, cSGST, itemY, { width: 60, align: "right" });
    doc.text(`₹${lineTotal.toFixed(2)}`, cTotal, itemY, { width: 60, align: "right" });

    itemY += 25;
  });

  doc.moveTo(50, itemY).lineTo(550, itemY).lineWidth(0.5).stroke("#cccccc");

  // --- Final Totals Summary ---
  let totalsY = itemY + 20;
  const finalGrandTotal = totalSubtotal + totalGST_Accumulator;

  doc.fontSize(10).font("Helvetica");
  doc.text("Taxable Value:", 350, totalsY, { width: 100, align: "right" });
  doc.text(`₹${totalSubtotal.toFixed(2)}`, 460, totalsY, { width: 80, align: "right" });

  doc.text("Total GST:", 350, totalsY + 18, { width: 100, align: "right" });
  doc.text(`₹${totalGST_Accumulator.toFixed(2)}`, 460, totalsY + 18, { width: 80, align: "right" });

  doc.rect(340, totalsY + 45, 210, 30).fill("#f2f2f2");
  doc.fillColor("black").font("Helvetica-Bold").fontSize(11);
  doc.text("Grand Total:", 350, totalsY + 55);
  doc.text(`₹${finalGrandTotal.toFixed(2)}`, 450, totalsY + 55, { width: 90, align: "right" });

  doc.end();
}

module.exports = { buildPDF };
