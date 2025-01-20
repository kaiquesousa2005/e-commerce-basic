import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Logo from "../imagens/firmino-logo.jpg";
import "./header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={Logo} alt="Firmino's Logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="https://agendeonline.salonsoft.com.br/firminosunidade3" className="nav-link">
            Agendamento
          </Link>
          <Link to="https://api.whatsapp.com/send/?phone=5585987594526&text=Ola%2C+vim+pelo+Google%21&type=phone_number&app_absent=0" className="nav-link">
            Contato
          </Link>
          <Link to="https://www.google.com.br/maps/place/Firminos+Cabeleireiros+-+Unidade+3+%7C+Sal%C3%A3o+de+beleza+no+conjunto+cear%C3%A1+e+Barbearia/@-3.7740691,-38.6060222,19z/data=!3m1!4b1!4m14!1m7!3m6!1s0x7c74d5baf5bece3:0x32980bf2adacefde!2sFirminos+Cabeleireiros+-+Unidade+3+%7C+Sal%C3%A3o+de+beleza+no+conjunto+cear%C3%A1+e+Barbearia!8m2!3d-3.7740704!4d-38.6053785!16s%2Fg%2F11y3hry8tg!3m5!1s0x7c74d5baf5bece3:0x32980bf2adacefde!8m2!3d-3.7740704!4d-38.6053785!16s%2Fg%2F11y3hry8tg?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D" className="nav-link">
            Localização
          </Link>
        </nav>

        {/* Desktop Icons */}
        <div className="desktop-icons">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartItemsCount > 0 && (
              <span className="cart-count">{cartItemsCount}</span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="mobile-nav">
          <Link
            to="https://agendeonline.salonsoft.com.br/firminosunidade3"
            className="nav-link"
            onClick={toggleMenu}
          >
            Agendamento
          </Link>
          <Link
            to="https://api.whatsapp.com/send/?phone=5585987594526&text=Ola%2C+vim+pelo+Google%21&type=phone_number&app_absent=0"
            className="nav-link"
            onClick={toggleMenu}
          >
            Contato
          </Link>
          <Link
            to="https://www.google.com.br/maps/place/Firminos+Cabeleireiros+-+Unidade+3+%7C+Sal%C3%A3o+de+beleza+no+conjunto+cear%C3%A1+e+Barbearia/@-3.7740691,-38.6060222,19z/data=!4m14!1m7!3m6!1s0x7c74d5baf5bece3:0x32980bf2adacefde!2sFirminos+Cabeleireiros+-+Unidade+3+%7C+Sal%C3%A3o+de+beleza+no+conjunto+cear%C3%A1+e+Barbearia!8m2!3d-3.7740704!4d-38.6053785!16s%2Fg%2F11y3hry8tg!3m5!1s0x7c74d5baf5bece3:0x32980bf2adacefde!8m2!3d-3.7740704!4d-38.6053785!16s%2Fg%2F11y3hry8tg?entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D"
            className="nav-link"
            onClick={toggleMenu}
          >
            Localização
          </Link>
          <div className="mobile-icons">
            <Link to="/cart" className="cart-icon" onClick={toggleMenu}>
              <FaShoppingCart />
              {cartItemsCount > 0 && (
                <span className="cart-count">{cartItemsCount}</span>
              )}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
