import React from "react"
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa"
import "./footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Firmino's Cabeleleiros</h3>
          <p>Produtos Capilares, Pomadas, Shampoo e Condicionador</p>
        </div>
        <div className="footer-section">
          <h3>Contato</h3>
          <p>Telefone: +55(85)987594526</p>
          <p>Email: contato@firminocabeleleiros.com</p>
        </div>
        <div className="footer-section">
          <h3>Redes Sociais</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com/paulo.firmino.9469" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/firminoscabeleireirosunidade3/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5585987594526&text=Ola%2C+vim+pelo+Google%21&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 Firmino's Cabeleleiros. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer

