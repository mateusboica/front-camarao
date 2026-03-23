const Hero = () => {
    return (
  <section className="relative h-[716px] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img
        className="w-full h-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuSVDrYr-NQI-pAHpIj-QyS2Z4b7Ss90nm0QUINpSwQmMHl5Drj2YPLTyoQyx2OAWFxyBFCVMi8oh7trQ4tkzHNgkCjAw95rE0JqGtZYfZg4dl5g0PWWub8W67gRHLjc74k6rCZ5aTU3HDqb-xznH8kyGdKM8oosTEEsYYJhIWoZobZJjBhnu8BpQ5RCXacOMsEV_oQkvRIlTNEh9Uk4LNSeQXNR1oZaGW45p3vVaUN8RPCniwxQu2PpOvi-Yj0t7XfRf672-LEZM"
        alt="Succulent garlic butter shrimp garnished with herbs"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#fdf9f4] via-[#fdf9f4]/40 to-transparent" />
    </div>
    <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
      <div className="max-w-2xl bg-white/90 backdrop-blur-md p-10 rounded-lg shadow-xl">
        <span className="inline-block px-4 py-1 rounded-full bg-[#c0e9d6] text-[#456a5b] text-xs font-semibold tracking-wider mb-6">
          CAMARÃO FRESCO
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-stone-800 mb-6 leading-tight">
          Pratos especiais com <span className="italic text-[#9d3d2c]">Camarão</span>
        </h1>
        <p className="text-lg text-stone-500 mb-8 leading-relaxed">
          Pratos individuais preparados com ingredientes frescos e técnicas culinárias que realçam o sabor do camarão, proporcionando uma experiência gastronômica única e memorável.
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-gradient-to-br from-[#9d3d2c] to-[#bd5541] text-white font-bold tracking-wide shadow-lg hover:-translate-y-0.5 transition-all">
            Faça seu pedido
          </button>
          <button className="px-8 py-3 rounded-full bg-[#e6e2dd] text-[#9d3d2c] font-bold tracking-wide hover:bg-[#ddd9d5] transition-all">
            Nossa história
          </button>
        </div>
      </div>
    </div>
  </section>
    )
};

export default Hero;