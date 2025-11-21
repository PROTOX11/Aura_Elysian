# Brevo Email Integration Setup

## Overview
This project now includes Brevo email subscription integration for the "Stay in the Loop" newsletter signup in the footer.

## Features Implemented
- ✅ Email subscription via Brevo API
- ✅ Success/Error feedback messages
- ✅ Duplicate email handling
- ✅ Loading states during subscription
- ✅ Auto-hide status messages after 5 seconds

## Configuration

### API Key
The Brevo API key is currently hardcoded in `src/services/brevoService.ts`:
```typescript
const BREVO_API_KEY = 'DtOHmZrcURpYk3Gb';
```

### List Configuration
The service is configured to add contacts to list ID `1`. You may need to adjust this based on your Brevo account setup.

## How It Works

1. **User enters email** in the "Stay in the Loop" section
2. **Clicks Subscribe** button
3. **API call** is made to Brevo's `/v3/contacts` endpoint
4. **Success/Error message** is displayed to the user
5. **Email is cleared** on successful subscription

## API Endpoints Used
- `POST https://api.brevo.com/v3/contacts` - Add/update contact
- `GET https://api.brevo.com/v3/contacts/{email}` - Get contact info (for future use)

## Error Handling
- Duplicate emails are handled gracefully
- Network errors are caught and displayed
- Loading states prevent multiple submissions

## Future Enhancements
- Move API key to environment variables
- Add email validation
- Implement double opt-in if required by Brevo
- Add analytics tracking for subscription events

## Testing
To test the integration:
1. Start your development server
2. Navigate to the footer section
3. Enter a valid email address
4. Click Subscribe
5. Check your Brevo dashboard for the new contact

## Managing Subscribers

### Where to Find Subscribed Emails
1. **Log into Brevo**: Go to [app.brevo.com](https://app.brevo.com)
2. **Go to Contacts**: Click "Contacts" in the left sidebar
3. **View All Contacts**: You'll see all subscribers with:
   - Email address
   - Subscription date
   - Source ("Website Newsletter")
   - Contact status

### Sending Email Campaigns
1. **Create Campaign**: Go to "Campaigns" → "Create an email campaign"
2. **Choose Recipients**: Select all contacts or specific lists
3. **Design Email**: Use Brevo's email builder
4. **Send**: Schedule or send immediately

### Organizing Contacts
- **Lists**: Create different lists (Newsletter, VIP, etc.)
- **Segments**: Group contacts by attributes
- **Tags**: Add custom tags for better organization

## Troubleshooting

### 401 Unauthorized Error
If you're getting a 401 error, try these steps:

1. **Verify API Key**: 
   - Log into your Brevo account
   - Go to SMTP & API settings
   - Generate a new API key
   - Update the key in `src/services/brevoService.ts`

2. **Check API Key Permissions**:
   - Ensure your API key has "Contacts" permissions
   - Make sure it's not expired or revoked

3. **Test API Key**:
   - Open browser console
   - Run: `brevoService.testApiKey()`
   - Check the response

4. **Domain Authentication**:
   - Verify your domain is authenticated in Brevo
   - Check sender domain settings

5. **IP Whitelisting**:
   - Add your server's IP to Brevo's whitelist
   - For development, this might not be necessary

### Common Issues
- **Invalid API Key**: Generate a new one from Brevo dashboard
- **Missing Permissions**: Ensure API key has contact management access
- **Network Issues**: Check if your server can reach Brevo's API
- **Rate Limiting**: Brevo has API rate limits - check if you've exceeded them
