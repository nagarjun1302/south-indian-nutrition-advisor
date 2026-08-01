let API_BASE_URL = import.meta.env.VITE_API_URL || localStorage.getItem('nutrisense_api_url') || 'http://localhost:8000';

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function setApiBaseUrl(url) {
  API_BASE_URL = url.endsWith('/') ? url.slice(0, -1) : url;
  localStorage.setItem('nutrisense_api_url', API_BASE_URL);
}

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const data = await response.json();
      return { ok: true, message: data.service || 'Connected to FastAPI Backend' };
    }
    return { ok: false, message: `Backend responded with HTTP ${response.status}` };
  } catch (err) {
    return {
      ok: false,
      message: err.name === 'AbortError' ? 'Connection timed out' : 'Backend offline (http://localhost:8000)',
    };
  }
}

export async function analyzeMeal(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMsg = errorText;
      try {
        const jsonErr = JSON.parse(errorText);
        parsedMsg = jsonErr.detail || jsonErr.message || errorText;
      } catch (e) {
        // ignore
      }
      throw new Error(`API Error (${response.status}): ${parsedMsg}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Backend API request failed:', error.message);
    throw error;
  }
}

export function generateMockAnalysis(payload) {
  const totalCalories = payload.food_items.length * 270 + Math.floor(Math.random() * 60);
  const carbs = Math.floor(totalCalories * 0.54 / 4);
  const protein = Math.floor(totalCalories * 0.16 / 4);
  const fat = Math.floor(totalCalories * 0.30 / 9);
  const fiber = Math.floor(14 + Math.random() * 6);
  const sodium = Math.floor(620 + Math.random() * 250);
  const sugar = Math.floor(3 + Math.random() * 5);

  const isDiabetic = (payload.medical_conditions || []).some((c) => c.toLowerCase().includes('diabet'));
  const isHypertensive = (payload.medical_conditions || []).some((c) => c.toLowerCase().includes('hyper') || c.toLowerCase().includes('pressure'));

  return {
    patient_id: payload.patient_id || 'USER-101',
    patient_name: payload.patient_name || 'My Profile',
    meal_time: payload.meal_time,
    nutritional_breakdown: {
      calories: totalCalories,
      carbs,
      protein,
      fat,
      fiber,
      sodium,
      sugar,
    },
    detailed_recommendations: [
      isDiabetic
        ? 'High Glycemic Index Warning: Traditional white rice batter quickly spikes post-meal blood glucose. Consider substituting with 50% Foxtail Millet (Thinai) or Kodo Millet.'
        : 'Good energy balance! Pair your carbs with high-fiber lentils (Toor/Moong dal) to maintain steady stamina throughout the day.',
      isHypertensive
        ? 'Sodium Caution: Tempering with extra salt or pickles adds excess sodium. Keep salt intake below 2,000mg/day to maintain optimal blood pressure.'
        : 'Saturated fat from coconut chutney detected. Try mixing equal parts roasted gram (pottukadalai) to lower fat content.',
      'Incorporate fresh Moru (buttermilk with curry leaves & roasted cumin) post-meal to support digestion.',
    ],
    ingredient_modifications: {
      'White Rice / Dosa Batter': {
        swap: 'Replace 50% Parboiled Rice with Pearl Millet (Kambu) or Ragi',
        reason: 'Reduces overall glycemic load by 35% and increases dietary fiber & calcium.',
      },
      'Coconut Chutney': {
        swap: 'Mix equal parts Roasted Gram (Pottukadalai) & Mint leaves with less Coconut',
        reason: 'Reduces saturated fat while retaining rich flavor and adding plant protein.',
      },
    },
    positive_notes: [
      'Great plant-based protein contribution from lentils & pulses.',
      'Antioxidants from curry leaves, mustard, and turmeric support gut health.',
    ],
    general_tips: [
      'Take a 15-minute relaxed walk 30 minutes after your meal to optimize glucose uptake.',
      'Stay hydrated with warm water or cumin-infused herbal tea.',
    ],
    final_report: `# Personal Meal Evaluation Report

## 1. Meal Summary
You logged a **${payload.meal_time.toUpperCase()}** consisting of:
${payload.food_items.map((item) => `- **${item.name}**: ${item.quantity}`).join('\n')}

**Personal Health Focus**: ${payload.medical_conditions?.length > 0 ? payload.medical_conditions.join(', ') : 'General Wellness & Energy'}

## 2. Macro & Micro Analysis
- **Calories**: ${totalCalories} kcal
- **Carbohydrates**: ${carbs}g (${Math.round((carbs * 4 / totalCalories) * 100)}% of total energy)
- **Protein**: ${protein}g
- **Fats**: ${fat}g
- **Dietary Fiber**: ${fiber}g
- **Sodium**: ${sodium}mg

## 3. Personalized Smart Recommendations
${isDiabetic ? '⚠️ **Glucose Control Note**: Swap parboiled rice batter for millet batter to lower post-meal spikes.\n' : ''}${isHypertensive ? '⚠️ **Sodium Alert**: Watch out for salted pickles & packaged chutneys.\n' : ''}
1. **Batter modification**: Try Ragi or Thinai Dosa batter instead of pure white rice.
2. **Side dishes**: Enjoy protein-rich drumstick & vegetable Sambar instead of heavy coconut chutney.
3. **Hydration**: Drink fresh buttermilk with roasted cumin after meals.
`,
    message_sent: Boolean(payload.patient_email || payload.patient_phone),
  };
}
