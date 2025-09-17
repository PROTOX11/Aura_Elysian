# Custom Order Feature Implementation

## Completed Tasks
- [x] Create CustomOrder Mongoose model with optional fields (userId, image, description, referenceLink, createdAt)
- [x] Add backend API route POST /api/custom-orders with image upload support
- [x] Create CustomOrderPage.tsx component with form for image upload, description, and reference link
- [x] Update App.tsx to route /custom to CustomOrderPage instead of ProductsPage
- [x] Ensure all fields are optional as requested
- [x] Include promise message about lower prices than others

## Backend Changes
- server/models/CustomOrder.js: New model for custom orders
- server/server.js: Added import for CustomOrder and POST /api/custom-orders route

## Frontend Changes
- src/pages/CustomOrderPage.tsx: New page component with form and submission logic
- src/App.tsx: Updated route for /custom to use CustomOrderPage

## Features Implemented
- Image upload (optional)
- Description textarea (optional)
- Reference link input (optional)
- Form submission to backend API
- Success/error messaging
- Responsive design with Tailwind CSS
- Separate from candles and other product routes as requested

## Testing
- Form can be submitted with any combination of fields (all optional)
- Image upload works via multer
- Data saved to MongoDB CustomOrder collection
- Page accessible at http://localhost:4000/custom
