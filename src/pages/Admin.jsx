import React, { useState, useEffect } from "react"
import { addProduct, getProducts, updateProduct, deleteProduct } from "../services/productService"
import { getOrders, updateOrderStatus, deleteOrder } from "../services/orderService"
import { login, logout } from "../services/authService"
import { auth, db } from "../Firebase/firebaseConfig"
import { collection, onSnapshot } from "firebase/firestore"
import { FaSearch } from "react-icons/fa"
import "./Admin.css"

const Admin = () => {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orders, setOrders] = useState([])
  const [newOrders, setNewOrders] = useState(0)
  const [showProducts, setShowProducts] = useState(true)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [orderSearchTerm, setOrderSearchTerm] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      if (user) {
        fetchProducts()
        fetchOrders()
        subscribeToNewOrders()
      } else {
        setProducts([])
        setOrders([])
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const productsData = await getProducts()
      setProducts(productsData)
      setError(null)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const subscribeToNewOrders = () => {
    const ordersRef = collection(db, "orders")
    onSnapshot(ordersRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setNewOrders((prev) => prev + 1)
        }
      })
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError("You must be logged in to add a product.")
      return
    }
    try {
      await addProduct(newProduct, imageFile)
      setNewProduct({ name: "", price: "", image: "" })
      setImageFile(null)
      fetchProducts()
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      setError("Erro ao adicionar produto.")
    }
  }

  const handleToggleFeatured = async (productId, featured) => {
    if (!user) {
      setError("You must be logged in to update a product.")
      return
    }
    try {
      await updateProduct(productId, { featured: !featured })
      fetchProducts()
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      setError("Erro ao atualizar produto.")
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!user) {
      setError("You must be logged in to delete a product.")
      return
    }
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId)
        fetchProducts()
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        setError("Erro ao excluir produto.")
      }
    }
  }

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      if (newStatus === "completed") {
        await deleteOrder(orderId)
      } else {
        await updateOrderStatus(orderId, newStatus)
      }
      fetchOrders()
      setNewOrders((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error updating order status:", error)
      setError("Erro ao atualizar o status do pedido.")
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  const filteredOrders = orders.filter((order) => {
    const searchTerm = orderSearchTerm.toLowerCase()
    return (
      (order.fullName && order.fullName.toLowerCase().includes(searchTerm)) ||
      (order.phone && order.phone.toLowerCase().includes(searchTerm)) ||
      (order.id && order.id.toLowerCase().includes(searchTerm))
    )
  })

  if (!user) {
    return (
      <div className="admin">
        <h1>Login de Administrador</h1>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    )
  }

  return (
    <div className="admin">
      <h1>Painel de Administração</h1>
      <p>Logado como: {user.email}</p>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {newOrders > 0 && <div className="new-orders-notification">Você tem {newOrders} novo(s) pedido(s)!</div>}

      <div className="admin-nav">
        <button onClick={() => setShowProducts(true)} className={showProducts ? "active" : ""}>
          Gerenciar Produtos
        </button>
        <button onClick={() => setShowProducts(false)} className={!showProducts ? "active" : ""}>
          Gerenciar Pedidos
        </button>
      </div>

      {showProducts ? (
        <>
          <h2>Adicionar Novo Produto</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Nome do produto"
              required
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Preço"
              step="0.01"
              required
            />
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            <button type="submit">Adicionar Produto</button>
          </form>

          <h2>Gerenciar Produtos</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          {loading && <p>Carregando produtos...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <div className="product-list">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <img src={product.image || "/placeholder.svg"} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>R$ {Number.parseFloat(product.price).toFixed(2)}</p>
                  <button onClick={() => handleToggleFeatured(product.id, product.featured)}>
                    {product.featured ? "Remover Destaque" : "Destacar"}
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Gerenciar Pedidos</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="orders-container">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-item">
                <h3>Pedido #{order.id}</h3>
                <p>
                  <strong>Cliente:</strong> {order.fullName}
                </p>
                <p>
                  <strong>Telefone:</strong> {order.phone}
                </p>
                <p>
                  <strong>Endereço:</strong> {order.address}
                </p>
                <p>
                  <strong>Cidade:</strong> {order.city}
                </p>
                <p>
                  <strong>Estado:</strong> {order.state}
                </p>
                <p>
                  <strong>CEP:</strong> {order.zipCode}
                </p>
                <p>
                  <strong>Complemento:</strong> {order.complement}
                </p>
                <p>
                  <strong>Método de Pagamento:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Total:</strong> R$ {order.total.toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <div className="order-items">
                  <h4>Itens do Pedido:</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name} - R$ {(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleOrderStatusUpdate(order.id, "completed")}
                  className={order.status === "completed" ? "completed" : ""}
                >
                  {order.status === "completed" ? "Concluído" : "Marcar como Concluído"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Admin

