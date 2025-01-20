import React, { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import useProducts from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import "./Home.css";

const Home = () => {
  const allProductsRef = useRef(null);
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const scrollToAllProducts = () => {
    allProductsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderProductCard = (product) => (
    <div key={product.id} className="productCard">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>R$ {Number.parseFloat(product.price).toFixed(2)}</p>
      <button className="addToCart" onClick={() => addToCart(product)}>
        Adicionar ao Carrinho
      </button>
    </div>
  );

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <div className="home">
      <section className="banner">
        <h1>Firmino's Cabeleleiros</h1>
        <p>Produtos Capilares, Pomadas, Shampoo e Condicionador</p>
        <button onClick={scrollToAllProducts} className="cta">
          Ver todos os produtos <FaArrowRight />
        </button>
      </section>

      {loading && <p className="loading">Carregando produtos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length > 0 && (
        <>
          {featuredProducts.length > 0 && (
            <section className="featuredProducts">
              <h2>Produtos em Destaque</h2>
              <div className="productGrid">
                {featuredProducts.map(renderProductCard)}
              </div>
            </section>
          )}

          <section className="allProducts" ref={allProductsRef}>
            <h2>Todos os Produtos</h2>
            <div className="productGrid">{products.map(renderProductCard)}</div>
          </section>
        </>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="no-products">Nenhum produto disponível no momento.</p>
      )}
    </div>
  );
};

export default Home;
