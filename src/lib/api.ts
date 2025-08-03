// API client for communicating with the ASP.NET Core backend

const API_BASE_URL = 'https://localhost:7001/api';

// Types for API responses
export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CallLog {
  id: number;
  phone: string;
  timestamp: string;
  status: string;
  duration?: string;
  notes?: string;
  agentId?: string;
  callSid?: string;
  customerId?: number;
  customer?: Customer;
  createdAt: string;
}

export interface IncomingCall {
  from: string;
  to: string;
  callSid: string;
  direction: string;
  timestamp: string;
}

export interface CreateCallLogRequest {
  phone: string;
  status: string;
  duration?: string;
  notes?: string;
  agentId?: string;
  callSid?: string;
  customerId?: number;
}

// API client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Customer API methods
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    try {
      return await this.request<Customer>(`/customers?phone=${encodeURIComponent(phone)}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null; // Customer not found
      }
      throw error;
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await this.request<Customer[]>('/customers/all');
  }

  async getCustomerById(id: number): Promise<Customer> {
    return await this.request<Customer>(`/customers/${id}`);
  }

  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    return await this.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer> {
    return await this.request<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCustomer(id: number): Promise<void> {
    await this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Call Log API methods
  async logCall(callLog: CreateCallLogRequest): Promise<CallLog> {
    return await this.request<CallLog>('/calllogs/log-call', {
      method: 'POST',
      body: JSON.stringify(callLog),
    });
  }

  async getCallLogsByPhone(phone: string): Promise<CallLog[]> {
    return await this.request<CallLog[]>(`/calllogs/by-phone?phone=${encodeURIComponent(phone)}`);
  }

  async getAllCallLogs(page?: number, pageSize?: number): Promise<CallLog[]> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    
    return await this.request<CallLog[]>(`/calllogs?${params.toString()}`);
  }

  async getCallLogById(id: number): Promise<CallLog> {
    return await this.request<CallLog>(`/calllogs/${id}`);
  }

  async updateCallLog(id: number, updates: Partial<CallLog>): Promise<CallLog> {
    return await this.request<CallLog>(`/calllogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCallLog(id: number): Promise<void> {
    await this.request(`/calllogs/${id}`, {
      method: 'DELETE',
    });
  }

  // Test incoming call (for development)
  async testIncomingCall(from: string, to: string): Promise<any> {
    return await this.request('/incomingcall/test', {
      method: 'POST',
      body: JSON.stringify({ from, to }),
    });
  }

  // Voice conversion API methods (placeholder)
  async convertAccent(audioData: string, sourceAccent: string = 'Indian', targetAccent: string = 'American'): Promise<any> {
    return await this.request('/voiceconversion/convert-accent', {
      method: 'POST',
      body: JSON.stringify({
        audioData,
        sourceAccent,
        targetAccent,
      }),
    });
  }

  async getSupportedConversionTypes(): Promise<any> {
    return await this.request('/voiceconversion/supported-types');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { Customer, CallLog, IncomingCall, CreateCallLogRequest }; 