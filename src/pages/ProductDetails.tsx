import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProdutoService from '../api/produtoService';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { slug } = useParams();
  const {produto, setProduto} = useState(null);
   
  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setLoading(true);
        const response = await ProdutoService.buscarPorSlug(slug);
      
        setProduto(response.data);
      } catch (err) {
        console.error("Erro ao buscar produto pelo slug:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }; 
  

  return (
    <>
    <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-8 pb-32">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-12">
          <div className="relative aspect-square overflow-hidden rounded-2xl shadow-sm">
            <img 
              alt="Moqueca de Camarão Tradicional" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1534080564607-c92754227a3f?auto=format&fit=crop&q=80&w=800"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <nav className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                Menu / Moquecas
              </nav>
              <h1 className="font-headline text-4xl md:text-5xl text-on-surface font-bold leading-tight">
                Moqueca de Camarão Tradicional
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">${basePrice.toFixed(2)}</span>
              <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="ml-1 text-sm font-bold">4.8</span>
                <span className="ml-1 text-xs text-on-surface-variant font-medium">(48 avaliações)</span>
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-base">
              Um clássico atemporal da nossa cozinha. Camarões frescos selecionados, cozidos lentamente em leite de coco artesanal, azeite de dendê legítimo e um refogado secreto de ervas frescas.
            </p>
          </div>
        </section>

        <div className="max-w-3xl space-y-8">
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg">Escolha o Acompanhamento</h3>
              <p className="text-xs text-gray-500 mt-0.5">Selecione 1 opção</p>
            </div>
            <div className="bg-white">
              {['Arroz Branco', 'Farofa de Dendê'].map((item) => (
                <label key={item} className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                  <span className="font-semibold">{item}</span>
                  <input 
                    type="radio" 
                    name="acompanhamento"
                    checked={sideDish === item}
                    onChange={() => setSideDish(item)}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg">Preferências do Preparo</h3>
              <p className="text-xs text-gray-500 mt-0.5">Opcional</p>
            </div>
            <div className="bg-white">
              <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 border-b border-gray-50">
                <span className="font-semibold">Pimenta Extra</span>
                <input 
                  type="checkbox" 
                  checked={preferences.pimentaExtra}
                  onChange={(e) => setPreferences({...preferences, pimentaExtra: e.target.checked})}
                  className="rounded w-5 h-5 text-primary focus:ring-primary border-gray-300" 
                />
              </label>
              <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                <span className="font-semibold">Sem Coentro</span>
                <input 
                  type="checkbox" 
                  checked={preferences.semCoentro}
                  onChange={(e) => setPreferences({...preferences, semCoentro: e.target.checked})}
                  className="rounded w-5 h-5 text-primary focus:ring-primary border-gray-300" 
                />
              </label>
            </div>
          </section>
          <section className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg">Adicionais</h3>
              <p className="text-xs text-gray-500 mt-0.5">Deixe seu prato ainda melhor</p>
            </div>
            <div className="bg-white">
              <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 border-b border-gray-50">
                <div>
                  <p className="font-semibold">Porção Extra de Camarão</p>
                  <p className="text-sm font-bold text-primary mt-0.5">+${extraCamaraoPrice.toFixed(2)}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={extras.extraCamarao}
                  onChange={(e) => setExtras({...extras, extraCamarao: e.target.checked})}
                  className="rounded w-5 h-5 text-primary focus:ring-primary border-gray-300" 
                />
              </label>
              <label className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-semibold">Cesta de Pães</p>
                  <p className="text-sm font-bold text-primary mt-0.5">+${cestaPaesPrice.toFixed(2)}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={extras.cestaPaes}
                  onChange={(e) => setExtras({...extras, cestaPaes: e.target.checked})}
                  className="rounded w-5 h-5 text-primary focus:ring-primary border-gray-300" 
                />
              </label>
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="font-bold text-lg">Alguma observação?</h3>
            <textarea 
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full rounded-xl border-gray-200 bg-white focus:ring-primary focus:border-primary text-sm p-4 min-h-[100px] placeholder:text-gray-400" 
              placeholder="Ex: Tirar cebola, ponto da carne, etc."
            ></textarea>
          </section>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4 px-6 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1">
            <button onClick={() => handleQuantity('dec')} className="w-10 h-10 flex items-center justify-center text-primary font-bold hover:bg-white transition-colors rounded-lg">-</button>
            <span className="font-bold w-10 text-center text-lg">{quantity}</span>
            <button onClick={() => handleQuantity('inc')} className="w-10 h-10 flex items-center justify-center text-primary font-bold hover:bg-white transition-colors rounded-lg">+</button>
          </div>
          
          <div className="flex items-center space-x-6 w-full md:w-auto">
            <div className="text-right flex-grow md:flex-grow-0">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-primary">${calculateTotal()}</p>
            </div>
            <button className="flex-grow md:flex-initial bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group">
              <span>Adicionar</span>
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetails;