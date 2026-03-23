import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuCardapio from "./components/MenuCardapio";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
  badge?: { label: string; variant: "signature" | "spicy" };
}

interface PastaItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
}

interface SideItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const classicItems: MenuItem[] = [
  {
    id: 1,
    name: "Traditional Shrimp Moqueca",
    description:
      "Slow-cooked in a handmade clay pot with coconut milk, palm oil, and fresh cilantro bouquet.",
    price: "$32",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhb5ei7Gi9avveporAle0REiquWxE9YhMljXkrfjuiPohJGH8aklMGHh8GuxYeqgqrYz0JAPii3dY90_tXHgHMCYYeEDvxu8CNbc3epSfMOOffIGiqchDqih-sxAR4s2kp8MEz3Kc2FhFlJqQwtySXr5KgDuy_zegufpmVo-Zj2VeSLFnsHQa05aj0cShK3wDqrq2jPRblt8WN4fVsINmQNcRLa1tS4diTHPam1UN4v0equl4Kb4TeNZQtVoZjNbZAtfpwuba3kAA",
    imageAlt: "Traditional shrimp moqueca with coconut milk and peppers",
    badge: { label: "Signature", variant: "signature" },
  },
  {
    id: 2,
    name: "Garlic Herb Seared Scampi",
    description:
      "Jumbo shrimp sautéed with roasted garlic, shallots, and a reduction of premium white wine.",
    price: "$28",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzE9oTGs3xYoh3AVz67sjsYP3M0qOxc47yIlBULCV1p60kt3q48Bq8vbz9cuJB5Pk2-g0T2YOslwL_vm7MQsO4ylA4mpmd80FkwEf6cT6u4ELZjloi9L3K4UVMtYgGI4k0klVkpQQ0XZ0sLsqtJsmvCuwA2vPV2MpUwGIU1UmJvGu_osaTSOTK1GuagoSDUEIQJ3mRAawn8kpKFT--dmXu6RRpuVEX7MXAXk_xUkkfo16Ng7EnJZJZcuZXu-ZUNoP2djK6flXQwJnE",
    imageAlt: "Plate of large grilled shrimp with garlic and lemon",
  },
  {
    id: 3,
    name: "Rustic Creole Shrimp",
    description:
      "Bold Cajun spices meet tender shrimp, served over a bed of heritage grain dirty rice.",
    price: "$26",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCG9pvs1CBK5h2s8NA_QzpwkHw3f2pftYuxCAWygksYs_jd0lTG8bpCLNEljYBLlSSostBxjJK4mARdvcfVoxDCErQgpsOUqUBK5TFoIIjaQgGHEYEeH8Lt6d8XnyGxw36lXEYA-aRyjoDr6e-Z-0lkneCzDeqXNj6RUEYQMjDl9JlLl7k1lklSR8wHbCadrxSlFwJyt4WnJiKyJBrwTBMDHe3peumraeiR2oH-Boj3eU962DUecb5x7PjGgGP8ByfOFuJxfaQ9kQI",
    imageAlt: "Cajun spiced shrimp on a bed of dirty rice",
    badge: { label: "Spicy", variant: "spicy" },
  },
];

const pastaFeatured = {
  name: "Lemon-Zested Shrimp Linguine",
  description:
    "Artisanal linguine tossed in a silky lemon cream sauce, topped with seared tiger shrimp and fresh microgreens.",
  price: "$34",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcafidmOwZpE3a4QsY9ij_Xqv41YX8mHVa5CE7myh5WxZdjGk9ykaxAbezQV0xtFB8z9nDbsVrse7NGG3li6XdacXFPBnmKFLFufkK6N6D8U1rp5hPeP1Ndo-JeD0UnPKqOYApLYYyXWHtua8pj2D8Jyyo5pP238doj5asFZKL8p5mJtU_qfekq7bfCffmkzwfb42ZLRQTqyvEErUlKUBTDg4SO_u2A7aMpifZ42GHbAKD1CDYqZG56CWVfaxyFXryfR3sH9YFh0U",
  imageAlt: "Creamy shrimp linguine with lemon zest and parsley",
};

