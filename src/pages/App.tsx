import { useEffect, useMemo, useState } from "react";
import lojaService, { defaultStoreInfo, type StoreInfo } from "../api/lojaService";
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

type ProductDraft = {
  item: MenuItem;
  quantity: number;
  observation: string;
  removedIngredients: string[];
};

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

const getWhatsappHref = (value?: string | null) => {
  const phone = value?.replace(/\D/g, "");

  return phone ? `https://wa.me/${phone}` : "";
};

const getInstagramHref = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (value.startsWith("http")) {
    return value;
  }

  return `https://instagram.com/${value.replace("@", "")}`;
};

const getIngredientSuggestions = (item: MenuItem) => {
  const source = item.description || item.name;
  const blockedWords = new Set([
    "com",
    "sem",
    "para",
    "por",
    "uma",
    "que",
    "produto",
    "disponivel",
    "pedido",
    "acompanha",
    "especial",
  ]);

  const ingredients = source
    .split(/[,.;+]/)
    .flatMap((part) => part.split(/\se\s/i))
    .map((part) => part.trim())
    .filter((part) => part.length > 2)
    .filter((part) => !blockedWords.has(part.toLowerCase()));

  return Array.from(new Set(ingredients)).slice(0, 6);
};

const ProductCardSkeleton = ({ index }: { index: number }) => (
  <article className="product-card skeleton-product-card" aria-hidden="true">
    <div className="skeleton-product-info">
      <div className="skeleton skeleton-line skeleton-title" />
      <div className="skeleton skeleton-line skeleton-description" />
      <div className="skeleton skeleton-line skeleton-description skeleton-description-short" />
      <div className="skeleton skeleton-line skeleton-price" />
    </div>

    <div className="skeleton-product-actions">
      <div className="skeleton skeleton-image" />
      <div
        className={
          index % 2 === 0
            ? "skeleton skeleton-button"
            : "skeleton skeleton-button skeleton-button-short"
        }
      />
    </div>
  </article>
);

const CategoryListSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <div className="skeleton-category-link" key={index} aria-hidden="true">
        <div className="skeleton skeleton-category-name" />
        <div className="skeleton skeleton-category-count" />
      </div>
    ))}
  </>
);

const MobileCategorySkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        className={
          index === 0
            ? "skeleton skeleton-mobile-category skeleton-mobile-category-wide"
            : "skeleton skeleton-mobile-category"
        }
        key={index}
        aria-hidden="true"
      />
    ))}
  </>
);

