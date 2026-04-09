import { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../components/CartContext";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const { cartWithDetails, total, clearCart, closeCart } = useContext(CartContext);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");
  const email = localStorage.getItem("email");

  const address = JSON.parse(localStorage.getItem("address")); // save it before navigating

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const placeOrder = async (paymentData = {}) => {
    const items = cartWithDetails.map(item => ({
      productId: item.id,
      quantity: item.qty,
      snapName: item.name,
      snapPrice: item.newPrice,
      snapImage: item.image
    }));

    await axios.post("https://bighaat-clone.onrender.com/place-order", {
      user_id,
      email,
      items,
      totalPrice: total,
      address,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      ...paymentData
    });

    alert("Order placed");
    clearCart();
    closeCart();
    navigate("/orders");
  };

  const handleOnlinePayment = async () => {
    const { data } = await axios.post(
      "https://bighaat-clone.onrender.com/create-razorpay-order",
      { amount: total }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      handler: function (response) {
        placeOrder({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id
        });
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="payment-container">
      <h2>Select Payment Method</h2>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="ONLINE"
            checked={paymentMethod === "ONLINE"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Pay Online (UPI / Card / NetBanking)
        </label>
      </div>

      <button
        className="pay-btn"
        onClick={() => {
          if (paymentMethod === "COD") {
            placeOrder();
          } else {
            handleOnlinePayment();
          }
        }}
      >
        {paymentMethod === "COD" ? "Place Order" : "Proceed to Pay"}
      </button>
    </div>
  );
}

export default PaymentPage;
