const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_API_URL = import.meta.env.VITE_BREVO_API_URL || 'https://api.brevo.com/v3';

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
   * Test API key validity
   * @returns Promise with test result
   */
  async testApiKey(): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await fetch(`${BREVO_API_URL}/account`, {
        method: 'GET',
        headers: {
          'api-key': BREVO_API_KEY,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        return { valid: true, message: 'API key is valid' };
      } else {
        const data = await response.json();
        return {
          valid: false,
          message: `API key test failed: ${data.message || `HTTP ${response.status}`}`
        };
      }
    } catch (error) {
      return {
        valid: false,
        message: `API key test error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },
  /**
   * Subscribe an email to Brevo contacts list
   * @param email - The email address to subscribe
   * @returns Promise with subscription result
   */
  async subscribeEmail(email: string): Promise<BrevoSubscriptionResponse> {
    try {
      console.log('Attempting to subscribe email:', email);
      console.log('Using API key:', BREVO_API_KEY ? 'Present' : 'Missing');

      const response = await fetch(`${BREVO_API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          attributes: {
            SIGNUP_DATE: new Date().toISOString(),
            SIGNUP_SOURCE: 'Website Newsletter',
          },
          listIds: [], // Start with empty array - Brevo will add to default list
          updateEnabled: true, // Update existing contacts
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        // Handle specific Brevo error responses
        if (data.code === 'duplicate_parameter') {
          return {
            success: true,
            message: 'Email already subscribed! You\'re already in our newsletter.',
          };
        }

        if (response.status === 401) {
          return {
            success: false,
            message: 'API authentication failed. Please check your API key.',
          };
        }

        if (response.status === 400) {
          return {
            success: false,
            message: data.message || 'Invalid email address or request format.',
          };
        }
        
        throw new Error(data.message || `HTTP ${response.status}: Failed to subscribe email`);
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
