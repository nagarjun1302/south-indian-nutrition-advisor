"""
Smart South Indian Nutrition Advisor using LangGraph + Google Gemini
Uses Gemini to analyze ingredients and provide detailed recommendations
"""

from typing import TypedDict, List, Dict, Optional
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
import json
from datetime import datetime
from ingredient_analyzer import IngredientAnalyzer
from messaging_service import MessagingService
import os
import re
from dotenv import load_dotenv


load_dotenv()

# Define the state structure
class NutritionState(TypedDict):
    """State for the nutrition advisor workflow"""
    patient_id: str
    patient_name: str
    food_items: List[Dict[str, str]]
    medical_conditions: List[str]
    meal_time: str  # breakfast, lunch, dinner, snack
    ingredient_analysis: Dict[str, Dict]
    nutritional_breakdown: Dict[str, float]
    detailed_recommendations: Dict[str, List[str]]
    ingredient_modifications: Dict[str, Dict]
    final_report: str
    message_sent: bool
    patient_email: Optional[str]
    patient_phone: Optional[str]
    patient_whatsapp: Optional[str]

def extract_content(response):
    """Extract content from Gemini response"""
    if hasattr(response, 'content'):
        content = response.content
        # Gemini returns list of content parts
        if isinstance(content, list):
            # Join all text parts
            return ' '.join(str(part.text) if hasattr(part, 'text') else str(part) for part in content)
        return str(content)
    return str(response)
    
# Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # or gemini-1.5-pro
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")  # Use environment variable
)

ingredient_analyzer = IngredientAnalyzer(llm)
messaging_service = MessagingService()

def analyze_ingredients_with_gemini(state: NutritionState) -> NutritionState:
    """Use Gemini to analyze ingredients in each food item"""
    print("🔍 Analyzing ingredients with Gemini...")
    
    ingredient_analysis = {}
    
    for food_item in state["food_items"]:
        food_name = food_item["name"]
        quantity = food_item.get("quantity", "1 serving")
        
        # Use Gemini to identify ingredients
        analysis = ingredient_analyzer.analyze_food_ingredients(
            food_name=food_name,
            quantity=quantity,
            medical_conditions=state["medical_conditions"],
            meal_time=state.get("meal_time", "")
        )
        
        ingredient_analysis[food_name] = analysis
    
    return {
        **state,
        "ingredient_analysis": ingredient_analysis
    }

def calculate_nutrition_with_gemini(state: NutritionState) -> NutritionState:
    """Calculate nutrition using Gemini's knowledge"""
    print("📊 Calculating nutrition with Gemini...")
    
    total_nutrition = {
        "calories": 0,
        "carbs": 0,
        "protein": 0,
        "fat": 0,
        "fiber": 0,
        "sodium": 0,
        "sugar": 0
    }
    
    for food_name, analysis in state["ingredient_analysis"].items():
        nutrition = analysis.get("nutrition", {})
        for key in total_nutrition:
            if key in nutrition:
                total_nutrition[key] += nutrition[key]
    
    # Add analysis summary
    analysis_summary = []
    for food_name, analysis in state["ingredient_analysis"].items():
        summary = f"\n🍽️ {food_name}:"
        summary += f"\n   Nutrition: {analysis['nutrition']}"
        summary += f"\n   Key Ingredients: {', '.join(analysis['ingredients'][:5])}"
        if analysis.get('problematic_ingredients'):
            summary += f"\n   ⚠️ Concerns: {len(analysis['problematic_ingredients'])} problematic ingredients"
        analysis_summary.append(summary)
    
    return {
        **state,
        "nutritional_breakdown": total_nutrition,
        "analysis": "\n".join(analysis_summary)
    }

