const PDFDocument = require("pdfkit");

function buildPDF(order, dataCallback, endCallback) {
  const doc = new PDFDocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(20).text("Hello");

  doc.moveDown();


  doc.fontSize(12).text(`Email: ${order.email}`);

  doc.text(
    `Date: ${new Date(order.datetime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    })}`
  );

  doc.moveDown();


  doc.fontSize(14).text("Thank you for your order!");

  doc.moveDown();

  doc.text("Your order has been received successfully.");

  doc.moveDown();

  doc.fontSize(12).text("Items:");

  order.items.forEach((item) => {
    doc.text(
      `${item.snapName} - Qty: ${item.quantity} - ₹${item.snapPrice}`
    );
  });

  doc.moveDown();


  let total = 0;

  order.items.forEach((item) => {
    total += item.snapPrice * item.quantity;
  });

  doc.fontSize(14).text(`Total: ₹${total.toFixed(2)}`);

  doc.moveDown();


  doc.fontSize(12).text("Thank you!");

  doc.end();
}

module.exports = { buildPDF };
