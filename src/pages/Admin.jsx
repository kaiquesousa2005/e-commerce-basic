import React, { useState, useEffect } from "react"
import { addProduct, getProducts, updateProduct, deleteProduct } from "../services/productService"
import { login, logout } from "../services/authService"
import { auth } from "../Firebase/firebaseConfig"
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      if (user) {
        fetchProducts()
      } else {
        setProducts([])
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

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      alert("Erro ao fazer login. Verifique suas credenciais.")
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
      alert("You must be logged in to add a product.")
      return
    }
    try {
      await addProduct(newProduct, imageFile)
      alert("Produto adicionado com sucesso!")
      setNewProduct({ name: "", price: "", image: "" })
      setImageFile(null)
      fetchProducts()
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      alert("Erro ao adicionar produto.")
    }
  }

  const handleToggleFeatured = async (productId, featured) => {
    if (!user) {
      alert("You must be logged in to update a product.")
      return
    }
    try {
      await updateProduct(productId, { featured: !featured })
      fetchProducts()
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      alert("Erro ao atualizar produto.")
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!user) {
      alert("You must be logged in to delete a product.")
      return
    }
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId)
        fetchProducts()
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        alert("Erro ao excluir produto.")
      }
    }
  }

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
      {loading && <p>Carregando produtos...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="product-list">
          {products.map((product) => (
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
    </div>
  )
}

export default Admin

