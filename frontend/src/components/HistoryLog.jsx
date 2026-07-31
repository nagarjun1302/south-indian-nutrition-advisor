import React, { useState } from 'react';
import { History, Search, Trash2, ExternalLink, Calendar, Filter } from 'lucide-react';

export const HistoryLog = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [mealFilter, setMealFilter] = useState('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      (item.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.food_items || []).some((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMeal = mealFilter === 'all' || (item.meal_time || '').toLowerCase() === mealFilter.toLowerCase();

    return matchesSearch && matchesMeal;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>My Meal Log History</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Search and view details of your past analyzed South Indian meals
          </p>
        </div>

        {history.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={onClearHistory} style={{ color: 'var(--accent-red)' }}>
            <Trash2 size={14} /> Clear Log History
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by dish name or meal..."
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color="var(--text-dim)" />
          <select
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="all">All Meal Times</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      {/* Log Items */}
      {filteredHistory.length === 0 ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
          }}
        >
          <History size={44} color="var(--text-dim)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '6px' }}>No meal logs found</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {history.length === 0 ? 'Log your daily meals to build your personal nutrition log.' : 'Try adjusting your search query or filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
              }}
              onClick={() => onSelectHistoryItem(item)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--accent-orange-light)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '20px',
                  }}
                >
                  🥞
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                      {item.meal_time}
                    </span>
                    <span className="badge badge-orange">
                      {item.food_items?.length || 0} dish(es)
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {(item.food_items || []).map((f) => `${f.name} (${f.quantity})`).join(', ')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-orange)' }}>
                    {item.nutritional_breakdown?.calories || 0} kcal
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {item.created_at || 'Today'}
                  </div>
                </div>

                <div style={{ padding: '8px', borderRadius: '10px', background: '#f8fafc' }}>
                  <ExternalLink size={16} color="var(--accent-orange)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
