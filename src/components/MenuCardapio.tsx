const MenuCardapio = () => {
    const links = [
    { label: "Classic Shrimp Dishes", href: "#classic", active: true },
    { label: "Shrimp Pasta", href: "#pasta", active: false },
    { label: "Side Dishes", href: "#sides", active: false },
    { label: "Wine Pairings", href: "#beverages", active: false },
  ];
  return (
    <div className="sticky top-[88px] z-40 bg-[#fdf9f4]/80 backdrop-blur-lg border-b border-[#ddc0bb]/15 py-4">
      <div className="max-w-7xl mx-auto px-8 flex gap-8 overflow-x-auto whitespace-nowrap">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`transition-colors ${
              link.active
                ? "text-[#9d3d2c] font-bold border-b-2 border-[#9d3d2c] pb-1"
                : "text-stone-500 hover:text-[#9d3d2c]"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MenuCardapio;