import { useState } from 'react';
import axios from 'axios';

export default function ProductForm({ products, setProducts }) {
  const [product, setProduct] = useState({
    name: '',
    link: '',
    images: []
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await axios.post('/api/products', product);
      setGeneratedContent(response.data);
      setProducts([...products, response.data]);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/products/save', generatedContent);
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            required
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label>Affiliate Link</label>
          <input
            type="url"
            value={product.link}
            onChange={(e) => setProduct({...product, link: e.target.value})}
            required
            placeholder="https://example.com/product"
          />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setProduct({...product, images: [...e.target.files]})}
          />
        </div>

        <button type="submit" disabled={isGenerating} className="generate-btn">
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </form>

      {generatedContent && (
        <div className="generated-content">
          <div className="content-tabs">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'seo' ? 'active' : ''}
              onClick={() => setActiveTab('seo')}
            >
              SEO Meta
            </button>
            <button 
              className={activeTab === 'proscons' ? 'active' : ''}
              onClick={() => setActiveTab('proscons')}
            >
              Pros & Cons
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div>
                <h3>Product Description</h3>
                <p>{generatedContent.description}</p>
              </div>
            )}
            {activeTab === 'seo' && (
              <div>
                <h3>SEO Metadata</h3>
                <pre>{generatedContent.seoMeta}</pre>
              </div>
            )}
            {activeTab === 'proscons' && (
              <div>
                <h3>Pros & Cons</h3>
                <pre>{generatedContent.prosCons}</pre>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={handleSave} className="save-btn">
              Save Product
            </button>
            <button 
              onClick={() => navigator.clipboard.writeText(generatedContent.description)}
              className="copy-btn"
            >
              Copy Description
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
