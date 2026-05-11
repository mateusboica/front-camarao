import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import CheckoutPedido from '../pages/CheckoutPedido';
import Contato from '../pages/Contato';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/checkout/:pedidoId" element={<CheckoutPedido />} />
                
            </Routes>
        </Router>
    );
}