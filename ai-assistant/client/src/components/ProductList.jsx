import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSearch, FaTimes, FaCheck } from 'react-icons/fa';

export default function ProductList({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts]);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditedProduct({...product});
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`/api/products/${id}`, editedProduct);
      setProducts(products.map(p => p._id === id ? editedProduct : p));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="product-list-container">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          {searchTerm ? 'No products match your search' : 'No products found'}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              {editingId === product._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
                  />
                  <textarea
                    value={editedProduct.description}
                    onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={() => handleSave(product._id)}
                      className="save-btn"
                    >
                      <FaCheck /> Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="cancel-btn"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="edit-btn"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="delete-btn"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="product-description">
                    {product.description?.substring(0, 150)}...
                  </p>
                  <div className="product-meta">
                    <span className="product-link">
                      <a href={product.link} target="_blank" rel="noopener noreferrer">
                        View Product
                      </a>
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
