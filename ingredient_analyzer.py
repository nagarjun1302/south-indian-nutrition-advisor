"""
Ingredient Analyzer using Google Gemini
"""

from langchain_core.messages import HumanMessage
import json
import re

def parse_json_from_llm(content: str) -> dict:
    """Clean markdown codeblocks and parse JSON safely"""
    cleaned = re.sub(r'```(?:json)?', '', content)
    cleaned = cleaned.strip('`').strip()
    
    json_match = re.search(r'\{.*\}', cleaned, re.DOTALL)
    if not json_match:
        raise ValueError("No JSON block found in response")
    
    json_str = json_match.group()
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        # Fix trailing commas
        fixed_str = re.sub(r',\s*([\}\]])', r'\1', json_str)
        try:
            return json.loads(fixed_str)
        except json.JSONDecodeError:
            import ast
            return ast.literal_eval(json_str)

class IngredientAnalyzer:
    """Analyzes food ingredients using Gemini"""
    
    def __init__(self, llm):
        self.llm = llm
    
    def _extract_content(self, response):
        """Extract clean text content from Gemini / LangChain response"""
        if hasattr(response, 'content'):
            content = response.content
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                parts = []
                for part in content:
                    if isinstance(part, str):
                        parts.append(part)
                    elif isinstance(part, dict):
                        parts.append(part.get('text', str(part)))
                    elif hasattr(part, 'text'):
                        parts.append(getattr(part, 'text'))
                    else:
                        parts.append(str(part))
                return '\n'.join(parts)
            return str(content)
        return str(response)
    
    def analyze_food_ingredients(
        self, 
        food_name: str, 
        quantity: str,
        medical_conditions: list,
        meal_time: str
    ) -> dict:
        """
        Analyze ingredients in a South Indian dish using Gemini
        """
        
        prompt = f"""You are an expert in South Indian cuisine and nutrition science.

Analyze this dish for a patient with {', '.join(medical_conditions)}:

DISH: {food_name}
QUANTITY: {quantity}
MEAL TIME: {meal_time}

Provide detailed analysis in JSON format:

{{
  "ingredients": ["comprehensive list of typical ingredients in this dish"],
  "nutrition": {{
    "calories": <number>,
    "carbs": <number in grams>,
    "protein": <number in grams>,
    "fat": <number in grams>,
    "fiber": <number in grams>,
    "sodium": <number in mg>,
    "sugar": <number in grams>
  }},
  "problematic_ingredients": [
    {{
      "ingredient": "name",
      "reason": "why problematic for {', '.join(medical_conditions)}",
      "severity": "high/medium/low"
    }}
  ],
  "healthy_ingredients": ["list of beneficial ingredients in this dish"],
  "cooking_method": "typical cooking method (steamed/fried/boiled etc)",
  "concerns_for_conditions": [
    {{
      "condition": "condition name",
      "concern": "specific concern about this dish",
      "recommendation": "specific actionable modification"
    }}
  ],
  "portion_assessment": "is {quantity} appropriate? specific feedback with ideal portion size",
  "meal_timing_assessment": "is this appropriate for {meal_time}? why/why not with specific reasons"
}}

IMPORTANT SOUTH INDIAN FOOD KNOWLEDGE:
- Idli: Fermented rice & urad dal, steamed (low fat, good for most conditions)
- Dosa: Rice & urad dal batter, fried with oil (portion and oil amount matters)
- Vada: Deep fried urad dal (high fat, avoid for cholesterol/diabetes/hypertension)
- Pongal: Rice + moong dal + ghee + pepper (ghee amount is key concern)
- Sambar: Toor dal + vegetables + tamarind (generally healthy, watch salt)
- Rasam: Tamarind + tomato + spices (acidic, may trigger gastric issues)
- Parotta: Refined flour + oil layers (high carbs, high fat - avoid for diabetes)
- Biryani: Rice + meat/veg + oil + spices (high calories, high sodium)
- Curd rice: Rice + yogurt + tempering (good probiotic, but rice quantity matters)
- Coconut chutney: Coconut + dal + chili (high fat from coconut)

CONDITION-SPECIFIC CONCERNS:
- Diabetes: High GI carbs (white rice, refined flour), sugar, large portions
- Hypertension: Salt, sodium, fried foods, pickles
- High Cholesterol: Saturated fats (ghee, coconut, fried foods)
- Obesity: High calorie, large portions, fried items
- Kidney Disease: High potassium, high phosphorus, excess protein
- Gastric Issues: Spicy, acidic (rasam, tamarind), fried foods
- PCOS: High GI foods, processed carbs

Base your nutritional calculations on the specified portion: {quantity}

Use realistic South Indian portion sizes:
- 1 idli = ~40 calories
- 1 dosa = ~150-200 calories (depends on oil)
- 1 bowl rice = ~200 calories for 1 cup cooked
- 1 bowl sambar = ~90 calories per cup

Return ONLY the JSON, no additional text.
"""

        try:
            # Retry loop for Gemini 429 Rate Limits
            response = None
            for attempt in range(3):
                try:
                    response = self.llm.invoke([HumanMessage(content=prompt)])
                    break
                except Exception as err:
                    if ("429" in str(err) or "RESOURCE_EXHAUSTED" in str(err)) and attempt < 2:
                        import time
                        time.sleep(2 * (attempt + 1))
                    else:
                        raise err
            
            # Extract content properly
            content = self._extract_content(response)
            
            analysis = parse_json_from_llm(content)
            
            # Validate required fields
            required_fields = ['ingredients', 'nutrition', 'cooking_method']
            for field in required_fields:
                if field not in analysis:
                    analysis[field] = {} if field == 'nutrition' else "unknown"
            
            return analysis
            
        except Exception as e:
            print(f"Error analyzing {food_name}: {e}")
            # Return default structure
            return {
                "ingredients": ["Unable to analyze - using defaults"],
                "nutrition": {
                    "calories": 150, "carbs": 25, "protein": 5,
                    "fat": 3, "fiber": 2, "sodium": 200, "sugar": 2
                },
                "problematic_ingredients": [],
                "healthy_ingredients": [],
                "cooking_method": "unknown",
                "concerns_for_conditions": [],
                "portion_assessment": "Could not analyze portion size",
                "meal_timing_assessment": "Could not analyze meal timing"
            }
    
    def get_ingredient_alternatives(
        self, 
        ingredient: str, 
        medical_condition: str
    ) -> dict:
        """Get healthier alternatives for problematic ingredients using Gemini"""
        
        prompt = f"""For a patient with {medical_condition}, suggest South Indian cooking alternatives for:

INGREDIENT: {ingredient}

Provide in JSON format:
{{
  "alternatives": [
    {{
      "name": "alternative ingredient",
      "benefit": "why it's better for {medical_condition}",
      "how_to_use": "specific cooking instruction for South Indian dishes"
    }}
  ],
  "modification_tips": ["practical tip 1", "practical tip 2"]
}}

Examples:
- If ingredient is "white rice" for diabetes: suggest brown rice, cauliflower rice, or mixing with broken wheat
- If ingredient is "ghee" for high cholesterol: suggest reducing amount or using olive oil spray
- If ingredient is "coconut" for cholesterol: suggest using less or replacing with low-fat yogurt

Return ONLY the JSON.
"""
        
        try:
            response = self.llm.invoke([HumanMessage(content=prompt)])
            content = self._extract_content(response)
            
            return parse_json_from_llm(content)
        except Exception as e:
            print(f"Error getting alternatives: {e}")
        
        return {
            "alternatives": [],
            "modification_tips": []
        }