def generate_ingredient_level_recommendations(state: NutritionState) -> NutritionState:
    """Generate detailed ingredient-level recommendations using Gemini"""
    print("💡 Generating ingredient-level recommendations with Gemini...")
    
    recommendations_prompt = f"""You are an expert nutritionist specializing in South Indian cuisine.

Analyze this meal intake for a patient with {', '.join(state['medical_conditions'])}:

MEAL TIME: {state.get('meal_time', 'Not specified')}

FOOD ITEMS AND THEIR INGREDIENTS:
{json.dumps(state['ingredient_analysis'], indent=2)}

TOTAL NUTRITION:
{json.dumps(state['nutritional_breakdown'], indent=2)}

Provide DETAILED, INGREDIENT-LEVEL recommendations in JSON format:

{{
  "immediate_concerns": ["specific problematic items with reasons"],
  "ingredient_modifications": {{
    "food_name": {{
      "avoid_ingredients": ["ingredient1: reason", "ingredient2: reason"],
      "reduce_ingredients": ["ingredient: how much to reduce"],
      "add_ingredients": ["ingredient: why and how much"],
      "cooking_method_changes": ["specific change with reason"],
      "portion_advice": "specific portion guidance with numbers"
    }}
  }},
  "meal_timing_advice": "specific advice based on meal time and conditions",
  "general_tips": ["actionable tip 1", "actionable tip 2"],
  "positive_notes": ["specific good choice 1", "specific good choice 2"]
}}

Be VERY specific with numbers. For example:
- "Pongal: Reduce ghee from typical 2 tbsp to 1 tsp (saves 200 calories)"
- "Dosa: Use only 1 tsp oil instead of 1 tbsp for cooking"
- "Sambar: Excellent choice! Rich in 8g protein and 3g fiber per serving"
- "Rice: Limit to 1/2 cup (cooked) instead of 2 cups for diabetes management"

Focus on South Indian cuisine modifications that are culturally appropriate and practical.

Return ONLY valid JSON, no additional text or markdown.
"""

    try:
        response = llm.invoke([HumanMessage(content=recommendations_prompt)])
        
        # Extract content properly
        content = extract_content(response)
        
        # Extract JSON from response
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            recommendations = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found")
            
    except Exception as e:
        print(f"⚠️ Error parsing recommendations: {e}")
        # Fallback structure
        recommendations = {
            "immediate_concerns": ["Unable to parse detailed recommendations"],
            "ingredient_modifications": {},
            "meal_timing_advice": "Consult with your dietitian",
            "general_tips": ["Monitor portion sizes", "Stay hydrated"],
            "positive_notes": []
        }
    
    return {
        **state,
        "detailed_recommendations": recommendations.get("immediate_concerns", []),
        "ingredient_modifications": recommendations.get("ingredient_modifications", {}),
        "meal_timing_advice": recommendations.get("meal_timing_advice", ""),
        "general_tips": recommendations.get("general_tips", []),
        "positive_notes": recommendations.get("positive_notes", [])
    }

def create_personalized_report(state: NutritionState) -> NutritionState:
    """Create a comprehensive personalized report using Gemini"""
    print("📋 Creating personalized report with Gemini...")
    
    report_prompt = f"""Create a warm, personalized nutrition report for {state.get('patient_name', 'the patient')}.

PATIENT CONDITIONS: {', '.join(state['medical_conditions'])}
MEAL TIME: {state.get('meal_time', 'Not specified')}

FOODS CONSUMED:
{json.dumps(state['ingredient_analysis'], indent=2)}

NUTRITIONAL BREAKDOWN:
Total Calories: {state['nutritional_breakdown'].get('calories', 0):.0f} kcal
Carbs: {state['nutritional_breakdown'].get('carbs', 0):.0f}g
Protein: {state['nutritional_breakdown'].get('protein', 0):.0f}g
Fat: {state['nutritional_breakdown'].get('fat', 0):.0f}g
Fiber: {state['nutritional_breakdown'].get('fiber', 0):.0f}g
Sodium: {state['nutritional_breakdown'].get('sodium', 0):.0f}mg

INGREDIENT-LEVEL MODIFICATIONS:
{json.dumps(state.get('ingredient_modifications', {}), indent=2)}

MEAL TIMING ADVICE:
{state.get('meal_timing_advice', '')}

POSITIVE NOTES:
{json.dumps(state.get('positive_notes', []), indent=2)}

Create a friendly, actionable report with these sections:

1. 👋 **Warm Greeting** 
   - Address {state.get('patient_name', 'them')} by name
   - Acknowledge their effort to track meals

2. 📊 **Quick Summary**
   - Brief overview of what they ate
   - Total calories and key nutrients

3. ⚠️ **IMMEDIATE CONCERNS**
   - List specific problematic items from their meal
   - Explain WHY each is concerning for their condition
   - Be specific with numbers

4. 🔧 **INGREDIENT-LEVEL MODIFICATIONS**
   For EACH dish they ate:
   - What to reduce (with specific amounts: "2 tbsp → 1 tsp")
   - What to avoid completely
   - What to add
   - How to cook it differently
   - Ideal portion size

5. ⏰ **MEAL TIMING ADVICE**
   - Is this meal appropriate for this time of day?
   - What changes for next time?

6. ✅ **WHAT YOU DID RIGHT**
   - Specific positive reinforcement
   - Acknowledge good choices

7. 🎯 **ACTION PLAN FOR NEXT MEAL**
   - 3-5 specific, actionable changes
   - Make it easy to follow

8. 💪 **Motivational Closing**
   - Encouraging words
   - Remind them of their health goals

Guidelines:
- Use {state.get('patient_name', 'their')} name throughout
- Be conversational but professional
- Use emojis sparingly (only section headers)
- Give SPECIFIC numbers (not "less oil" but "1 tsp instead of 1 tbsp")
- Focus on South Indian cuisine alternatives
- Be culturally sensitive
- Balance honesty with encouragement
- Make recommendations ACTIONABLE and PRACTICAL

Return plain text report, no JSON.
"""

    try:
        response = llm.invoke([HumanMessage(content=report_prompt)])
        # Extract content properly
        final_report = extract_content(response)
    except Exception as e:
        print(f"⚠️ Error generating report: {e}")
        final_report = f"Report generation encountered an error. Please try again."
    
    return {
        **state,
        "final_report": final_report
    }

