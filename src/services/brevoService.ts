const BREVO_API_KEY = 'DtOHmZrcURpYk3Gb';
const BREVO_API_URL = 'https://api.brevo.com/v3';

export interface BrevoSubscriptionResponse {
  success: boolean;
  message: string;
}

export interface BrevoErrorResponse {
  code: string;
  message: string;
}

export const brevoService = {
  /**
   * Subscribe an email to Brevo contacts list
   * @param email - The email address to subscribe
   * @returns Promise with subscription result
   */
  async subscribeEmail(email: string): Promise<BrevoSubscriptionResponse> {
    try {
      const response = await fetch(`${BREVO_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: email,
          attributes: {
            SIGNUP_DATE: new Date().toISOString(),
            SIGNUP_SOURCE: 'Website Newsletter',
          },
          listIds: [1], // Default list ID - you may need to adjust this based on your Brevo setup
          updateEnabled: true, // Update existing contacts
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific Brevo error responses
        if (data.code === 'duplicate_parameter') {
          return {
            success: true,
            message: 'Email already subscribed! You\'re already in our newsletter.',
          };
        }
        
        throw new Error(data.message || 'Failed to subscribe email');
      }

      return {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
      };
    } catch (error) {
      console.error('Brevo subscription error:', error);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      };
    }
  },

  /**
   * Get contact information from Brevo
   * @param email - The email address to check
   * @returns Promise with contact info
   */
  async getContactInfo(email: string) {
    try {
      const response = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'api-key': BREVO_API_KEY,
        },
      });

      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      return null;
    }
  },
};
