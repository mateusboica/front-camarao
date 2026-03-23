import React from "react";

const Navbar = () => {
    return (
  <header className="w-full top-0 sticky z-50 bg-[#fdf9f4] shadow-[0_20px_40px_rgba(86,66,62,0.06)]">
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-[#9d3d2c] font-serif italic">
        Delícia Potiguar
      </div>
      <div className="hidden md:flex items-center space-x-8">
        {[ "Cardapio", "Sobre nós", "Contato"].map((link) => (
          <a
            key={link}
            href="#"
            className={`font-serif text-lg tracking-tight transition-colors duration-300 ${
              link === "Cardapio"
                ? "text-[#9d3d2c] border-b-2 border-[#9d3d2c] pb-1 font-bold"
                : "text-stone-600 hover:text-[#9d3d2c] font-medium"
            }`}
          >
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#9d3d2c] p-2 hover:opacity-80 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
            />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f1ede8]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3jLvT8B6xzHVgLsFQYzaRwRpfyNHufP6lV9Ip9Uk1-Qg4KviYwKebs4e8gqE34Pbgp1anlUppXGcPszjjnfbcvOHism7o65rVwE9yliW7yYWBl1OLDxkPvORH02D0De_CuQFwYcBgsThKIjRsy4lqPfE1NLVqpDHgB-gbl4hD0-NKIds6bWpAvJR2dgmZITWRxE4V4gFfgc0osqVco2n93NHE9amQdyoxHVST4bmVK6QoXvyRuOs8SFjkec_PxgmDPj5MH5h-GvE"
            alt="User profile"
          />
        </div>
      </div>
    </nav>
    <div className="bg-[#f1ede8] h-px w-full opacity-50" />
  </header>
    );
};

export default Navbar;