const MenuCardapio = () => {
  const links = [
    { label: "Classicos", href: "#classic", active: true },
    { label: "Massas", href: "#pasta", active: false },
    { label: "Acompanhamentos", href: "#sides", active: false },
    { label: "Bebidas", href: "#beverages", active: false },
  ];

  return (
    <div className="legacy-menu-tabs">
      <div className="legacy-menu-tabs-inner">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={link.active ? "legacy-menu-tab active" : "legacy-menu-tab"}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MenuCardapio;