const App = () => {
  const [cart, setCart] = useState<Cart>(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart") || "{}") : {});
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo);
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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

  useEffect(() => {
    let isMounted = true;

    const loadStoreInfo = async () => {
      try {
        const store = await lojaService.get();

        if (isMounted) {
          setStoreInfo(store);
        }
      } catch (error) {
        console.error("Erro ao carregar informacoes da loja:", error);

        if (isMounted) {
          setStoreInfo(defaultStoreInfo);
        }
      }
    };

    loadStoreInfo();

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

  const visibleCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: visibleItems.filter((item) => item.category === category.id),
        }))
        .filter((category) => category.items.length > 0),
    [categories, visibleItems]
  );

  useEffect(() => {
    if (visibleCategories.length === 0) {
      setActiveCategoryId("");
      return;
    }

    setActiveCategoryId((current) =>
      visibleCategories.some((category) => category.id === current)
        ? current
        : visibleCategories[0].id
    );
  }, [visibleCategories]);

  useEffect(() => {
    if (visibleCategories.length === 0) {
      return;
    }

    const updateActiveCategory = () => {
      const currentSection = visibleCategories.reduce<{
        id: CategoryId;
        top: number;
      } | null>((current, category) => {
        const section = document.getElementById(slugify(category.id));

        if (!section) {
          return current;
        }

        const top = section.getBoundingClientRect().top;

        if (top > 170) {
          return current;
        }

        if (!current || top > current.top) {
          return { id: category.id, top };
        }

        return current;
      }, null);

      if (currentSection) {
        setActiveCategoryId(currentSection.id);
      }
    };

    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    window.addEventListener("resize", updateActiveCategory);

    return () => {
      window.removeEventListener("scroll", updateActiveCategory);
      window.removeEventListener("resize", updateActiveCategory);
    };
  }, [visibleCategories]);

  const itemsCount = orderItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 0 ? storeInfo.taxaEntrega : 0;
  const serviceFee = subtotal > 0 ? storeInfo.taxaServico : 0;
  const total = subtotal + deliveryFee + serviceFee;
  const canOrder = storeInfo.aberto;
  const minimumRemaining = Math.max(storeInfo.pedidoMinimo - subtotal, 0);
  const hasReachedMinimum = subtotal >= storeInfo.pedidoMinimo;
  const closedMessage = storeInfo.statusDetalhe || "Pedidos indisponiveis no momento";
  const checkoutDisabled = orderItems.length === 0 || !canOrder || !hasReachedMinimum;
  const checkoutLabel = !canOrder
    ? "Loja fechada"
    : !hasReachedMinimum && orderItems.length > 0
      ? `Faltam ${formatCurrency(minimumRemaining)}`
      : "Finalizar pedido";

  const updateQuantity = (id: string, change: number) => {
    if (!canOrder && change > 0) {
      return;
    }

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

  const openProductDraft = (item: MenuItem) => {
    if (!canOrder) {
      return;
    }

    setProductDraft({
      item,
      quantity: 1,
      observation: "",
      removedIngredients: [],
    });
  };

  const closeProductDraft = () => {
    setProductDraft(null);
  };

  const toggleRemovedIngredient = (ingredient: string) => {
    setProductDraft((current) => {
      if (!current) {
        return current;
      }

      const isRemoved = current.removedIngredients.includes(ingredient);

      return {
        ...current,
        removedIngredients: isRemoved
          ? current.removedIngredients.filter((item) => item !== ingredient)
          : [...current.removedIngredients, ingredient],
      };
    });
  };

  const updateDraftObservation = (observation: string) => {
    setProductDraft((current) => (current ? { ...current, observation } : current));
  };

  const updateDraftQuantity = (change: number) => {
    setProductDraft((current) =>
      current ? { ...current, quantity: Math.max(current.quantity + change, 1) } : current,
    );
  };

  const addDraftToCart = () => {
    if (!productDraft) {
      return;
    }

    updateQuantity(productDraft.item.id, productDraft.quantity);
    closeProductDraft();
  };

  const getCategoryCount = (category: CategoryId) =>
    menuItems.filter((item) => item.category === category).length;

  const handleCategoryClick = (category: CategoryId) => {
    setActiveCategoryId(category);
  };

  const contactItems = [
    storeInfo.whatsapp
      ? {
          label: "WhatsApp",
          value: storeInfo.whatsapp,
          href: getWhatsappHref(storeInfo.whatsapp),
        }
      : null,
    storeInfo.telefone
      ? {
          label: "Telefone",
          value: storeInfo.telefone,
          href: `tel:${storeInfo.telefone.replace(/\s/g, "")}`,
        }
      : null,
    storeInfo.email
      ? {
          label: "Email",
          value: storeInfo.email,
          href: `mailto:${storeInfo.email}`,
        }
      : null,
    storeInfo.instagram
      ? {
          label: "Instagram",
          value: storeInfo.instagram,
          href: getInstagramHref(storeInfo.instagram),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; href: string }>;

  const handleFinalizarPedido = () => {


  };

  return (
    <div className="app">
      <header className="site-header">
        <nav className="top-nav">
          <a href="#cardapio" className="brand">
            <span className="brand-mark">{storeInfo.sigla}</span>
            <span>{storeInfo.nome}</span>
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
              src={storeInfo.capa}
              alt={`Capa da loja ${storeInfo.nome}`}
            />
            <div className="cover-overlay" />
          </div>

          <div className="restaurant-content">
            <div className="restaurant-overview">
              <div className="restaurant-main">
                <div className="restaurant-logo">
                  {storeInfo.logo ? (
                    <img src={storeInfo.logo} alt={`Logo da loja ${storeInfo.nome}`} />
                  ) : (
                    storeInfo.sigla
                  )}
                </div>
                <div className="restaurant-info">
                  <div className="restaurant-title-row">
                    <h1>{storeInfo.nome}</h1>
                    <span className={storeInfo.aberto ? "status-badge" : "status-badge closed"}>
                      {storeInfo.aberto ? "Aberto" : "Fechado"}
                    </span>
                    {storeInfo.statusDetalhe ? (
                      <span className="status-detail">{storeInfo.statusDetalhe}</span>
                    ) : null}
                  </div>
                  <p>{storeInfo.descricao}</p>
                  <div className="restaurant-meta">
                    {storeInfo.avaliacao ? (
                      <span>{storeInfo.avaliacao.toFixed(1).replace(".", ",")} avaliacao</span>
                    ) : null}
                    <span>{storeInfo.tempoEntrega}</span>
                    <span>Pedido minimo {formatCurrency(storeInfo.pedidoMinimo)}</span>
                  </div>
                </div>
              </div>

              {!canOrder ? (
                <div className="closed-alert">
                  <strong>Loja fechada para pedidos</strong>
                  <span>{closedMessage}</span>
                </div>
              ) : null}

              <details className="restaurant-details">
                <summary>
                  <span>Informações da loja</span>
                  <strong>{storeInfo.horarioHoje || "Horario nao informado"}</strong>
                </summary>

                <div className="restaurant-detail-grid">
                  <section className="restaurant-detail">
                    <span>Horário</span>
                    <strong>{storeInfo.horarioHoje || "Horário não informado"}</strong>
                    {storeInfo.horarios.length > 0 ? (
                      <div className="schedule-list">
                        {storeInfo.horarios.map((day) => (
                          <div className={day.isHoje ? "today" : undefined} key={day.dia}>
                            <span>{day.label}</span>
                            <span>
                              {day.fechado || !day.abre || !day.fecha
                                ? "Fechado"
                                : `${day.abre} as ${day.fecha}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : storeInfo.horarioResumo ? (
                      <p>{storeInfo.horarioResumo}</p>
                    ) : null}
                  </section>

                  <section className="restaurant-detail">
                    <span>Contato</span>
                    {contactItems.length > 0 ? (
                      <div className="contact-list">
                        {contactItems.map((item) => (
                          <a href={item.href} key={item.label} target="_blank" rel="noreferrer">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <strong>Contato nao informado</strong>
                    )}
                  </section>

                  <section className="restaurant-detail">
                    <span>Endereço</span>
                    <strong>{storeInfo.endereco || "Endereço não informado"}</strong>
                  </section>
                </div>
              </details>
            </div>

            <div className="delivery-box order-info-box">
              <div>
                <p>Pedido</p>
                <span>{canOrder ? "Disponivel agora" : "Indisponivel agora"}</span>
              </div>

              <div className="order-info-lines">
                <div>
                  <span>Entrega</span>
                  <strong>{storeInfo.tempoEntrega}</strong>
                </div>
                <div>
                  <span>Taxa</span>
                  <strong>{formatCurrency(storeInfo.taxaEntrega)}</strong>
                </div>
                <div>
                  <span>Minimo</span>
                  <strong>{formatCurrency(storeInfo.pedidoMinimo)}</strong>
                </div>
              </div>

              <a className="plain-action" href="#cardapio">
                Ver cardapio
              </a>
            </div>
          </div>
        </section>

        <div className="ordering-layout">
          <aside className="category-sidebar">
            <div className="panel-heading">
              <p>Categorias</p>
            </div>
            <nav className="category-list">
              {isLoadingProducts ? (
                <CategoryListSkeleton />
              ) : (
                categories.map((category) => (
                  <a
                    key={category.id}
                    href={`#${slugify(category.id)}`}
                    className={activeCategoryId === category.id ? "active" : undefined}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <span>{category.label}</span>
                    <span>{getCategoryCount(category.id)}</span>
                  </a>
                ))
              )}
            </nav>
          </aside>

          <section id="cardapio" className="menu-column">
            <div className="menu-toolbar">
              <div className="mobile-category-row">
                {isLoadingProducts ? (
                  <MobileCategorySkeleton />
                ) : (
                  categories.map((category) => (
                    <a
                      key={category.id}
                      href={`#${slugify(category.id)}`}
                      className={activeCategoryId === category.id ? "active" : undefined}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.label}
                    </a>
                  ))
                )}
              </div>

              <div className="menu-toolbar-inner">
                <div>
                  <h2>Cardapio</h2>
                  <p>
                    {visibleItems.length} itens disponiveis
                    {!canOrder ? " - pedidos pausados" : ""}
                  </p>
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
                      <article
                        key={item.id}
                        className={canOrder ? "product-card" : "product-card disabled"}
                      >
                        <div className="product-info">
                          <div className="product-title-row">
                            <h4>{item.name}</h4>
                            {item.tag ? <span className="item-tag">{item.tag}</span> : null}
                            {!canOrder ? <span className="item-tag disabled">Loja fechada</span> : null}
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
                              onClick={() => openProductDraft(item)}
                              disabled={!canOrder}
                            >
                              {canOrder ? "Adicionar" : "Indisponivel"}
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
                                disabled={!canOrder}
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

              {isLoadingProducts
                ? Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} index={index} />
                  ))
                : null}

              {productsError ? (
                <div className="empty-search error-state">
                  <p>{productsError}</p>
                  <span>Erro interno</span>
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
              {!canOrder ? <span>Pedidos pausados</span> : null}
            </div>

            {orderItems.length === 0 ? (
              <div className="empty-cart">
                <p>Sacola vazia</p>
                <span>
                  {canOrder
                    ? "Adicione itens do cardapio para iniciar seu pedido."
                    : "A loja esta fechada. Voce podera pedir no proximo horario de funcionamento."}
                </span>
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
                        disabled={!canOrder}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="cart-summary">
              {!canOrder ? (
                <div className="cart-closed-message">
                  <strong>Pedido indisponivel</strong>
                  <span>{closedMessage}</span>
                </div>
              ) : null}

              {canOrder && orderItems.length > 0 && !hasReachedMinimum ? (
                <div className="minimum-order-message">
                  <strong>Pedido minimo</strong>
                  <span>Adicione mais {formatCurrency(minimumRemaining)} para finalizar.</span>
                </div>
              ) : null}

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

              <button className="checkout-button" disabled={checkoutDisabled} onClick={handleFinalizarPedido}>
                {checkoutLabel}
              </button>
            </div>
          </aside>
        </div>
      </main>

      <a href="#pedido" className={canOrder ? "floating-cart" : "floating-cart closed"}>
        <span>
          {!canOrder
            ? "Loja fechada"
            : itemsCount > 0
              ? `${itemsCount} item(ns) na sacola`
              : "Sua sacola"}
        </span>
        <span>{formatCurrency(total)}</span>
      </a>

      {productDraft ? (
        <div className="modal-backdrop" role="presentation" onClick={closeProductDraft}>
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close-button"
              onClick={closeProductDraft}
              aria-label="Fechar detalhes do produto"
            >
              ×
            </button>

            <div className="product-modal-media">
              <img src={productDraft.item.image} alt={productDraft.item.name} />
              <div className="product-modal-thumbs" aria-label="Fotos do produto">
                {[productDraft.item.image, productDraft.item.image, productDraft.item.image].map(
                  (image, index) => (
                    <button className={index === 0 ? "active" : undefined} key={index}>
                      <img src={image} alt={`${productDraft.item.name} foto ${index + 1}`} />
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="product-modal-body">
              <div className="product-modal-header">
                <span className="modal-category">{productDraft.item.category}</span>
                <h2 id="product-modal-title">{productDraft.item.name}</h2>
                <p>{productDraft.item.description}</p>
                <div className="product-modal-price-row">
                  <strong>{formatCurrency(productDraft.item.price)}</strong>
                  <span>Por unidade</span>
                </div>
              </div>

              <div className="customization-section">
                <div className="customization-heading">
                  <div>
                    <h3>Remover ingredientes</h3>
                    <p>Marque o que voce nao quer no pedido.</p>
                  </div>
                  <span>Opcional</span>
                </div>

                <div className="ingredient-list">
                  {getIngredientSuggestions(productDraft.item).length > 0 ? (
                    getIngredientSuggestions(productDraft.item).map((ingredient) => (
                      <label key={ingredient}>
                        <input
                          checked={productDraft.removedIngredients.includes(ingredient)}
                          onChange={() => toggleRemovedIngredient(ingredient)}
                          type="checkbox"
                        />
                        <span>{ingredient}</span>
                      </label>
                    ))
                  ) : (
                    <p>Ingredientes ainda nao cadastrados para este item.</p>
                  )}
                </div>
              </div>

              <div className="customization-section">
                <div className="customization-heading">
                  <div>
                    <h3>Observação</h3>
                    <p>Use para ponto, molho separado ou outras preferencias.</p>
                  </div>
                  <span>Opcional</span>
                </div>
                <textarea
                  value={productDraft.observation}
                  onChange={(event) => updateDraftObservation(event.target.value)}
                  maxLength={180}
                  placeholder="Ex: sem cebola, ponto do camarao, molho separado..."
                />
                <small>{productDraft.observation.length}/180</small>
              </div>

              <div className="product-modal-footer">
                <div className="modal-quantity-control" aria-label="Quantidade">
                  <button
                    onClick={() => updateDraftQuantity(-1)}
                    disabled={productDraft.quantity === 1}
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span>{productDraft.quantity}</span>
                  <button
                    onClick={() => updateDraftQuantity(1)}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                <button className="modal-primary-button" onClick={addDraftToCart}>
                  Adicionar {formatCurrency(productDraft.item.price * productDraft.quantity)}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default App;
