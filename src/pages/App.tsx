import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MenuCardapio from "../components/MenuCardapio";

interface SideItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  imageAlt: string;
}

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
    <button >a</button>
  </div>
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

const ArtisanalTable: React.FC = () => {
  return (
    <div className="bg-[#fdf9f4] text-stone-800">
      <Navbar />
      <main>
        <Hero />
        <MenuCardapio />
        <SidesSection />
        <SidesSection />
      </main>
      <Footer />
    </div>
  );
};

export default ArtisanalTable;