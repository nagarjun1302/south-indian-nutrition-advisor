import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  History,
  BookOpen,
  User,
  Sparkles,
  Zap,
  Crown,
  LogOut,
  LogIn,
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Meal Logger', icon: Utensils, badge: 'AI' },
    { id: 'history', label: 'Meal History', icon: History },
    { id: 'ingredients', label: 'Ingredient Hub', icon: BookOpen },
    { id: 'profile', label: 'My Health Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo Header */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
            }}
          >
            <Zap size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
              NutriSense
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-orange)', fontWeight: '700', letterSpacing: '0.5px' }}>
              SOUTH INDIAN AI NUTRITION
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px 8px' }}>
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--accent-orange-light)' : 'transparent',
                color: isActive ? 'var(--accent-orange)' : 'var(--text-muted)',
                fontWeight: isActive ? '700' : '500',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                width: '100%',
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-orange)' : 'var(--text-muted)'} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    background: 'var(--accent-orange)',
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '6px',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upgrade SaaS Pro Banner */}
      <div style={{ padding: '0 16px 16px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,146,60,0.12))',
            border: '1px solid var(--accent-orange-border)',
            borderRadius: '14px',
            padding: '14px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '800', color: 'var(--accent-orange)', marginBottom: '4px' }}>
            <Crown size={15} /> NutriSense Pro
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>
            Get unlimited AI meal evaluations & personalized meal plans.
          </p>
          <button className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '11px', padding: '6px 10px' }}>
            <Sparkles size={12} /> Upgrade Plan
          </button>
        </div>
      </div>

      {/* Account Profile Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onOpenProfile}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {user ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>
                {user ? user.name : 'Guest User'}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent-orange)', fontWeight: '600' }}>
                {user ? 'Pro Member' : 'Free Trial'}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            title={user ? 'Sign Out' : 'Sign In'}
          >
            {user ? <LogOut size={16} /> : <LogIn size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};
