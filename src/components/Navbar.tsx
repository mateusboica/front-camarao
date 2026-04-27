const Navbar = () => {
  return (
    <header className="legacy-navbar">
      <nav className="legacy-navbar-inner">
        <div className="legacy-navbar-brand">Delicia Potiguar</div>
        <div className="legacy-navbar-links">
          {["Cardapio", "Sobre nos", "Contato"].map((link) => (
            <a
              key={link}
              href="#"
              className={link === "Cardapio" ? "active" : undefined}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="legacy-navbar-actions">
          <button aria-label="Abrir sacola">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          <div className="legacy-avatar">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3jLvT8B6xzHVgLsFQYzaRwRpfyNHufP6lV9Ip9Uk1-Qg4KviYwKebs4e8gqE34Pbgp1anlUppXGcPszjjnfbcvOHism7o65rVwE9yliW7yYWBl1OLDxkPvORH02D0De_CuQFwYcBgsThKIjRsy4lqPfE1NLVqpDHgB-gbl4hD0-NKIds6bWpAvJR2dgmZITWRxE4V4gFfgc0osqVco2n93NHE9amQdyoxHVST4bmVK6QoXvyRuOs8SFjkec_PxgmDPj5MH5h-GvE"
              alt="Perfil"
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
