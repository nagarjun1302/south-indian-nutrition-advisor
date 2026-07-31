"""
Simple example with Email messaging
"""

import os
from dotenv import load_dotenv

load_dotenv()

if not os.getenv("GOOGLE_API_KEY"):
    print("Set GOOGLE_API_KEY in .env file")
    exit(1)

from nutrition_advisor import analyze_patient_meal

print("\nSMART NUTRITION ADVISOR")
print("="*70)

# Analyze meal with Email notification
result = analyze_patient_meal(
    patient_id="P001",
    patient_name="Ramesh Kumar",
    food_items=[
        {"name": "Idli", "quantity": "3 pieces"},
        {"name": "Sambar", "quantity": "1 bowl"},
        {"name": "Vada", "quantity": "2 pieces"}
    ],
    medical_conditions=["Diabetes"],
    meal_time="breakfast",
    patient_email="arise3699@gmail.com"  
)

# Print the full report
print("\n" + "="*70)
print("FULL NUTRITION REPORT")
print("="*70)
print(result["final_report"])

# Print nutrition summary
print("\n" + "="*70)
print("NUTRITION SUMMARY")
print("="*70)
print(f"Calories: {result['nutritional_breakdown']['calories']:.0f} kcal")
print(f"Carbs: {result['nutritional_breakdown']['carbs']:.0f}g")
print(f"Protein: {result['nutritional_breakdown']['protein']:.0f}g")
print(f"Fat: {result['nutritional_breakdown']['fat']:.0f}g")

# Check if Email was sent
print("\n" + "="*70)
print("📧 EMAIL STATUS")
print("="*70)
if result['message_sent']:
    print("✅ Email sent successfully!")
    print("Check your inbox!")
else:
    print("💡 Email printed to console (configure SMTP for actual sending)")
