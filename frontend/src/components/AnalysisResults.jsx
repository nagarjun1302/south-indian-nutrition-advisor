import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Wheat,
  Activity,
  FileText,
  Heart,
} from 'lucide-react';

export const AnalysisResults = ({
  result,
  requestData,
  onBackToForm,
  onNewAnalysis,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('summary');

  const {
    patient_name,
    meal_time,
    nutritional_breakdown = {},
    detailed_recommendations = [],
    ingredient_modifications = {},
    final_report = '',
    positive_notes = [],
    general_tips = [],
  } = result;

  const calories = nutritional_breakdown?.calories || 0;
  const carbs = nutritional_breakdown?.carbs || 0;
  const protein = nutritional_breakdown?.protein || 0;
  const fat = nutritional_breakdown?.fat || 0;
  const fiber = nutritional_breakdown?.fiber || 0;
  const sodium = nutritional_breakdown?.sodium || 0;

  const targetCal = meal_time === 'breakfast' ? 450 : meal_time === 'lunch' ? 650 : 500;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(final_report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ padding: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn btn-secondary btn-sm" onClick={onBackToForm}>
          <ArrowLeft size={16} /> Edit Dishes
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={handleCopyReport}>
            {copied ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button className="btn btn-outline btn-sm" onClick={handlePrint}>
            <Printer size={14} /> Print / Export PDF
          </button>
          <button className="btn btn-primary btn-sm" onClick={onNewAnalysis}>
            <Sparkles size={14} /> Log Another Meal
          </button>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
          borderColor: 'var(--accent-orange-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-orange" style={{ marginBottom: '8px' }}>
              <CheckCircle2 size={12} /> Analysis Complete
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
              Meal Evaluation for {patient_name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>Meal: <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{meal_time}</strong></span>
              <span>•</span>
              <span>Dishes: <strong style={{ color: 'var(--text-main)' }}>{requestData.food_items?.length || 0} items</strong></span>
              <span>•</span>
              <span>Goals: <strong style={{ color: 'var(--accent-orange)' }}>{requestData.medical_conditions?.join(', ') || 'General Health'}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeSubTab === 'summary' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => setActiveSubTab('summary')}
        >
          <Activity size={15} /> Macros & Smart Swaps
        </button>
        <button
          className={`btn ${activeSubTab === 'report' ? 'btn-primary' : 'btn-ghost'} btn-sm`}
          onClick={() => setActiveSubTab('report')}
        >
          <FileText size={15} /> Detailed Summary
        </button>
      </div>

      {activeSubTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Calories
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-orange)' }}>
                {calories} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>kcal</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Target ~{targetCal} kcal
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Carbs
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-blue)' }}>
                {carbs} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>g</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                GI Impact
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Protein
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-green)' }}>
                {protein} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>g</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Pulses & Lentils
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Total Fat
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#f59e0b' }}>
                {fat} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>g</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px' }}>
                Coconut & Oil
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Fiber
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-purple)' }}>
                {fiber} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>g</span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent-green)', marginTop: '4px' }}>
                {fiber >= 6 ? '✓ High Fiber' : 'Needs boost'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Sodium
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: sodium > 600 ? 'var(--accent-red)' : 'var(--text-main)' }}>
                {sodium} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>mg</span>
              </div>
              <div style={{ fontSize: '10px', color: sodium > 600 ? 'var(--accent-red)' : 'var(--text-dim)', marginTop: '4px' }}>
                {sodium > 600 ? '⚠️ High' : 'Normal'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={18} color="var(--accent-orange)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Personalized Health Recommendations</h3>
              </div>

              {detailed_recommendations.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No warnings detected for this meal.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {detailed_recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                        fontSize: '13px',
                        color: 'var(--text-main)',
                        lineHeight: 1.5,
                        display: 'flex',
                        gap: '10px',
                      }}
                    >
                      <AlertTriangle size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>{rec}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Wheat size={18} color="var(--accent-green)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Smart Ingredient Swaps</h3>
              </div>

              {Object.keys(ingredient_modifications).length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No modifications suggested.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(ingredient_modifications).map(([dish, mod]) => (
                    <div
                      key={dish}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-orange)', marginBottom: '4px' }}>
                        {dish}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600', marginBottom: '2px' }}>
                        🔄 Swap: {typeof mod === 'string' ? mod : mod.swap || mod.recommendation}
                      </div>
                      {mod.reason && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          💡 Why: {mod.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {positive_notes.length > 0 && (
              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Healthy Choices in Your Meal
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {positive_notes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {general_tips.length > 0 && (
              <div className="glass-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={16} /> Post-Meal Wellness Tips
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {general_tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'report' && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Comprehensive Nutrition Summary</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generated by AI Nutritionist</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleCopyReport}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>
          </div>

          <div
            className="markdown-body"
            style={{
              background: '#f8fafc',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap',
              fontSize: '13px',
              lineHeight: 1.7,
              color: 'var(--text-main)',
            }}
          >
            {final_report}
          </div>
        </div>
      )}
    </div>
  );
};
