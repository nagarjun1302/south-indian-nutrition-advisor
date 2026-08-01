import React from 'react';
import { Sparkles, LogIn, User } from 'lucide-react';

export const Navbar = ({
  activeTab,
  onNewAnalysis,
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'My Nutrition Dashboard';
      case 'analyzer':
        return 'Log South Indian Meal';
      case 'history':
        return 'My Meal Log History';
      case 'ingredients':
        return 'South Indian Ingredient & GI Hub';
      case 'profile':
        return 'My Health Profile';
      default:
        return 'NutriWise South';
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>{getTabTitle()}</h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Personalized AI nutrition guidance for your daily South Indian meals
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Log Meal Button */}
        <button className="btn btn-primary btn-sm" onClick={onNewAnalysis}>
          <Sparkles size={14} />
          <span>+ Log Meal</span>
        </button>

        {/* User Account / Auth Action */}
        {user ? (
          <button className="btn btn-secondary btn-sm" onClick={onOpenProfile}>
            <User size={14} />
            <span>{user.name}</span>
          </button>
        ) : (
          <button className="btn btn-secondary btn-sm" onClick={onOpenAuth}>
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
