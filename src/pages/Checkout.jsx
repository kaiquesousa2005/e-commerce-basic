import React from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Adicione o QR CODE E A CHAVE PIX
  const qrCodeUrl = "/placeholder.svg";
  const pixKey = "12345678900";

  return (
    <div className="checkout">
      <h1>Finalizar Compra</h1>
      <div className="order-summary">
        <h2>Resumo do Pedido</h2>
        {cart.map((item) => (
          <div key={item.id} className="order-item">
            <span>{item.name}</span>
            <span>{item.quantity}x</span>
            <span>
              R$ {Number.parseFloat(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total:</strong>
          <strong>R$ {Number.parseFloat(total).toFixed(2)}</strong>
        </div>
      </div>
      <div className="payment-info">
        <h2>Informações de Pagamento</h2>
        <p>
          Para finalizar sua compra, faça um Pix usando o QR Code ou a chave Pix
          abaixo:
        </p>
        <img
          src={qrCodeUrl || "/placeholder.svg"}
          alt="QR Code para pagamento"
          className="qr-code"
        />
        <p>Chave Pix: {pixKey}</p>
      </div>
    </div>
  );
};

export default Checkout;
