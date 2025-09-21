# User Activity Tracking System

## 🎯 Overview

Your React Native app now includes a comprehensive user activity tracking system that monitors and displays user engagement with document processing features. The system automatically tracks user actions and displays real-time statistics.

## 📊 Features Implemented

### ✅ **User Statistics Display**
- **Documents Saved**: Tracks when users upload/save documents
- **Documents Processed**: Tracks when documents are analyzed
- **Documents Shared**: Tracks when users share results
- **Sensitive Items Detected**: Counts detected sensitive information
- **Safe Items**: Counts non-sensitive items
- **Detection Accuracy**: Calculated percentage of detection accuracy

### ✅ **Automatic Counter Updates**
- **Document Upload**: Increments `total_documents_saved`
- **Document Processing**: Increments `total_documents_processed`
- **Document Sharing**: Increments `total_documents_shared`
- **Sensitive Detection**: Increments `total_sensitive_items_detected`
- **Safe Detection**: Increments `total_non_detected_items`

### ✅ **Real-time UI Updates**
- Statistics update immediately after user actions
- Clean, organized layout with color-coded cards
- Loading states and error handling
- Pull-to-refresh functionality
- Detection accuracy with color indicators

## 🏗️ Architecture

### **Services Created:**
1. **UserStatsService** (`app/services/UserStatsService.js`)
   - Handles all API calls to your Django backend
   - Manages authentication tokens
   - Provides error handling and retry logic

### **Components Created:**
2. **UserStats** (`app/components/UserStats.js`)
   - Reusable component for displaying user statistics
   - Clean UI with gradient cards and icons
   - Loading states and error handling
   - Pull-to-refresh functionality

### **Context Updates:**
3. **AuthContext** (Updated)
   - Added user stats state management
   - Provides increment functions for counters
   - Automatically loads stats when user authenticates

### **Screen Integrations:**
4. **HomeScreen** (Updated)
   - Increments counters during document processing
   - Updates detection counters based on results

5. **ProfileScreen** (Updated)
   - Displays UserStats component
   - Shows comprehensive user activity overview

6. **ResultScreen** (Updated)
   - Increments shared counter when users share results

## 🔌 API Integration

### **Backend Endpoints Used:**
- `GET /api/auth/profile/` - Fetches user data with activity counters
- `POST /api/documents/` - Upload document (increments saved counter)
- `PUT /api/documents/{id}/` - Update document (increments processed counter)
- `POST /api/detection/analyze/` - Analyze document (increments detection counters)

### **API Response Format:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "total_documents_saved": 15,
  "total_documents_processed": 12,
  "total_documents_shared": 3,
  "total_sensitive_items_detected": 25,
  "total_non_detected_items": 8,
  "detection_accuracy": 75.76
}
```

## 🎨 UI Components

### **UserStats Component Features:**
- **Header**: Title with refresh button
- **Documents Section**: Saved, Processed, Shared counters
- **Detection Section**: Sensitive items, Safe items, Accuracy
- **Summary Section**: Overall activity overview
- **Color Coding**: 
  - Green: High accuracy (≥80%)
  - Orange: Medium accuracy (60-79%)
  - Red: Low accuracy (<60%)

### **Visual Design:**
- Gradient cards with icons
- Shadow effects and elevation
- Theme-aware colors
- Responsive grid layout
- Loading and error states

## 🔄 How It Works

### **1. User Authentication**
- When user logs in, stats are automatically loaded
- Stats are stored in AuthContext for global access

### **2. Document Processing Flow**
```
User uploads document → incrementDocumentSaved()
↓
Document processed → incrementDocumentProcessed()
↓
Detection results → incrementSensitiveDetected() OR incrementNonDetected()
```

### **3. Document Sharing**
```
User shares result → incrementDocumentShared()
```

### **4. Real-time Updates**
- Counters update immediately in UI
- Backend is updated via API calls
- Stats persist across app sessions

## 🚀 Usage Examples

### **Accessing User Stats:**
```javascript
import { useAuth } from '../app/context/AuthContext';

const MyComponent = () => {
  const { userStats, loadUserStats } = useAuth();
  
  return (
    <View>
      <Text>Documents Saved: {userStats.total_documents_saved}</Text>
      <Text>Detection Accuracy: {userStats.detection_accuracy}%</Text>
    </View>
  );
};
```

### **Using UserStats Component:**
```javascript
import UserStats from '../app/components/UserStats';

const ProfileScreen = () => {
  return (
    <View>
      <UserStats />
    </View>
  );
};
```

### **Manual Counter Updates:**
```javascript
const { incrementDocumentSaved, incrementSensitiveDetected } = useAuth();

// When user saves a document
incrementDocumentSaved();

// When sensitive content is detected
incrementSensitiveDetected();
```

## 🛠️ Customization

### **Adding New Counters:**
1. Update `initialState` in AuthContext
2. Add new action type
3. Add increment function
4. Update UserStats component UI
5. Integrate in relevant screens

### **Modifying UI:**
- Edit `app/components/UserStats.js`
- Customize colors, layout, and styling
- Add new sections or cards

### **API Integration:**
- Update `UserStatsService.js` for new endpoints
- Modify error handling as needed
- Add new API methods

## 📱 User Experience

### **What Users See:**
1. **Profile Screen**: Comprehensive stats overview
2. **Real-time Updates**: Counters update immediately
3. **Visual Feedback**: Color-coded accuracy indicators
4. **Error Handling**: Graceful error messages
5. **Loading States**: Smooth loading animations

### **Benefits:**
- **Engagement**: Users can track their activity
- **Motivation**: Visual progress indicators
- **Insights**: Understanding of app usage
- **Gamification**: Achievement-like counters

## 🔧 Troubleshooting

### **Common Issues:**
1. **Stats not loading**: Check authentication status
2. **Counters not updating**: Verify API endpoints
3. **UI not refreshing**: Check pull-to-refresh implementation
4. **Error messages**: Review API response format

### **Debug Tips:**
- Check console logs for API errors
- Verify authentication tokens
- Test API endpoints with Postman
- Check network connectivity

## 🎉 Success Indicators

Your user activity tracking system is working when:
- ✅ User stats load on profile screen
- ✅ Counters increment during document processing
- ✅ Detection accuracy displays correctly
- ✅ Pull-to-refresh updates stats
- ✅ Error states show appropriate messages
- ✅ UI updates in real-time

The system is now fully integrated and ready to provide valuable insights into user engagement with your Protected Vision app! 🚀
