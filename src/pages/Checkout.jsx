import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { createOrder } from "../services/orderService"
import "./Checkout.css"

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    complement: "",
    zipCode: "",
    paymentMethod: "",
  })
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.paymentMethod) {
      alert("Por favor, selecione um método de pagamento.")
      return
    }

    try {
      const orderData = {
        items: cart,
        total,
        ...formData,
      }
      await createOrder(orderData)

      const whatsappNumber = "5585985818139" // Replace with the actual WhatsApp number
      const message = encodeURIComponent(
        `Olá! Gostaria de finalizar minha compra:\n\n${cart
          .map((item) => `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`)
          .join("\n")}\n\nTotal: R$ ${total.toFixed(
            2,
          )}\n\nNome: ${formData.fullName}\nTelefone: ${formData.phone}\nEndereço: ${formData.address}, ${formData.city} - ${formData.state}\nCEP: ${formData.zipCode}\nComplemento: ${formData.complement}\nMétodo de Pagamento: ${formData.paymentMethod}`,
      )
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

      clearCart()
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Erro ao processar o pedido. Por favor, tente novamente.")
    }
  }

  return (
    <div className="checkout">
      <h1>Finalizar Compra</h1>
      <div className="order-summary">
        <h2>Resumo do Pedido</h2>
        {cart.map((item) => (
          <div key={item.id} className="order-item">
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-price">R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="order-total">
          <strong>Total:</strong>
          <strong>R$ {total.toFixed(2)}</strong>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Nome Completo"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Telefone"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Cidade"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="Estado"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Endereço"
          required
        />
        <input
          type="text"
          name="complement"
          value={formData.complement}
          onChange={handleInputChange}
          placeholder="Complemento"
        />
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          placeholder="CEP"
          required
        />
        <div className="payment-options">
          <h3>Forma de Pagamento:</h3>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Credito"
              checked={formData.paymentMethod === "Credito"}
              onChange={handleInputChange}
            />
            Cartão de Crédito
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Debito"
              checked={formData.paymentMethod === "Debito"}
              onChange={handleInputChange}
            />
            Cartão de Débito
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Pix"
              checked={formData.paymentMethod === "Pix"}
              onChange={handleInputChange}
            />
            PIX
          </label>
        </div>
        <button type="submit" className="submit-button">
          Finalizar Pedido
        </button>
      </form>
    </div>
  )
}

export default Checkout

