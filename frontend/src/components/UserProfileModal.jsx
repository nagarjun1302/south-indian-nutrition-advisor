import React, { useState } from 'react';
import { User, Heart, Shield, Save, Check } from 'lucide-react';
import { HEALTH_GOALS_LIST, DIETARY_PREFERENCES } from '../data/presets';

export const UserProfileModal = ({ userProfile, onSaveProfile }) => {
  const [name, setName] = useState(userProfile?.name || 'Rajesh Kumar');
  const [email, setEmail] = useState(userProfile?.email || 'rajesh@example.com');
  const [age, setAge] = useState(userProfile?.age || '34');
  const [gender, setGender] = useState(userProfile?.gender || 'male');
  const [targetWeight, setTargetWeight] = useState(userProfile?.targetWeight || '70');
  const [dietPref, setDietPref] = useState(userProfile?.dietPref || 'Vegetarian (Pure Veg)');
  const [healthGoals, setHealthGoals] = useState(
    userProfile?.healthGoals || ['Type 2 Diabetes Control', 'Weight Loss & Fat Loss']
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleGoal = (goal) => {
    if (healthGoals.includes(goal)) {
      setHealthGoals(healthGoals.filter((g) => g !== goal));
    } else {
      setHealthGoals([...healthGoals, goal]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProfile({
      name,
      email,
      age,
      gender,
      targetWeight,
      dietPref,
      healthGoals,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>My Health & Profile Settings</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Manage your personal health goals, dietary preferences, and target benchmarks.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Details */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <User size={20} color="var(--accent-orange)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Personal Information</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age in years"
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Dietary Preference
              </label>
              <select value={dietPref} onChange={(e) => setDietPref(e.target.value)}>
                {DIETARY_PREFERENCES.map((pref) => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Health Goals */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Heart size={20} color="var(--accent-red)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>My Primary Health Goals</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Select all goals that apply so Gemini AI can customize recommendations.
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

        {/* Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {savedSuccess && (
            <span style={{ fontSize: '13px', color: 'var(--accent-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Profile settings saved successfully!
            </span>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            <Save size={16} /> Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
};
