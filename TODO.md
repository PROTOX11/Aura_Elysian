# Featured Collections Upload Fix

## Issue
Unable to upload featured collections from http://localhost:4000/team due to missing required `type` field

## Root Cause
- Backend schema requires `type` field with enum values: ['theme', 'festival', 'fragrance']
- Frontend form not including `type` field in submission
- Results in MongoDB validation error: "Path `type` is required"

## Plan
1. ✅ Add type selection dropdown to FeaturedCollectionsForm
2. ✅ Include selected type in form submission
3. ✅ Test the fix

## Files to Edit
- src/components/FeaturedCollectionsForm.tsx
