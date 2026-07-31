import React, { useState } from 'react';
import { Search, Wheat } from 'lucide-react';
import { INGREDIENT_DATABASE } from '../data/presets';

export const IngredientKnowledge = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Grains & Millets', 'Lentils & Pulses', 'Spices', 'Oils & Fats', 'Vegetables'];

  const filteredIngredients = INGREDIENT_DATABASE.filter((ing) => {
    const matchesSearch =
      ing.name.toLowerCase().includes(search.toLowerCase()) ||
      (ing.tamilName && ing.tamilName.includes(search));
    const matchesCategory = selectedCategory === 'All' || ing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <div className="badge badge-green" style={{ marginBottom: '6px' }}>
          <Wheat size={12} /> SOUTH INDIAN NUTRITIONAL DATABASE
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>South Indian Ingredient & Glycemic Hub</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Discover glycemic index (GI) ratings, nutritional benefits, and healthy millet substitutes for traditional dishes.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ingredient (e.g. Ragi, Rice, Coconut, Toor dal...)"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip ${selectedCategory === cat ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '20px' }}>
        {filteredIngredients.map((item) => (
          <div key={item.name} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</h3>
                  {item.tamilName && (
                    <span style={{ fontSize: '12px', color: 'var(--accent-orange)', fontWeight: '600' }}>
                      {item.tamilName}
                    </span>
                  )}
                </div>
                <span
                  className={`badge ${
                    item.giCategory === 'Low'
                      ? 'badge-green'
                      : item.giCategory === 'Medium'
                      ? 'badge-blue'
                      : 'badge-red'
                  }`}
                >
                  GI: {item.giIndex} ({item.giCategory})
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                Category: {item.category}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  HEALTH BENEFITS:
                </div>
                <ul style={{ paddingLeft: '16px', fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {item.healthBenefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>

            {item.healthyAlternatives && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  fontSize: '11px',
                  color: 'var(--accent-green)',
                }}
              >
                🔄 Recommended Swaps: {item.healthyAlternatives.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
