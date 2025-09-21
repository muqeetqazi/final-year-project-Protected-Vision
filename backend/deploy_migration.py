#!/usr/bin/env python
"""
Script to deploy the user statistics migration to DigitalOcean
Run this script on your DigitalOcean server to add the missing user statistics fields
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append('/app')  # Adjust this path based on your DigitalOcean deployment structure

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.management import execute_from_command_line

def deploy_migration():
    """Deploy the user statistics migration"""
    print("Deploying user statistics migration...")
    
    try:
        # Run the migration
        execute_from_command_line(['manage.py', 'migrate', 'users'])
        print("✅ Migration completed successfully!")
        
        # Verify the fields were added
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Check if the fields exist
        user_fields = [field.name for field in User._meta.fields]
        required_fields = [
            'total_documents_saved',
            'total_documents_processed', 
            'total_documents_shared',
            'total_sensitive_items_detected',
            'total_non_detected_items'
        ]
        
        missing_fields = [field for field in required_fields if field not in user_fields]
        
        if missing_fields:
            print(f"❌ Missing fields: {missing_fields}")
        else:
            print("✅ All user statistics fields are present!")
            
        # Test the API endpoint
        print("\nTesting user profile API...")
        from django.test import Client
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        client = Client()
        
        # Create a test user if none exists
        if not User.objects.exists():
            user = User.objects.create_user(
                email='test@example.com',
                username='testuser',
                password='testpass123',
                first_name='Test',
                last_name='User'
            )
            print("Created test user")
        else:
            user = User.objects.first()
            print(f"Using existing user: {user.email}")
        
        # Test the profile endpoint
        response = client.get('/api/auth/profile/')
        print(f"Profile API status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Profile API is working!")
            print(f"User statistics: {data.get('total_documents_saved', 'N/A')}")
        else:
            print(f"❌ Profile API error: {response.content}")
            
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        return False
    
    return True

if __name__ == '__main__':
    success = deploy_migration()
    if success:
        print("\n🎉 User statistics migration completed successfully!")
        print("Your user statistics should now work properly.")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")