const pastaItems: PastaItem[] = [
  {
    id: 1,
    name: "Fra Diavolo Penne",
    description: "Piquant tomato sauce with red chili flakes and sautéed shrimp.",
    price: "$24",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAq87w2OjMRM0H36fgsEyRGj_CmHCTfyjFFNZ1i-7xLA08QWKNo0gKfuTg99ulqZNYjZrYKsH3G0Hw7uU_q6HAa6WRW7RxpLwb9NOh2GrgkndI72JlI90DQkaxp5ZEzeJ5w168WJ-PLJyMpJf9ruxXL6OpshpWnXmjuoMCb4XDYZntT_KnZV8WK5orvuG_jAj8rWTnM1ZIIAJpfScyXO8t9HKWK0dulL_dzHuE7DP2gWu5NmbCsOaNnSV16jbfCyBlTdT214yc-zwM",
    imageAlt: "Spicy tomato sauce shrimp penne",
  },
  {
    id: 2,
    name: "Basil Pesto Farfalle",
    description: "House-made pesto, roasted pine nuts, and delicate rock shrimp.",
    price: "$26",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQALNj9fpmdzmaJtgBtsxSnuwf-Gqbuu_1VSXfRRHpkqHYZk_MPiyswGqd6evA1IEoabjX-TjiOOCLsDn6WUDAtPlQ9KX1WzaJpGkeQlUcZOa90j0itttg8Agk3IsTXzTCK9aLBGzrVuWcd3nHJwlLKfj0vgKj5idVizXgyokygc-AmsohiaRBO7DT-qlUWIWMvlG3q7_p0sy4sXhS98o2UEu7TKp4ndQBhB5T5nSa23hltkSU4rWI8IOUUGlQr7fUrPftZ01ntYc",
    imageAlt: "Creamy pesto shrimp with farfalle",
  },
];

