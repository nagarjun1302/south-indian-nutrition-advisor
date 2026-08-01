import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  User,
  Heart,
  HeartPulse,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { DISH_PRESETS, HEALTH_GOALS_LIST } from '../data/presets';
import { analyzeMeal, generateMockAnalysis } from '../services/api';

export const MealAnalyzerForm = ({
  backendOk,
  onAnalysisComplete,
  userProfile,
}) => {
  const [userName, setUserName] = useState(userProfile?.name || 'User');
  const [mealTime, setMealTime] = useState('breakfast');
  const [userEmail, setUserEmail] = useState(userProfile?.email || '');
  const [healthGoals, setHealthGoals] = useState(
    userProfile?.healthGoals || ['Type 2 Diabetes Control', 'Weight Loss & Fat Loss']
  );

  const [foodItems, setFoodItems] = useState([
    { id: '1', name: 'Masala Dosa with Potato Masala', quantity: '1 piece', emoji: '🥞' },
    { id: '2', name: 'Steamed Idli with Sambar', quantity: '2 pieces idli + 1 cup sambar', emoji: '⚪' },
    { id: '3', name: 'Coconut Chutney', quantity: '2 tbsp', emoji: '🥥' },
  ]);

  const [customDishName, setCustomDishName] = useState('');
  const [customQuantity, setCustomQuantity] = useState('1 serving');

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPresetDish = (preset) => {
    const newItem = {
      id: Date.now().toString(),
      name: preset.name,
      quantity: preset.quantity,
      emoji: preset.emoji,
    };
    setFoodItems([...foodItems, newItem]);
  };

  const handleAddCustomDish = (e) => {
    e.preventDefault();
    if (!customDishName.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: customDishName.trim(),
      quantity: customQuantity.trim() || '1 serving',
      emoji: '🍛',
    };
    setFoodItems([...foodItems, newItem]);
    setCustomDishName('');
    setCustomQuantity('1 serving');
  };

  const handleRemoveDish = (id) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const toggleGoal = (goal) => {
    if (healthGoals.includes(goal)) {
      setHealthGoals(healthGoals.filter((g) => g !== goal));
    } else {
      setHealthGoals([...healthGoals, goal]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (foodItems.length === 0) {
      setErrorMsg('Please add at least one South Indian food item to evaluate.');
      return;
    }

    const payload = {
      patient_id: 'USER-' + Math.floor(1000 + Math.random() * 9000),
      patient_name: userName || 'User Profile',
      meal_time: mealTime,
      food_items: foodItems.map((item) => ({ name: item.name, quantity: item.quantity })),
      medical_conditions: healthGoals,
      patient_email: userEmail.trim() || undefined,
    };

    setLoading(true);
    setLoadingStage('Analyzing ingredients & nutritional balance...');

    try {
      let result;
      if (!backendOk) {
        await new Promise((res) => setTimeout(res, 1200));
        setLoadingStage('Calculating glycemic load & macro breakdown...');
        await new Promise((res) => setTimeout(res, 800));
        setLoadingStage('Formulating recommendations & healthy swaps...');
        await new Promise((res) => setTimeout(res, 600));

        result = generateMockAnalysis(payload);
      } else {
        result = await analyzeMeal(payload);
      }

      onAnalysisComplete(result, payload);
    } catch (err) {
      console.error(err);
      setErrorMsg(`Analysis failed: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPresets = DISH_PRESETS.filter(
    (p) => p.mealTime === mealTime || mealTime === 'snack'
  );

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-orange" style={{ marginBottom: '6px' }}>
              <HeartPulse size={12} /> MEAL EVALUATION
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Log & Evaluate Your Meal</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Select dishes, portion sizes, and your health goals to receive instant personalized insights.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'var(--accent-red-light)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: 'var(--accent-red)',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Step 1: Meal Time & User Details */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <User size={20} color="var(--accent-orange)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>1. Meal Time & Profile Details</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Meal Time Category
              </label>
              <select
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                style={{ cursor: 'pointer' }}
              >
                <option value="breakfast">🌅 Breakfast (காலை உணவு)</option>
                <option value="lunch">☀️ Lunch (மதிய உணவு)</option>
                <option value="dinner">🌙 Dinner (இரவு உணவு)</option>
                <option value="snack">☕ Evening Snack / Tea</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> Email (Optional Report Copy)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Personal Health Goals */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Heart size={20} color="var(--accent-red)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>2. My Health Goals & Focus</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Select health focus areas so recommendations can be tailored to your goals.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {HEALTH_GOALS_LIST.map((goal) => {
              const selected = healthGoals.includes(goal);
              return (
                <button
                  type="button"
                  key={goal}
                  className={`chip ${selected ? 'selected' : ''}`}
                  onClick={() => toggleGoal(goal)}
                >
                  {selected ? '✓ ' : '+ '} {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Consumed Food Items & Presets */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Utensils size={20} color="var(--accent-green)" />
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>3. Consumed Dishes & Portion Sizes</h3>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-orange)', fontWeight: '700' }}>
              {foodItems.length} dish(es) added
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚡ 1-Click Popular Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {filteredPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleAddPresetDish(preset)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title={`~${preset.caloriesApprox} kcal | GI: ${preset.giRating}`}
                >
                  <span>{preset.emoji}</span>
                  <span>{preset.name}</span>
                  <Plus size={13} color="var(--accent-orange)" />
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              background: '#f8fafc',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
            }}
          >
            <input
              type="text"
              value={customDishName}
              onChange={(e) => setCustomDishName(e.target.value)}
              placeholder="Type custom dish (e.g. Oats Upma, Chettinad Egg Curry...)"
              style={{ flex: 2 }}
            />
            <input
              type="text"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              placeholder="Serving (e.g. 1 bowl, 2 pieces)"
              style={{ flex: 1 }}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddCustomDish}>
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {foodItems.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '13px' }}>
                No dishes added yet. Click presets above or add custom dishes.
              </div>
            ) : (
              foodItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>{item.emoji || '🍛'}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Portion: {item.quantity}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDish(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '6px',
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={16} color="var(--accent-red)" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || foodItems.length === 0}
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          >
            {loading ? (
              <>
                <div className="animate-spin">⚡</div>
                <span>{loadingStage}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Analyze Meal & Get Insights</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
