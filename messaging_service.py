"""
Messaging Service - Email Only (Free Options)
Supports: Gmail SMTP (free), Outlook SMTP (free), or SendGrid (free tier)
"""

import os
from typing import Optional
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class MessagingService:
    """Service to send email messages to patients"""
    
    def __init__(self):
        # Email Configuration
        self.email_method = os.getenv("EMAIL_METHOD", "gmail")  # gmail, outlook, or sendgrid
        
        # Gmail/Outlook SMTP Settings
        self.smtp_email = os.getenv("SMTP_EMAIL")  # Your email address
        self.smtp_password = os.getenv("SMTP_PASSWORD")  # Your app password
        
        # API Keys for HTTP-based email services (bypasses Render SMTP port blocking)
        self.resend_api_key = os.getenv("RESEND_API_KEY")
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        
        if self.resend_api_key:
            print("Email initialized (Resend HTTP API)")
        elif self.sendgrid_api_key:
            print("Email initialized (SendGrid HTTP API)")
        elif self.smtp_email and self.smtp_password:
            print(f"Email initialized (SMTP - {self.email_method})")
        else:
            print("Email credentials not configured - messages will be printed to console")
    
    def send_email(self, to: str, subject: str, body: str, is_html: bool = True) -> bool:
        """
        Send email via Resend API, SendGrid API, or SMTP
        """
        # 1. Try Resend HTTP API (Port 443 - Recommended for Render)
        if self.resend_api_key:
            return self._send_via_resend(to, subject, body)

        # 2. Try SendGrid HTTP API (Port 443 - Recommended for Render)
        if self.sendgrid_api_key:
            return self._send_via_sendgrid_http(to, subject, body)
        
        # 3. Fallback to SMTP
        if self.smtp_email and self.smtp_password:
            return self._send_via_smtp(to, subject, body, is_html)
        
        # Mock mode - print to console
        print("\n📧 [MOCK EMAIL - No credentials configured]")
        print(f"To: {to}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print("-" * 60)
        return False

    def _send_via_resend(self, to: str, subject: str, body: str) -> bool:
        """Send email via Resend HTTP API (Port 443 - Never blocked by Render)"""
        try:
            import requests
            html_body = self._convert_to_html(body)
            from_email = os.getenv("FROM_EMAIL", "NutriWise South <onboarding@resend.dev>")
            
            res = requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {self.resend_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "from": from_email,
                    "to": [to],
                    "subject": subject,
                    "html": html_body
                },
                timeout=12
            )
            if res.status_code in [200, 201, 202]:
                print(f" Email sent successfully to {to} (via Resend HTTP API)")
                return True
            else:
                print(f" Error sending via Resend API ({res.status_code}): {res.text}")
                return False
        except Exception as e:
            print(f" Exception sending via Resend API: {e}")
            return False

    def _send_via_sendgrid_http(self, to: str, subject: str, body: str) -> bool:
        """Send email via SendGrid HTTP API (Port 443 - Never blocked by Render)"""
        try:
            import requests
            html_body = self._convert_to_html(body)
            from_email = os.getenv("FROM_EMAIL", self.smtp_email or "nutrition@yourapp.com")
            
            res = requests.post(
                "https://api.sendgrid.com/v3/mail/send",
                headers={
                    "Authorization": f"Bearer {self.sendgrid_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "personalizations": [{"to": [{"email": to}]}],
                    "from": {"email": from_email, "name": "NutriWise South"},
                    "subject": subject,
                    "content": [{"type": "text/html", "value": html_body}]
                },
                timeout=12
            )
            if res.status_code in [200, 201, 202]:
                print(f" Email sent successfully to {to} (via SendGrid HTTP API)")
                return True
            else:
                print(f" Error sending via SendGrid API ({res.status_code}): {res.text}")
                return False
        except Exception as e:
            print(f" Exception sending via SendGrid API: {e}")
            return False
    
    def _send_via_smtp(self, to: str, subject: str, body: str, is_html: bool) -> bool:
        """Send email via Gmail or Outlook SMTP"""
        try:
            # SMTP server configuration
            if self.email_method == "gmail":
                smtp_server = "smtp.gmail.com"
                smtp_port = 465
                use_ssl = True
            elif self.email_method == "outlook":
                smtp_server = "smtp-mail.outlook.com"
                smtp_port = 587
                use_ssl = False
            else:
                smtp_server = "smtp.gmail.com"
                smtp_port = 465
                use_ssl = True
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.smtp_email
            msg['To'] = to
            msg['Subject'] = subject
            
            # Add body
            if is_html:
                html_body = self._convert_to_html(body)
                msg.attach(MIMEText(html_body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Send email via SSL (Port 465) or TLS (Port 587)
            if use_ssl or smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
                    server.login(self.smtp_email, self.smtp_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(smtp_server, smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_email, self.smtp_password)
                    server.send_message(msg)
            
            print(f" Email sent successfully to {to} (via {self.email_method})")
            return True
            
        except Exception as e:
            print(f" Error sending email to {to}: {e}")
            print(f"Would have sent:")
            print(f"Subject: {subject}")
            print(f"Body:\n{body[:200]}...")
            return False
    
    def _send_via_sendgrid(self, to: str, subject: str, body: str) -> bool:
        """Send email via SendGrid API"""
        try:
            from sendgrid.helpers.mail import Mail
            
            html_body = self._convert_to_html(body)
            
            message = Mail(
                from_email=self.from_email,
                to_emails=to,
                subject=subject,
                html_content=html_body
            )
            
            response = self.sendgrid_client.send(message)
            print(f" Email sent successfully to {to} (via SendGrid)")
            return True
            
        except Exception as e:
            print(f" Error sending email via SendGrid: {e}")
            return False
    
    def send_analysis_report(
        self,
        patient_name: str,
        patient_email: str,
        meal_time: str,
        full_report: str,
        concerns: list,
        tips: list,
        positive_notes: list
    ) -> bool:
        """
        Send meal analysis report via Email
        
        Args:
            patient_name: Patient's name
            patient_email: Email address
            meal_time: Meal time
            full_report: Complete analysis report
            concerns: List of concerns
            tips: List of recommendations
            positive_notes: List of positive feedback
        
        Returns:
            True if successful
        """
        subject = f"Your Nutrition Report - {meal_time.title()} - {datetime.now().strftime('%B %d, %Y')}"
        
        # Create email body
        body = f"""
<h2>Hi {patient_name}! </h2>

<p>Your nutrition analysis for <strong>{meal_time}</strong> is ready.</p>

<h3> Key Concerns:</h3>
<ul>
{''.join(f'<li>{concern}</li>' for concern in concerns[:3]) if concerns else '<li>Looking good!</li>'}
</ul>

<h3> Top Recommendations:</h3>
<ul>
{''.join(f'<li>{tip}</li>' for tip in tips[:3]) if tips else '<li>Keep up the good work!</li>'}
</ul>

<h3> What You Did Right:</h3>
<ul>
{''.join(f'<li>{note}</li>' for note in positive_notes[:2]) if positive_notes else '<li>Track your next meal!</li>'}
</ul>

<hr>

<h3> Full Report:</h3>
<div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
{full_report.replace(chr(10), '<br>')}
</div>

<p style="margin-top: 30px;">
Stay healthy! <br>
<em>- Your Nutrition Team </em>
</p>
"""
        
        return self.send_email(patient_email, subject, body, is_html=True)
    
    def send_reminder(
        self, 
        patient_name: str,
        patient_email: str,
        next_meal: str,
        recommendations: list
    ) -> bool:
        """Send meal reminder via Email"""
        
        subject = f"Reminder: Time for {next_meal.title()}! "
        
        body = f"""
<h2>Hi {patient_name}! </h2>

<p>Time for <strong>{next_meal}</strong>! Here are your tips:</p>

<ul>
{''.join(f'<li>{rec}</li>' for rec in recommendations[:3])}
</ul>

<p>Remember your health goals! </p>

<p><em>- Your Nutrition Team</em></p>
"""
        
        return self.send_email(patient_email, subject, body, is_html=True)
    
    def send_daily_summary(
        self,
        patient_name: str,
        patient_email: str,
        total_calories: float,
        meals_tracked: int,
        key_insights: list
    ) -> bool:
        """Send end-of-day summary via Email"""
        
        subject = f"Daily Summary - {datetime.now().strftime('%B %d, %Y')} "
        
        body = f"""
<h2>Hi {patient_name}! </h2>

<h3>Daily Summary - {datetime.now().strftime('%B %d, %Y')}</h3>

<table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
    <tr style="background-color: #f0f0f0;">
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Meals Tracked</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">{meals_tracked}</td>
    </tr>
    <tr>
        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Calories</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">{total_calories:.0f} kcal</td>
    </tr>
</table>

<h3> Key Insights:</h3>
<ul>
{''.join(f'<li>{insight}</li>' for insight in key_insights)}
</ul>

<p>Keep up the great work! </p>

<p><em>- Your Nutrition Team</em></p>
"""
        
        return self.send_email(patient_email, subject, body, is_html=True)
    
    def _convert_to_html(self, text: str) -> str:
        """Convert markdown text to a beautifully styled HTML email report"""
        import re

        # Clean stringified dict if it was somehow passed
        if text.startswith("{'type':") or text.startswith('{"type":'):
            try:
                import ast
                parsed_dict = ast.literal_eval(text)
                if isinstance(parsed_dict, dict) and 'text' in parsed_dict:
                    text = parsed_dict['text']
            except Exception:
                pass

        lines = text.split('\n')
        html_lines = []
        in_list = False

        for line in lines:
            stripped = line.strip()
            if not stripped:
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                continue

            # Convert horizontal rule
            if stripped == '---':
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                html_lines.append('<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">')
                continue

            # Convert headers
            if stripped.startswith('### '):
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                header_text = stripped[4:]
                html_lines.append(f'<h3 style="color: #1e293b; font-size: 18px; margin-top: 20px; margin-bottom: 8px; font-weight: 600;">{header_text}</h3>')
                continue
            elif stripped.startswith('## '):
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                header_text = stripped[3:]
                html_lines.append(f'<h2 style="color: #166534; font-size: 20px; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-top: 24px; margin-bottom: 12px; font-weight: 700;">{header_text}</h2>')
                continue

            # Convert bullet items
            if stripped.startswith('* ') or stripped.startswith('- '):
                if not in_list:
                    html_lines.append('<ul style="margin: 8px 0; padding-left: 20px;">')
                    in_list = True
                item_text = stripped[2:]
                item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
                html_lines.append(f'<li style="margin-bottom: 6px; color: #334155;">{item_text}</li>')
                continue
            elif re.match(r'^\d+\.\s', stripped):
                if in_list:
                    html_lines.append("</ul>")
                    in_list = False
                item_text = re.sub(r'^\d+\.\s*', '', stripped)
                item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
                html_lines.append(f'<p style="margin-bottom: 8px; color: #334155; padding-left: 10px; border-left: 3px solid #22c55e;">{item_text}</p>')
                continue

            if in_list:
                html_lines.append("</ul>")
                in_list = False

            # Convert inline bold and paragraph
            line_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', stripped)
            html_lines.append(f'<p style="margin-bottom: 12px; color: #334155; line-height: 1.6;">{line_text}</p>')

        if in_list:
            html_lines.append("</ul>")

        body_html = '\n'.join(html_lines)

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>South Indian Nutrition Analysis</title>
</head>
<body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header Banner -->
        <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 28px 24px; text-align: center;">
                <table align="center" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-right: 8px; vertical-align: middle;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
                            </svg>
                        </td>
                        <td style="vertical-align: middle;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">NutriWise South</h1>
                        </td>
                    </tr>
                </table>
                <p style="color: #ffe4d1; margin: 6px 0 0 0; font-size: 14px;">Personalized South Indian Nutrition Advisor</p>
            </td>
        </tr>
        <!-- Content Card -->
        <tr>
            <td style="padding: 30px 24px;">
                {body_html}
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                <p style="margin: 0 0 4px 0;"><strong>South Indian Nutrition Advisor AI</strong></p>
                <p style="margin: 0;">This automated report is designed to assist your daily nutrition management. Please consult your physician or registered dietitian for medical advice.</p>
            </td>
        </tr>
    </table>
</body>
</html>"""
        return html


# Mock Messaging Service for Testing
class MockMessagingService(MessagingService):
    """Mock service for testing without credentials"""
    
    def __init__(self):
        self.smtp_email = None
        self.smtp_password = None
        self.sendgrid_client = None
        print(" MockMessagingService initialized - emails will be printed to console")
    
    def send_email(self, to: str, subject: str, body: str, is_html: bool = True) -> bool:
        print(f"\n📧 [MOCK EMAIL to {to}]")
        print(f"Subject: {subject}")
        print(f"Body:\n{body[:500]}...")
        print("-" * 60)
        return True


# Test the service
if __name__ == "__main__":
    print("Testing Email Messaging Service\n")
    print("=" * 60)
    
    # Use mock service for testing
    messaging = MockMessagingService()
    
    # Test
    messaging.send_analysis_report(
        patient_name="Ramesh",
        patient_email="ramesh@example.com",
        meal_time="breakfast",
        full_report="Your breakfast was analyzed...",
        concerns=["Too much ghee", "Deep fried vada"],
        tips=["Reduce ghee", "Choose idli"],
        positive_notes=["Good sambar choice"]
    )
    
    print("\n Test completed!")