const sideItems: SideItem[] = [
  {
    id: 1,
    name: "Truffle Parm Fries",
    description:
      "Hand-cut potatoes tossed in black truffle oil and 24-month aged parmesan.",
    price: "$12",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgHzbIsEbXwj9xSvrbf4UHJ4d5nKufaL7u-l9K44UFgAXn0ZTVOBCT5G5lXua19HjCHuT9j638LgRfIepg9ow-CZo2rm9dBTUK38AomRTwuV7o6xTrtm7sCv5tXoGNKOdnPG6n2YQiwYQ-csg0olvgwqLa3ITOt7aMMhZmE3vVmLmjILzdUB4R9HzOqE4a8-C8swQq6hxn_gXA86gkpnhxjP-El1uQ5jWkwZRO7xxxl-VIKk5Fl8k_wgvEXjn_fQvK4zczI3Y76SM",
    imageAlt: "Truffle oil parmesan fries",
  },
  {
    id: 2,
    name: "Artisanal Salad",
    description: "Heirloom tomatoes, balsamic glaze, and locally sourced greens.",
    price: "$10",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkM2H1dhowfE6tSoCO4i0NkpPmMPmE2ILuN6uAtcbOp1c1SF4xepTZaM6g_u7DnWAx062T6Ao9quYuBTwTbnqwojnmur3KTvHtnCnqz20nDQMihFEgVbmsisBRy3Njjxt2XOckJ3zffsP0_MEhMelwt_O4sbjHct1EXQ7uFPOHrhQccCZGHnf9iwbrposOGWtxRO43az2rqbjUXXcQ8ErYQ8lMD5Vj0z9qM9Ep0gHLv8Z7GqkefkQk8W1RLqLQMqFqSwC2mFIoMnA",
    imageAlt: "Heirloom tomato salad",
  },
  {
    id: 3,
    name: "Rustic Bread Basket",
    description: "A selection of sourdough and herb focaccia with salted butter.",
    price: "$8",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAziwQWe8KW92ljkx8zxigRyMXYkYr5BAYbFv0RnihwHD_2sETECdffl_XxEQW8RjZ9s1RyDjY-L5nDpBW8i1nWzKhXewYBCu9Q05ezo3wvfWm-LleQfRBAS4FGJpdC3USEQPksCDldIGI0NvDe_CsWVbhYbYqSqBhAAxF6DMqReLOEp140c34_k0wYILLfv2zjlRdbrLDJUkH4rGpopH2OFja6nSXnj6_0PjOkkW6MIkdBpzdunbNqEIAc7_yu7wdaTd4VFfVErCI",
    imageAlt: "Artisanal sourdough bread",
  },
  {
    id: 4,
    name: "Charred Asparagus",
    description: "Lemon-butter glaze with toasted almond slivers.",
    price: "$11",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzMbNlBlyEBTRxQtieTY_PpFDgeIP8am-ReZ8Tio9MsW--pZUtSj50_d47FQhOEQzkHoHULQjcQwhEXq9wAXp1RUiHi-0622_gm6BFn7sr1eXiCb0uWqbGfdudMvPad5ja54S9dLTxx2UTAnWw1JUDeA8HMmWp5AMS44NMp6L3tB_5X_go728FOxlfxRuEIGOkWsTu1ndukhkVDn_QNq_F7Num8oOdUiciXG8iM9WVoIgBDHw7TkYTTfB8lhbCQA439RYIm30CBjA",
    imageAlt: "Roasted seasonal vegetables",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge: React.FC<{ label: string; variant: "signature" | "spicy" }> = ({
  label,
  variant,
}) => {
  const styles =
    variant === "signature"
      ? "bg-[#c0e9d6] text-[#456a5b]"
      : "bg-orange-100 text-orange-800";
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${styles}`}
    >
      {label}
    </span>
  );
};

const ClassicMenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <div className="group">
    <div className="relative overflow-hidden rounded-lg mb-6 bg-[#f1ede8]">
      <img
        className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
        src={item.image}
        alt={item.imageAlt}
      />
      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#9d3d2c]">
        {item.price}
      </div>
    </div>
    {item.badge && (
      <div className="flex items-center gap-2 mb-2">
        <Badge label={item.badge.label} variant={item.badge.variant} />
      </div>
    )}
    <h3 className="font-serif text-2xl text-stone-800 mb-3">{item.name}</h3>
    <p className="text-stone-500 mb-4 text-sm leading-relaxed">{item.description}</p>
    <button className="text-[#9d3d2c] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
      Order Now
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  </div>
);

const SideCard: React.FC<{ item: SideItem }> = ({ item }) => (
  <div className="bg-[#f7f3ee] p-6 rounded-lg hover:bg-[#f1ede8] transition-colors group">
    <img
      className="w-full h-40 object-cover rounded-lg mb-6 grayscale group-hover:grayscale-0 transition-all duration-500"
      src={item.image}
      alt={item.imageAlt}
    />
    <h4 className="font-serif text-lg text-stone-800 mb-2">{item.name}</h4>
    <p className="text-stone-500 text-sm mb-4">{item.description}</p>
    <span className="text-[#9d3d2c] font-bold">{item.price}</span>
  </div>
);

// ─── Section Components ───────────────────────────────────────────────────────



const ClassicSection: React.FC = () => (
  <section className="py-24 max-w-7xl mx-auto px-8" id="classic">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
      <div>
        <h2 className="font-serif text-4xl text-stone-800 mb-2 italic font-bold">
          Classic Shrimp Dishes
        </h2>
        <p className="text-stone-500">Timeless recipes focusing on the pure essence of the sea.</p>
      </div>
      <div className="h-px bg-[#ddc0bb]/30 flex-grow mx-8 hidden md:block" />
      <span className="text-[#9d3d2c] font-bold tracking-widest text-sm">TRADITION</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {classicItems.map((item) => (
        <ClassicMenuCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

const PastaSection: React.FC = () => (
  <section className="py-24 bg-[#f1ede8]" id="pasta">
    <div className="max-w-7xl mx-auto px-8">
      <div className="mb-16">
        <h2 className="font-serif text-4xl text-stone-800 mb-2 italic font-bold">Shrimp Pasta</h2>
        <p className="text-stone-500">House-made noodles paired with the finest ocean harvests.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Featured */}
        <div className="md:col-span-8 bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-sm">
          <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={pastaFeatured.image}
              alt={pastaFeatured.imageAlt}
            />
          </div>
          <div className="p-10 lg:w-1/2 flex flex-col justify-center">
            <span className="text-[#75562c] font-bold text-xs uppercase tracking-widest mb-4">
              Chef's Selection
            </span>
            <h3 className="font-serif text-3xl text-stone-800 mb-4 leading-snug">
              {pastaFeatured.name}
            </h3>
            <p className="text-stone-500 mb-6 leading-relaxed">{pastaFeatured.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#9d3d2c] font-serif">
                {pastaFeatured.price}
              </span>
              <button className="bg-[#9d3d2c] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#bd5541] transition-colors">
                Add to Order
              </button>
            </div>
          </div>
        </div>

        {/* Side Pastas */}
        {pastaItems.map((item) => (
          <div key={item.id} className="md:col-span-4 bg-white rounded-lg p-8 shadow-sm group">
            <img
              className="w-full aspect-square object-cover rounded-lg mb-6"
              src={item.image}
              alt={item.imageAlt}
            />
            <h3 className="font-serif text-xl text-stone-800 mb-2">{item.name}</h3>
            <p className="text-stone-500 text-sm mb-4">{item.description}</p>
            <span className="text-[#9d3d2c] font-bold font-serif">{item.price}</span>
          </div>
        ))}

        {/* Quote */}
        <div className="md:col-span-8 bg-gradient-to-br from-[#416657] to-[#294e40] rounded-lg p-10 flex flex-col justify-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-4 opacity-40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="font-serif text-2xl italic mb-6 leading-relaxed">
            "Every dish tells a story of the tides, hand-picked herbs, and the patience of
            artisanal cooking."
          </p>
          <span className="text-sm font-bold tracking-widest opacity-80 uppercase">
            — Head Chef Marco
          </span>
        </div>
      </div>
    </div>
  </section>
);

const SidesSection: React.FC = () => (
  <section className="py-24 max-w-7xl mx-auto px-8" id="sides">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
      <div>
        <h2 className="font-serif text-4xl text-stone-800 mb-2 italic font-bold">Side Dishes</h2>
        <p className="text-stone-500">The perfect accompaniment to our star ingredient.</p>
      </div>
      <div className="h-px bg-[#ddc0bb]/30 flex-grow mx-8 hidden md:block" />
      <span className="text-[#9d3d2c] font-bold tracking-widest text-sm">ENHANCEMENTS</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {sideItems.map((item) => (
        <SideCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="w-full py-12 px-8 mt-20 bg-[#f1ede8]">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto text-center md:text-left">
      <div>
        <h4 className="font-serif text-xl text-[#9d3d2c] mb-4 italic font-bold">
          The Artisanal Table
        </h4>
        <p className="text-sm text-stone-500 max-w-xs mx-auto md:mx-0">
          Bringing the craft of homemade coastal dining to your digital table. Every bite is a
          memory.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h5 className="font-bold text-stone-700 mb-2">Explore</h5>
        {["Instagram", "Facebook", "Pinterest", "Our Location"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-stone-500 hover:text-[#9d3d2c] transition-colors text-sm"
          >
            {link}
          </a>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h5 className="font-bold text-stone-700 mb-2">Opening Hours</h5>
        <p className="text-stone-500 text-sm">Tue – Thu: 12pm – 10pm</p>
        <p className="text-stone-500 text-sm">Fri – Sat: 12pm – 11pm</p>
        <p className="text-stone-500 text-sm">Sun: 11am – 8pm</p>
        <p className="text-stone-500 text-sm italic mt-2">Closed on Mondays</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-stone-300/30 text-center">
      <p className="text-sm tracking-wide text-stone-500">
        © 2024 The Artisanal Table. Crafted with love.
      </p>
    </div>
  </footer>
);

// ─── Root Component ───────────────────────────────────────────────────────────

const ArtisanalTable: React.FC = () => {
  return (
    <div className="bg-[#fdf9f4] text-stone-800">
      <Navbar />
      <main>
        <Hero />
        <MenuCardapio />
        <ClassicSection />
        <PastaSection />
        <SidesSection />
      </main>
      <Footer />
    </div>
  );
};

export default ArtisanalTable;