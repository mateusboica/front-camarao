import { useEffect, useMemo, useState } from "react";
import produtoService, { type Product } from "../api/produtoService";

type CategoryId = string;

type MenuItem = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  price: number;
  image: string;
  tag?: string;
};

type Cart = Record<string, number>;

const fallbackImage =
  "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=500&q=80";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const normalizeCategory = (category?: string | null) =>
  (category || "Outros").trim() || "Outros";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const isProductAvailable = (product: Product) =>
  product.isDisponivel ?? product.disponivel ?? true;

const mapProductToMenuItem = (product: Product): MenuItem => ({
  id: product.id,
  name: product.nome,
  category: normalizeCategory(product.categoria),
  description: product.descricao || "Produto disponivel para pedido.",
  price: product.preco,
  image: product.img || fallbackImage,
  tag: product.tags?.[0],
});

const App = () => {
  const [cart, setCart] = useState<Cart>({});
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        setProductsError("");

        const products = await produtoService.list();
        const availableProducts = products.filter(isProductAvailable);

        if (isMounted) {
          setMenuItems(availableProducts.map(mapProductToMenuItem));
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        if (isMounted) {
          setProductsError("Nao foi possivel carregar os produtos da API.");
          setMenuItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(menuItems.map((item) => item.category))
    );

    return uniqueCategories.map((category) => ({
      id: category,
      label: category,
    }));
  }, [menuItems]);

  const orderItems = useMemo(
    () =>
      menuItems
        .map((item) => ({ ...item, quantity: cart[item.id] ?? 0 }))
        .filter((item) => item.quantity > 0),
    [cart, menuItems]
  );

  const visibleItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return menuItems.filter((item) => {
      return (
        normalizedSearch.length === 0 ||
        `${item.name} ${item.description}`.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [menuItems, search]);

  const visibleCategories = categories
    .map((category) => ({
      ...category,
      items: visibleItems.filter((item) => item.category === category.id),
    }))
    .filter((category) => category.items.length > 0);

  const itemsCount = orderItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? 7.9 : 0;
  const serviceFee = subtotal > 0 ? 1.99 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  const updateQuantity = (id: string, change: number) => {
    setCart((current) => {
      const quantity = Math.max((current[id] ?? 0) + change, 0);
      const next = { ...current };

      if (quantity === 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  };

  const getCategoryCount = (category: CategoryId) =>
    menuItems.filter((item) => item.category === category).length;

  return (
    <div className="app">
      <header className="site-header">
        <nav className="top-nav">
          <a href="#cardapio" className="brand">
            <span className="brand-mark">DP</span>
            <span>Delicia Potiguar</span>
          </a>

          <div className="desktop-nav">
            <a className="nav-active" href="#cardapio">
              Inicio
            </a>
            <a href="#pedido">Pedidos</a>
            <button className="login-button">Fazer login</button>
          </div>

          <a href="#pedido" className="mobile-bag-link">
            Sacola {itemsCount > 0 ? `(${itemsCount})` : ""}
          </a>
        </nav>
      </header>

      <main className="page-shell">
        <section className="restaurant-card">
          <div className="cover">
            <img
              src="https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=80"
              alt="Mesa com pratos de frutos do mar"
            />
            <div className="cover-overlay" />
          </div>

          <div className="restaurant-content">
            <div className="restaurant-main">
              <div className="restaurant-logo">DP</div>
              <div className="restaurant-info">
                <div className="restaurant-title-row">
                  <h1>Delicia Potiguar</h1>
                  <span className="status-badge">Aberto</span>
                </div>
                <p>Camarao, frutos do mar e cozinha nordestina</p>
                <div className="restaurant-meta">
                  <span>4,8 avaliacao</span>
                  <span>35-50 min</span>
                  <span>Pedido minimo R$ 25,00</span>
                </div>
              </div>
            </div>

            <div className="delivery-box">
              <p>Calcular taxa de entrega</p>
              <div className="delivery-form">
                <input placeholder="Digite seu CEP" />
                <button>Calcular</button>
              </div>
              <button className="plain-action">Mais informacoes</button>
            </div>
          </div>
        </section>

        <div className="ordering-layout">
          <aside className="category-sidebar">
            <div className="panel-heading">
              <p>Categorias</p>
            </div>
            <nav className="category-list">
              {categories.map((category) => (
                <a key={category.id} href={`#${slugify(category.id)}`}>
                  <span>{category.label}</span>
                  <span>{getCategoryCount(category.id)}</span>
                </a>
              ))}
            </nav>
          </aside>

          <section id="cardapio" className="menu-column">
            <div className="menu-toolbar">
              <div className="mobile-category-row">
                {categories.map((category) => (
                  <a key={category.id} href={`#${slugify(category.id)}`}>
                    {category.label}
                  </a>
                ))}
              </div>

              <div className="menu-toolbar-inner">
                <div>
                  <h2>Cardapio</h2>
                  <p>{visibleItems.length} itens disponiveis</p>
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar no cardapio"
                />
              </div>
            </div>

            <div className="menu-sections">
              {visibleCategories.map((category) => (
                <section
                  key={category.id}
                  id={slugify(category.id)}
                  className="menu-section"
                >
                  <div className="section-heading">
                    <h3>{category.label}</h3>
                    <p>{category.items.length} itens nesta categoria</p>
                  </div>

                  {category.items.map((item) => {
                    const quantity = cart[item.id] ?? 0;

                    return (
                      <article key={item.id} className="product-card">
                        <div className="product-info">
                          <div className="product-title-row">
                            <h4>{item.name}</h4>
                            {item.tag ? <span className="item-tag">{item.tag}</span> : null}
                          </div>

                          <p className="product-description">{item.description}</p>

                          <div className="price-row">
                            <strong>{formatCurrency(item.price)}</strong>
                          </div>
                        </div>

                        <div className="product-actions">
                          <img src={item.image} alt={item.name} />

                          {quantity === 0 ? (
                            <button
                              className="add-button"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              Adicionar
                            </button>
                          ) : (
                            <div className="quantity-control product-quantity">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                aria-label={`Remover ${item.name}`}
                              >
                                -
                              </button>
                              <span>{quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                aria-label={`Adicionar ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>
              ))}

              {isLoadingProducts ? (
                <div className="empty-search">
                  <p>Carregando produtos...</p>
                  <span>Buscando o cardapio atualizado da API.</span>
                </div>
              ) : null}

              {productsError ? (
                <div className="empty-search error-state">
                  <p>{productsError}</p>
                  <span>Confira se a API esta online e se a URL base esta configurada.</span>
                </div>
              ) : null}

              {!isLoadingProducts && !productsError && visibleCategories.length === 0 ? (
                <div className="empty-search">
                  <p>Nenhum item encontrado.</p>
                  <span>Tente buscar por outro nome ou ingrediente.</span>
                </div>
              ) : null}
            </div>
          </section>

          <aside id="pedido" className="cart-panel">
            <div className="panel-heading cart-heading">
              <h2>Sua sacola</h2>
            </div>

            {orderItems.length === 0 ? (
              <div className="empty-cart">
                <p>Sacola vazia</p>
                <span>Adicione itens do cardapio para iniciar seu pedido.</span>
              </div>
            ) : (
              <div className="cart-items">
                {orderItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span className="cart-item-quantity">{item.quantity}x</span>
                    <div>
                      <p>{item.name}</p>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                    <div className="quantity-control cart-quantity">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label={`Remover ${item.name}`}
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label={`Adicionar ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="cart-summary">
              <button className="coupon-button">
                <span>Tem um cupom?</span>
                Clique e insira o codigo
              </button>

              <div className="summary-lines">
                <div>
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div>
                  <span>Taxa de entrega</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <div>
                  <span>Taxa de servico</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button className="checkout-button" disabled={orderItems.length === 0}>
                Finalizar pedido
              </button>
            </div>
          </aside>
        </div>
      </main>

      <a href="#pedido" className="floating-cart">
        <span>{itemsCount > 0 ? `${itemsCount} item(ns) na sacola` : "Sua sacola"}</span>
        <span>{formatCurrency(total)}</span>
      </a>
    </div>
  );
};

export default App;
