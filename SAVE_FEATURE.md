# Save to Lists Feature

## ✅ What's Been Added

### 1. Database Schema

- Added `saved_items` table to store user's favorite activities, hotels, and restaurants
- Includes: userId, itemType, itemData (full item), conversationId, createdAt

### 2. API Routes (`/api/saved-items`)

- **GET**: Fetch all saved items (with optional type filter)
- **POST**: Save a new item
- **DELETE**: Remove a saved item

### 3. UI Components

Updated all cards with heart icons:

- **ActivityCard**: Save/unsave activities with ❤️
- **HotelCard**: Save/unsave hotels with ❤️
- **RestaurantCard**: Save/unsave restaurants with ❤️

### 4. Pages

- **Recommendations Page**: Heart icons on all cards to save items
- **Saved Items Page** (`/saved`): View all saved items with:
  - Stats dashboard (total, activities, hotels, restaurants)
  - Filter by type (all, activities, hotels, restaurants)
  - Grid view of all saved items
  - Ability to unsave items

### 5. Navigation

- Added "Saved Items" link to navbar with heart icon

## 🎯 How to Use

1. **Save an Item**:

   - Go to the recommendations page
   - Click the heart icon on any activity, hotel, or restaurant
   - Heart fills with red color when saved

2. **View Saved Items**:

   - Click "Saved Items" in the navbar
   - See all your saved items in one place
   - Use filters to view specific types

3. **Unsave an Item**:
   - Click the filled red heart on any saved card
   - Item is removed from your saved list

## 🚀 Try It Out

1. Visit `/recommendations` or get recommendations from a conversation
2. Click heart icons to save items you like
3. Visit `/saved` to see all your saved items
4. Filter by activity, hotel, or restaurant
5. Click hearts again to remove items

## 📊 Features

- ✅ Real-time save/unsave with visual feedback
- ✅ Persists to database (survives page refresh)
- ✅ Per-user saved lists (only you can see your saves)
- ✅ Stats and counts
- ✅ Type filtering
- ✅ Responsive grid layout
- ✅ Empty state messaging
- ✅ Loading states
