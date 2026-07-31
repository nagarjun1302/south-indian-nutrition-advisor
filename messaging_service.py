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
        
        # SendGrid Settings (alternative)
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", self.smtp_email or "nutrition@yourapp.com")
        
        # Initialize
        if self.email_method == "sendgrid" and self.sendgrid_api_key:
            try:
                from sendgrid import SendGridAPIClient
                self.sendgrid_client = SendGridAPIClient(self.sendgrid_api_key)
                print("Email initialized (SendGrid)")
            except ImportError:
                print("SendGrid not installed. Install with: pip install sendgrid")
                self.sendgrid_client = None
        elif self.smtp_email and self.smtp_password:
            self.sendgrid_client = None
            print(f"Email initialized (SMTP - {self.email_method})")
        else:
            self.sendgrid_client = None
            print("Email credentials not configured - messages will be printed to console")
    
    def send_email(self, to: str, subject: str, body: str, is_html: bool = True) -> bool:
        """
        Send email via SMTP or SendGrid
        
        Args:
            to: Email address
            subject: Email subject
            body: Email body (HTML or plain text)
            is_html: Whether body is HTML
        
        Returns:
            True if successful
        """
        # Try SendGrid first if configured
        if self.sendgrid_client:
            return self._send_via_sendgrid(to, subject, body)
        
        # Try SMTP (Gmail/Outlook)
        if self.smtp_email and self.smtp_password:
            return self._send_via_smtp(to, subject, body, is_html)
        
        # Mock mode - print to console
        print("\n📧 [MOCK EMAIL - No credentials configured]")
        print(f"To: {to}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print("-" * 60)
        return False
    
    def _send_via_smtp(self, to: str, subject: str, body: str, is_html: bool) -> bool:
        """Send email via Gmail or Outlook SMTP"""
        try:
            # SMTP server configuration
            if self.email_method == "gmail":
                smtp_server = "smtp.gmail.com"
                smtp_port = 587
            elif self.email_method == "outlook":
                smtp_server = "smtp-mail.outlook.com"
                smtp_port = 587
            else:
                smtp_server = "smtp.gmail.com"
                smtp_port = 587
            
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
            
            # Send email
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
        """Convert text to nice HTML email"""
        
        # If already contains HTML tags, wrap it nicely
        if '<' in text and '>' in text:
            html_content = text
        else:
            # Convert plain text to HTML
            html_content = text.replace('\n\n', '</p><p>').replace('\n', '<br>')
            html_content = f'<p>{html_content}</p>'
        
        # Wrap in full HTML email template
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nutrition Report</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 15px; margin-bottom: 20px;">
        {html_content}
    </div>
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 0.9em;">
        <p>This is an automated message from your Nutrition Advisor</p>
        <p>For questions, please consult your healthcare provider</p>
    </div>
</body>
</html>
"""
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
