# Environment Variables Setup

This document explains how to set up environment variables for the Aura Elysian server.

## Required Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Brevo API Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_API_URL=https://api.brevo.com/v3

# MongoDB Configuration
MONGO_URI=your_mongodb_connection_string_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server Port
PORT=5000
```

## Frontend Environment Variables

For the frontend (Vite), create a `.env` file in the root directory with:

```env
# Brevo API Configuration (for frontend)
VITE_BREVO_API_KEY=your_brevo_api_key_here
VITE_BREVO_API_URL=https://api.brevo.com/v3
```

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique values for JWT_SECRET in production
- Keep your API keys secure and rotate them regularly
- The `.env.example` file shows the required structure without sensitive values

## Getting Your Brevo API Key

1. Log in to your Brevo account
2. Go to Settings > API Keys
3. Create a new API key with appropriate permissions
4. Copy the key and add it to your `.env` file

## Getting Your MongoDB URI

1. Log in to MongoDB Atlas
2. Go to your cluster
3. Click "Connect" and select "Connect your application"
4. Copy the connection string and replace `<password>` with your actual password
5. Add the URI to your `.env` file
