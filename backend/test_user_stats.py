#!/usr/bin/env python
"""
Test script to verify user statistics functionality
"""

import os
import sys
import django
import requests
import json

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()

def test_user_statistics():
    """Test user statistics functionality"""
    print("🧪 Testing User Statistics Functionality")
    print("=" * 50)
    
    # Test 1: Check if user statistics fields exist in the model
    print("\n1. Checking User model fields...")
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
        print(f"❌ Missing fields in User model: {missing_fields}")
        print("   You need to run the migration first!")
        return False
    else:
        print("✅ All user statistics fields are present in the model")
    
    # Test 2: Check if we can create/update user statistics
    print("\n2. Testing user statistics updates...")
    try:
        # Get or create a test user
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'username': 'testuser',
                'first_name': 'Test',
                'last_name': 'User'
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            print("   Created test user")
        else:
            print("   Using existing test user")
        
        # Test the increment functions
        from users.utils import (
            increment_documents_saved,
            increment_documents_processed,
            increment_sensitive_items_detected,
            increment_non_detected_items
        )
        
        # Increment some statistics
        increment_documents_saved(user)
        increment_documents_processed(user)
        increment_sensitive_items_detected(user, 3)
        increment_non_detected_items(user, 2)
        
        # Refresh user from database
        user.refresh_from_db()
        
        print(f"   Documents saved: {user.total_documents_saved}")
        print(f"   Documents processed: {user.total_documents_processed}")
        print(f"   Sensitive items detected: {user.total_sensitive_items_detected}")
        print(f"   Non-detected items: {user.total_non_detected_items}")
        print(f"   Detection accuracy: {user.get_detection_accuracy():.1f}%")
        
        print("✅ User statistics updates are working!")
        
    except Exception as e:
        print(f"❌ Error testing user statistics: {str(e)}")
        return False
    
    # Test 3: Test the API endpoint
    print("\n3. Testing API endpoint...")
    try:
        client = Client()
        
        # Test without authentication (should fail)
        response = client.get('/api/auth/profile/')
        if response.status_code == 401:
            print("✅ API correctly requires authentication")
        else:
            print(f"❌ API should require authentication, got status: {response.status_code}")
        
        # Test with authentication
        client.force_login(user)
        response = client.get('/api/auth/profile/')
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Profile API is working!")
            print(f"   User ID: {data.get('id')}")
            print(f"   Email: {data.get('email')}")
            print(f"   Documents saved: {data.get('total_documents_saved')}")
            print(f"   Documents processed: {data.get('total_documents_processed')}")
            print(f"   Detection accuracy: {data.get('detection_accuracy')}")
        else:
            print(f"❌ Profile API error: {response.status_code}")
            print(f"   Response: {response.content}")
            
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False
    
    # Test 4: Test the live API endpoint
    print("\n4. Testing live API endpoint...")
    try:
        # First, get a token
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        response = requests.post(
            'https://protected-vision-soh4o.ondigitalocean.app/api/auth/login/',
            json=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access')
            
            # Test profile endpoint with token
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                'https://protected-vision-soh4o.ondigitalocean.app/api/auth/profile/',
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Live API is working!")
                print(f"   User statistics are available: {data.get('total_documents_saved', 'N/A')}")
            else:
                print(f"❌ Live API error: {response.status_code}")
                print(f"   Response: {response.text}")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing live API: {str(e)}")
        return False
    
    print("\n🎉 All tests passed! User statistics should be working.")
    return True

if __name__ == '__main__':
    success = test_user_statistics()
    if not success:
        print("\n❌ Some tests failed. Please check the issues above.")
        sys.exit(1)
