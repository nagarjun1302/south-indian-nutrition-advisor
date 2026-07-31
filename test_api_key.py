"""
test_gmail.py - Test Gmail configuration
"""

import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText

load_dotenv()

smtp_email = os.getenv("SMTP_EMAIL")
smtp_password = os.getenv("SMTP_PASSWORD")

print("Testing Gmail SMTP Setup\n")
print("="*60)

if not smtp_email or not smtp_password:
    print(" SMTP_EMAIL or SMTP_PASSWORD not found in .env")
    print("\nAdd to .env:")
    print("SMTP_EMAIL=your.email@gmail.com")
    print("SMTP_PASSWORD=your_app_password")
    exit(1)

print(f" Email: {smtp_email}")
print(f" Password: {'*' * len(smtp_password)}")

# Test sending
try:
    msg = MIMEText(" Test email from Nutrition Advisor!\n\nIf you received this, Gmail SMTP is working! ✅")
    msg['Subject'] = "Test Email - Nutrition Advisor"
    msg['From'] = smtp_email
    msg['To'] = smtp_email  # Send to yourself
    
    print(f"\n Sending test email to {smtp_email}...")
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(smtp_email, smtp_password)
        server.send_message(msg)
    
    print(" Email sent successfully!")
    print(f"Check your inbox: {smtp_email}")
    
except Exception as e:
    print(f" Error: {e}")
    print("\nTroubleshooting:")
    print("1. Enable 2FA on your Google account")
    print("2. Create App Password: https://myaccount.google.com/apppasswords")
    print("3. Use the 16-character app password (no spaces)")
