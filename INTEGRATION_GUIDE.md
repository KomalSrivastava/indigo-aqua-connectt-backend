# Customer Support Dashboard - Integration Guide

This guide explains how the React frontend integrates with the ASP.NET Core backend for the customer support system.

## Architecture Overview

```
┌─────────────────┐    HTTP/HTTPS    ┌──────────────────┐
│   React App     │ ◄──────────────► │  ASP.NET Core    │
│   (Frontend)    │                  │   (Backend)      │
└─────────────────┘                  └──────────────────┘
         │                                    │
         │ WebSocket/SignalR                  │
         │ (Real-time)                        │
         ▼                                    ▼
┌─────────────────┐                  ┌──────────────────┐
│   Twilio JS     │                  │   Twilio API     │
│   (Browser)     │                  │   (Webhooks)     │
└─────────────────┘                  └──────────────────┘
```

## Frontend-Backend Integration

### 1. API Communication

The frontend communicates with the backend through REST API calls using the `apiClient` in `src/lib/api.ts`:

```typescript
// Example: Get customer by phone number
const customer = await apiClient.getCustomerByPhone('+1234567890');

// Example: Log a call
await apiClient.logCall({
  phone: '+1234567890',
  status: 'completed',
  duration: '300',
  agentId: 'agent001'
});
```

### 2. Real-time Communication

SignalR provides real-time communication between frontend and backend:

```typescript
// Frontend connects to SignalR hub
signalRClient.connect({
  onIncomingCall: (incomingCall) => {
    // Handle incoming call notification
  },
  onCallStatusUpdate: (callSid, status) => {
    // Handle call status updates
  }
});
```

### 3. Call Flow Integration

#### Incoming Call Flow:

1. **Twilio Webhook** → Backend (`POST /api/incomingcall`)
2. **Backend** → SignalR → Frontend (real-time notification)
3. **Frontend** → Backend (`GET /api/customers?phone=...`) - Lookup customer
4. **Frontend** displays customer information and call interface
5. **Agent answers** → Frontend → Backend (call status update)
6. **Call ends** → Frontend → Backend (`POST /api/calllogs/log-call`)

## Key Integration Points

### 1. Customer Lookup

When a call comes in, the system automatically looks up the customer:

```typescript
// In useCallManager hook
const handleIncomingCall = async (incomingCall: IncomingCall) => {
  // Look up customer information
  const customer = await lookupCustomer(incomingCall.from);
  
  // Update UI with customer details
  setCallState(prev => ({
    ...prev,
    customer
  }));
};
```

### 2. Call Logging

After each call, the system logs the interaction:

```typescript
// In useCallManager hook
const handleCallEnd = async (notes?: string) => {
  const callData: CreateCallLogRequest = {
    phone: callState.currentCall.from,
    status: 'completed',
    duration: callState.callDuration.toString(),
    notes,
    agentId: callState.agentId,
    callSid: callState.currentCall.callSid,
    customerId: callState.customer?.id
  };

  await logCall(callData);
};
```

### 3. Real-time Updates

The SignalR connection provides live updates:

```typescript
// Backend sends notification
await _callHub.Clients.All.SendAsync("IncomingCall", incomingCallDto);

// Frontend receives notification
onIncomingCall: async (incomingCall) => {
  await handleIncomingCall(incomingCall);
}
```

## API Endpoints Used by Frontend

### Customer Management
- `GET /api/customers?phone={phone}` - Lookup customer by phone
- `GET /api/customers/all` - Get all customers (for admin views)
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer information

### Call Management
- `POST /api/calllogs/log-call` - Log completed calls
- `GET /api/calllogs` - Get call history
- `GET /api/calllogs/by-phone?phone={phone}` - Get calls for specific customer

### Testing
- `POST /api/incomingcall/test` - Simulate incoming calls for testing

## React Components Integration

### 1. CallInterface Component

The main call interface component (`src/components/CallInterface.tsx`) provides:

- Real-time call status display
- Customer information display
- Call controls (answer, reject, end)
- Call duration tracking
- Notes input for call logging

### 2. useCallManager Hook

The custom hook (`src/hooks/useCallManager.ts`) manages:

- SignalR connection
- Call state management
- API communication
- Customer lookup
- Call logging

### 3. Updated Index Page

The main dashboard (`src/pages/Index.tsx`) now includes:

- Real-time call interface
- Customer information panel
- System status indicators
- Call simulation tools

## Configuration

### Backend URL

Update the API base URL in `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'https://localhost:7001/api'; // Development
// const API_BASE_URL = 'https://your-production-api.com/api'; // Production
```

### CORS Configuration

The backend is configured to allow requests from common React development ports:

```csharp
// In Program.cs
options.AddPolicy("AllowReactApp", policy =>
{
    policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:4173")
          .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
});
```

## Testing the Integration

### 1. Start Both Applications

```bash
# Terminal 1 - Backend
cd backend
dotnet run

# Terminal 2 - Frontend
npm run dev
```

### 2. Test Incoming Calls

Use the simulation buttons in the React interface or make API calls:

```bash
curl -X POST https://localhost:7001/api/incomingcall/test \
  -H "Content-Type: application/json" \
  -d '{"from": "+1234567890", "to": "+1987654321"}'
```

### 3. Verify Customer Lookup

The system includes sample customers:
- John Doe: +1234567890
- Jane Smith: +1987654321
- Bob Johnson: +1555123456

## Error Handling

### Frontend Error Handling

```typescript
// API calls include error handling
try {
  const customer = await apiClient.getCustomerByPhone(phone);
  return customer;
} catch (error) {
  console.error('Error looking up customer:', error);
  toast.error('Failed to lookup customer');
  return null;
}
```

### Backend Error Handling

```csharp
// Controllers include proper error responses
public async Task<ActionResult<CustomerDto>> GetCustomerByPhone([FromQuery] string phone)
{
    if (string.IsNullOrWhiteSpace(phone))
    {
        return BadRequest("Phone number is required");
    }

    var customer = await _customerService.GetCustomerByPhoneAsync(phone);
    if (customer == null)
    {
        return NotFound($"Customer with phone {phone} not found");
    }

    return Ok(customer);
}
```

## Future Enhancements

### 1. Twilio JS SDK Integration

Replace the mock call handling with actual Twilio JS SDK:

```typescript
// TODO: Implement actual Twilio JS integration
import { Device } from 'twilio-client';

const device = new Device(token);
device.on('incoming', (call) => {
  // Handle real incoming call
});
```

### 2. Voice Conversion

The placeholder for accent conversion is ready for implementation:

```typescript
// Future implementation
const convertedAudio = await apiClient.convertAccent(
  audioData,
  'Indian',
  'American'
);
```

### 3. Authentication

Add authentication to secure the API:

```typescript
// Add auth headers to API calls
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS policy includes frontend URL
2. **SignalR Connection**: Check hub URL and connection status
3. **API Errors**: Verify backend is running and accessible
4. **Database Issues**: Ensure database is created and seeded

### Debug Tools

- **Swagger UI**: https://localhost:7001/swagger
- **Browser DevTools**: Check Network tab for API calls
- **Console Logs**: Both frontend and backend provide detailed logging

## Production Deployment

### Frontend Build

```bash
npm run build
```

### Backend Deployment

```bash
dotnet publish -c Release
```

### Environment Variables

Update configuration for production:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-production-connection-string"
  },
  "CORS": {
    "AllowedOrigins": ["https://your-production-domain.com"]
  }
}
``` 