const Hero = () => {
  return (
    <section className="legacy-hero">
      <div className="legacy-hero-media">
        <img
          className="legacy-hero-image"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuSVDrYr-NQI-pAHpIj-QyS2Z4b7Ss90nm0QUINpSwQmMHl5Drj2YPLTyoQyx2OAWFxyBFCVMi8oh7trQ4tkzHNgkCjAw95rE0JqGtZYfZg4dl5g0PWWub8W67gRHLjc74k6rCZ5aTU3HDqb-xznH8kyGdKM8oosTEEsYYJhIWoZobZJjBhnu8BpQ5RCXacOMsEV_oQkvRIlTNEh9Uk4LNSeQXNR1oZaGW45p3vVaUN8RPCniwxQu2PpOvi-Yj0t7XfRf672-LEZM"
          alt="Prato de camarao com ervas"
        />
        <div className="legacy-hero-overlay" />
      </div>
      <div className="legacy-hero-inner">
        <div className="legacy-hero-card">
          <span className="legacy-pill">CAMARAO FRESCO</span>
          <h1>
            Pratos especiais com <span>Camarao</span>
          </h1>
          <p>
            Pratos individuais preparados com ingredientes frescos e tecnicas
            culinarias que realcam o sabor do camarao.
          </p>
          <div className="legacy-hero-actions">
            <button className="legacy-primary-button">Faca seu pedido</button>
            <button className="legacy-secondary-button">Nossa historia</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
