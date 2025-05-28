
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface BookingData {
  ground_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
}

export interface GroundAvailability {
  ground_id: string;
  date: string;
  available_slots: string[];
  unavailable_slots: string[];
}

class APIIntegrationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = window.location.origin;
  }

  // Generic API call handler
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'API request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Integration Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Check ground availability for external platforms
  async checkGroundAvailability(
    groundId: string,
    date: string
  ): Promise<APIResponse<GroundAvailability>> {
    return this.makeRequest<GroundAvailability>(
      `/grounds/${groundId}/availability?date=${date}`
    );
  }

  // Sync booking with external platforms
  async syncBooking(bookingData: BookingData): Promise<APIResponse> {
    return this.makeRequest('/bookings/sync', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  // Get external platform status
  async getIntegrationStatus(): Promise<APIResponse<{ platforms: string[] }>> {
    return this.makeRequest('/integrations/status');
  }

  // Webhook handler for external platform updates
  async handleWebhook(platform: string, data: any): Promise<APIResponse> {
    return this.makeRequest(`/webhooks/${platform}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiIntegration = new APIIntegrationService();
