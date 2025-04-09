import { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Affiliate Marketing Assistant</h1>
        <nav>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => {
              setActiveTab('products');
              setShowForm(false);
            }}
          >
            Product Management
          </button>
          <button 
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'products' && (
          <>
            {showForm ? (
              <ProductForm 
                products={products} 
                setProducts={setProducts}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <>
                <div className="list-header">
                  <h2>Your Products</h2>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="add-product-btn"
                  >
                    Add New Product
                  </button>
                </div>
                <ProductList products={products} setProducts={setProducts} />
              </>
            )}
          </>
        )}
        {activeTab === 'analytics' && (
          <div className="analytics-container">
            <h2>Performance Analytics</h2>
            {/* Analytics content will go here */}
          </div>
        )}
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
