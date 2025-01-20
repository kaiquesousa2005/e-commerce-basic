import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { FaShoppingCart } from "react-icons/fa"
import "./Cart.css"

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity)
    }
  }

  return (
    <div className="cart">
      <h1>Carrinho de Compras</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <FaShoppingCart className="empty-cart-icon" />
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="continue-shopping">
            Continuar Comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>R$ {Number.parseFloat(item.price).toFixed(2)}</p>
                  <div className="quantity-control">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>Remover</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Total: R$ {Number.parseFloat(total).toFixed(2)}</h2>
            <div className="customer-info">
              <input type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
              <input
                type="tel"
                placeholder="Telefone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <Link
              to="/checkout"
              className={`checkout-button ${!name || !phone ? "disabled" : ""}`}
              onClick={(e) => {
                if (!name || !phone) {
                  e.preventDefault()
                  alert("Por favor, preencha seu nome e telefone antes de prosseguir.")
                }
              }}
            >
              Finalizar Compra
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart

