import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/produto/:slug" element={<ProductDetails />} />
                <Route path="*" element={<NotFound />} />
                
            </Routes>
        </Router>
    );
}