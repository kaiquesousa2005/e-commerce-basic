import React, { useRef, useState } from "react"
import { FaArrowRight, FaSearch } from "react-icons/fa"
import useProducts from "../hooks/useProducts"
import { useCart } from "../context/CartContext"
import "./Home.css"

const Home = () => {
  const allProductsRef = useRef(null)
  const { products, loading, error } = useProducts()
  const { addToCart } = useCart()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])

  const scrollToAllProducts = () => {
    allProductsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSearch = () => {
    const filtered = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredProducts(filtered)
  }

  const renderProductCard = (product) => (
    <div key={product.id} className="productCard">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>R$ {Number.parseFloat(product.price).toFixed(2)}</p>
      <button className="addToCart" onClick={() => addToCart(product)}>
        Adicionar ao Carrinho
      </button>
    </div>
  )

  const featuredProducts = products.filter((product) => product.featured)
  const displayProducts = searchTerm ? filteredProducts : products

  return (
    <div className="home">
      <section className="banner">
        <h1>Firmino's Cabeleleiros</h1>
        <p>Produtos Capilares, Pomadas, Shampoo e Condicionador</p>
        <button onClick={scrollToAllProducts} className="cta">
          Ver todos os produtos <FaArrowRight />
        </button>
      </section>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">
          <FaSearch />
        </button>
      </div>

      {loading && <p className="loading">Carregando produtos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && displayProducts.length > 0 && (
        <>
          {featuredProducts.length > 0 && !searchTerm && (
            <section className="featuredProducts">
              <h2>Produtos em Destaque</h2>
              <div className="productGrid">{featuredProducts.map(renderProductCard)}</div>
            </section>
          )}

          <section className="allProducts" ref={allProductsRef}>
            <h2>{searchTerm ? "Resultados da Busca" : "Todos os Produtos"}</h2>
            <div className="productGrid">{displayProducts.map(renderProductCard)}</div>
          </section>
        </>
      )}

      {!loading && !error && displayProducts.length === 0 && <p className="no-products">Nenhum produto encontrado.</p>}
    </div>
  )
}

export default Home

