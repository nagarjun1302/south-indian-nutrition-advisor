import React from 'react';
import {
  Utensils,
  Sparkles,
  Heart,
  History,
  BookOpen,
  ArrowRight,
  Flame,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';

export const DashboardOverview = ({
  onStartAnalysis,
  onNavigateTab,
  history,
  userProfile,
  user,
}) => {
  const recentAnalyses = history.slice(0, 3);
  const totalMealsLogged = history.length;

  const dailyCalorieGoal = 2000;
  const loggedCaloriesToday = history.reduce((sum, item) => sum + (item.nutritional_breakdown?.calories || 0), 0);
  const calPercent = Math.min(100, Math.round((loggedCaloriesToday / dailyCalorieGoal) * 100));

  const displayName = user?.name || (user && userProfile?.name ? userProfile.name : null);

  return (
    <div className="animate-fade-in" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 60%, rgba(249,115,22,0.08) 100%)',
          border: '1px solid var(--accent-orange-border)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '650px', position: 'relative', zIndex: 2 }}>
          <div className="badge badge-orange" style={{ marginBottom: '10px' }}>
            <Sparkles size={12} /> PERSONAL NUTRITION COMPANION
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1.2, marginBottom: '10px', color: 'var(--text-main)' }}>
            {user && displayName ? `Welcome back, ${displayName}! 👋` : 'Welcome to NutriSense! 🥗'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            Track your daily meals, analyze nutritional balance, and discover healthy millet & legume alternatives tailored to your lifestyle goals.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onStartAnalysis}>
              <Utensils size={18} />
              <span>Log Today's Meal</span>
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigateTab('ingredients')}>
              <BookOpen size={18} />
              <span>Explore Ingredients</span>
            </button>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '20px',
            bottom: '-10px',
            opacity: 0.12,
            pointerEvents: 'none',
          }}
        >
          <Zap size={220} color="var(--accent-orange)" />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Daily Calorie Goal Ring */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Daily Calorie Target
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--accent-orange-light)', color: 'var(--accent-orange)' }}>
              <Flame size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-orange)' }}>
            {loggedCaloriesToday} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>/ {dailyCalorieGoal} kcal</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', width: '100%', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ background: 'var(--accent-orange)', height: '100%', width: `${calPercent}%`, borderRadius: '999px', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Meals Logged */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Meals Logged
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
              <Activity size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
            {totalMealsLogged} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>meals</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} /> Active Tracking
          </div>
        </div>

        {/* Health Goal */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Primary Health Focus
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
              <Heart size={16} />
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
            {userProfile?.healthGoals?.[0] || 'Type 2 Diabetes Control'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Customized recommendations
          </div>
        </div>

        {/* Streak */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Current Streak
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}>
              <Sparkles size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--accent-purple)' }}>
            🔥 {user ? '5 Days' : '0 Days'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Log daily to build long-term habits
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Meals + Health Hacks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>My Recent Meals</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Latest logged dishes</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigateTab('history')}>
              <span>View History</span> <ArrowRight size={14} />
            </button>
          </div>

          {recentAnalyses.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
              }}
            >
              <History size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '4px' }}>No meals logged yet</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Log your first breakfast, lunch, or dinner to get personalized nutritional insights!
              </p>
              <button className="btn btn-primary btn-sm" onClick={onStartAnalysis}>
                <Sparkles size={14} /> Log First Meal
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentAnalyses.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'var(--accent-orange-light)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '20px',
                      }}
                    >
                      🥞
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                        {item.meal_time} ({item.food_items.length} item{item.food_items.length > 1 ? 's' : ''})
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {item.food_items.map((f) => f.name).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-orange)' }}>
                      {item.nutritional_breakdown?.calories || 0} kcal
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {item.created_at || 'Today'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Smart South Indian Hacks</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Simple tweaks to lower GI & boost health</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-orange)', marginBottom: '4px' }}>
                🌾 Add 30% Ragi or Thinai to Dosa Batter
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Mixing millets into rice batter increases calcium and dietary fiber while flattening glucose spikes.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '4px' }}>
                🥥 Lighten Up Chutneys
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Blend coconut with roasted chana dal (pottukadalai), coriander, or mint to cut saturated fat in half.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '4px' }}>
                🍵 Post-Meal Moru (Buttermilk)
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                A cup of diluted buttermilk with curry leaves & roasted cumin aids digestion and reduces bloating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