def send_patient_message(state: NutritionState) -> NutritionState:
    """Send recommendations to patient via Email"""
    print("📧 Sending email to patient...")
    
    message_sent = False
    patient_email = state.get("patient_email")
    
    if not patient_email:
        print("⚠️ No email address provided")
        return {**state, "message_sent": False}
    
    # Send email with full report
    message_sent = messaging_service.send_analysis_report(
        patient_name=state.get('patient_name', 'there'),
        patient_email=patient_email,
        meal_time=state.get('meal_time', 'today'),
        full_report=state.get('final_report', ''),
        concerns=state.get('detailed_recommendations', [])[:3],
        tips=state.get('general_tips', [])[:3],
        positive_notes=state.get('positive_notes', [])[:2]
    )
    
    if message_sent:
        print(f"✅ Email sent to {patient_email}")
    else:
        print(f"⚠️ Email printed to console (credentials not configured)")
    
    return {
        **state,
        "message_sent": message_sent
    }

def build_smart_nutrition_graph():
    """Build the enhanced LangGraph workflow with Gemini"""
    workflow = StateGraph(NutritionState)
    
    # Add nodes
    workflow.add_node("analyze_ingredients", analyze_ingredients_with_gemini)
    workflow.add_node("calculate_nutrition", calculate_nutrition_with_gemini)
    workflow.add_node("generate_recommendations", generate_ingredient_level_recommendations)
    workflow.add_node("create_report", create_personalized_report)
    workflow.add_node("send_message", send_patient_message)
    
    # Add edges
    workflow.add_edge("analyze_ingredients", "calculate_nutrition")
    workflow.add_edge("calculate_nutrition", "generate_recommendations")
    workflow.add_edge("generate_recommendations", "create_report")
    workflow.add_edge("create_report", "send_message")
    workflow.add_edge("send_message", END)
    
    # Set entry point
    workflow.set_entry_point("analyze_ingredients")
    
    return workflow.compile()

def analyze_patient_meal(
    patient_id: str,
    patient_name: str,
    food_items: List[Dict],
    medical_conditions: List[str],
    meal_time: str = "",
    patient_phone: Optional[str] = None,
    patient_email: Optional[str] = None,
    patient_whatsapp: Optional[str] = None
) -> Dict:
    """
    Main function to analyze patient meal with Gemini intelligence
    
    Args:
        patient_id: Unique patient identifier
        patient_name: Patient's name
        food_items: List of dicts with 'name' and 'quantity'
        medical_conditions: List of conditions
        meal_time: breakfast, lunch, dinner, snack
        patient_phone: Phone for SMS
        patient_email: Email address
        patient_whatsapp: WhatsApp number
    
    Returns:
        Complete analysis results
    """
    app = build_smart_nutrition_graph()
    
    initial_state = {
        "patient_id": patient_id,
        "patient_name": patient_name,
        "food_items": food_items,
        "medical_conditions": medical_conditions,
        "meal_time": meal_time,
        "patient_phone": patient_phone,
        "patient_email": patient_email,
        "patient_whatsapp": patient_whatsapp,
        "ingredient_analysis": {},
        "nutritional_breakdown": {},
        "detailed_recommendations": [],
        "ingredient_modifications": {},
        "final_report": "",
        "message_sent": False
    }
    print("STATE EMAIL:", initial_state.get("patient_email"))
    
    result = app.invoke(initial_state)
    return result