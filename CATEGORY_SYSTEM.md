# Dynamic Goal Category System

## Overview

This app uses a **metadata-driven, dynamic category system** where goal categories are:
- Stored in the database
- Fetched from the backend API
- Rendered dynamically on the frontend
- Fully configurable without code changes

## Architecture

### Backend

#### 1. GoalCategory Model (`backend/models/GoalCategory.js`)
Defines the category schema with:
- `id`: unique identifier (e.g., "savings", "travel")
- `label`: display name
- `icon`: emoji/icon
- `accent`: emotional color (emerald, cyan, amber, violet, rose)
- `mood`: emotional mood (calm-growth, focused-clarity, etc.)
- `emotionalTheme`: maps to emotion system (savings, investments, goals, analytics, expenses)
- `order`: sort order
- `isActive`: enable/disable categories

#### 2. Meta API Endpoint (`backend/routes/meta.js`)
```
GET /api/meta/goal-categories
```
Returns all active categories with metadata. **Public endpoint, cacheable.**

#### 3. Dynamic Validation Middleware (`backend/routes/goals.js`)
- No hardcoded enum on Goal schema
- Middleware validates category against GoalCategory collection
- Prevents invalid categories before save
- Returns meaningful error messages

### Frontend

#### 1. useGoalCategories Hook (`src/hooks/useGoalCategories.js`)
Handles:
- Fetching categories from `/api/meta/goal-categories`
- Caching in sessionStorage (5 min TTL)
- Fallback to stale cache if API fails
- Validation functions: `validateCategory(id)`, `getCategoryById(id)`
- Logging for debugging

#### 2. Goals.jsx Component (`src/pages/Goals.jsx`)
- Uses `useGoalCategories()` hook
- Renders category dropdown dynamically
- Validates against fetched categories
- Shows loading states while categories load
- Graceful fallback if categories unavailable

## Setup & Deployment

### 1. Seed Initial Categories

Run this ONCE after deploying to set up the database:

```bash
node backend/seeds/seedGoalCategories.js
```

This inserts 9 default categories:
- Savings, Travel, Education, Home, Vehicle, Investment, Retirement, Emergency Fund, Other

### 2. Verify Categories Exist

Check MongoDB:
```bash
db.goalcategories.find()
```

Or test API endpoint:
```bash
curl https://yourapp.com/api/meta/goal-categories
```

### 3. Environment Setup

Ensure `MONGODB_URI` is set in production for category persistence.

## How It Works

### Creating a Goal

```
1. Frontend loads
2. useGoalCategories hook fetches from /api/meta/goal-categories
3. Categories cached in sessionStorage
4. Goal form renders with dynamic dropdown
5. User selects category and submits
6. Frontend validates selected category against fetched list
7. POST /api/goals with valid category ID
8. Backend middleware validates category exists in DB
9. Goal saved if category valid, error returned if not
```

### Adding New Categories

#### Option 1: Database Direct
```javascript
db.goalcategories.insertOne({
  id: "cryptocurrency",
  label: "Crypto Investing",
  icon: "₿",
  accent: "cyan",
  mood: "focused-clarity",
  emotionalTheme: "investments",
  order: 10,
  isActive: true
})
```

#### Option 2: Create Admin API (Future)
Create `POST /api/admin/categories` endpoint to add categories dynamically via UI.

### Disabling Categories

Set `isActive: false` to hide from frontend without deleting:
```javascript
db.goalcategories.updateOne(
  { id: "travel" },
  { $set: { isActive: false } }
)
```

## Data Flow

```
User Creates Goal
    ↓
Frontend fetches /api/meta/goal-categories (cached)
    ↓
Form renders dynamic dropdown from categories
    ↓
User selects category and submits
    ↓
Frontend validates: validateCategory(selectedId)
    ↓
POST /api/goals with { category: selectedId, ... }
    ↓
Backend middleware: validateCategoryExists
    ↓
Lookup GoalCategory.findOne({ id, isActive: true })
    ↓
If found → Save goal with valid category
If not found → Return 400 error with message
    ↓
Goal saved to database
```

## Benefits Over Hardcoded Enums

| Before | After |
|--------|-------|
| Categories hardcoded in 2+ places | Single source of truth (database) |
| Frontend/backend mismatch possible | Impossible mismatch - all from API |
| New category = code + deploy | New category = DB insert, instant |
| No metadata support | Full metadata (icons, colors, moods) |
| Static validation | Dynamic validation |
| No admin control | Admin can enable/disable at runtime |

## Debugging

### Check Cached Categories
In browser console:
```javascript
JSON.parse(sessionStorage.getItem('goalCategories'))
```

### Clear Category Cache
```javascript
sessionStorage.removeItem('goalCategories')
// App will refetch on next load
```

### Monitor Category Fetch
Categories hook logs:
```
✅ Loaded 9 goal categories from API
Available categories: savings, travel, education, ...
```

### Test Meta API
```bash
curl -X GET https://yourapp.com/api/meta/goal-categories
```

## Future Enhancements

1. **Category Icons & Emojis**
   - Already supported in metadata
   - Display in dropdown and goal cards

2. **Emotional Theme Integration**
   - Use `emotionalTheme` to apply colors/glows to goals
   - Render goal cards with category's accent color

3. **Analytics by Category**
   - Group spending/goals by category
   - Category-specific insights

4. **Admin Dashboard**
   - CRUD interface for categories
   - Enable/disable, reorder, customize metadata

5. **Multi-tenancy**
   - Custom categories per organization
   - Shared vs. custom category support

## Migration Notes

This system replaces the old hardcoded enum approach:
- **Old**: `enum: ['Travel', 'Education', ...]` in Goal.js
- **New**: Dynamic validation against GoalCategory collection

Migration steps:
1. Deploy code
2. Run seed script: `node backend/seeds/seedGoalCategories.js`
3. Frontend automatically fetches from new API
4. No data migration needed (categories auto-created)

## Architecture Principles

✓ **Single Source of Truth**: Database is authoritative
✓ **No Duplication**: Categories defined once, used everywhere
✓ **Scalable**: Add categories without code changes
✓ **Resilient**: Frontend caching + fallbacks prevent breaking
✓ **Metadata-Rich**: Full support for icons, colors, moods, themes
✓ **Production-Grade**: Proper validation, error handling, logging
✓ **Future-Proof**: Admin can modify categories at runtime
