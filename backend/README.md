# Customer Support API - ASP.NET Core Backend

This is the backend API for the Customer Support Dashboard, built with ASP.NET Core 8.0, Entity Framework Core, and SignalR for real-time communication.

## Features

- **Customer Management**: CRUD operations for customer data
- **Call Logging**: Track all incoming and outgoing calls
- **Real-time Notifications**: SignalR integration for live call updates
- **Twilio Integration**: Webhook handling for incoming calls
- **Voice Conversion**: Placeholder for future accent conversion feature
- **Database**: SQLite for development (easily switchable to SQL Server)

## Prerequisites

- .NET 8.0 SDK
- Visual Studio 2022 or VS Code
- SQLite (included) or SQL Server

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
dotnet restore
```

### 2. Configure Database

The application uses SQLite by default. The database will be created automatically when you run the application.

To use SQL Server instead, update `Program.cs`:

```csharp
// Comment out SQLite
// options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? 
//                  "Data Source=CustomerSupport.db");

// Uncomment SQL Server
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
```

And update `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CustomerSupport;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### 3. Configure Twilio (Optional)

Update `appsettings.json` with your Twilio credentials:

```json
{
  "Twilio": {
    "AccountSid": "your_account_sid_here",
    "AuthToken": "your_auth_token_here",
    "PhoneNumber": "your_twilio_phone_number_here"
  }
}
```

### 4. Run the Application

```bash
dotnet run
```

The API will be available at:
- **API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger
- **SignalR Hub**: https://localhost:7001/callHub

## API Endpoints

### Customers
- `GET /api/customers?phone={phone}` - Get customer by phone number
- `GET /api/customers/all` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Call Logs
- `POST /api/calllogs/log-call` - Log a new call
- `GET /api/calllogs` - Get all call logs (with pagination)
- `GET /api/calllogs/by-phone?phone={phone}` - Get calls by phone number
- `GET /api/calllogs/{id}` - Get call log by ID
- `PUT /api/calllogs/{id}` - Update call log
- `DELETE /api/calllogs/{id}` - Delete call log

### Incoming Calls
- `POST /api/incomingcall` - Handle Twilio webhook for incoming calls
- `POST /api/incomingcall/status` - Handle call status updates
- `POST /api/incomingcall/test` - Test incoming call (development)

### Voice Conversion
- `POST /api/voiceconversion/convert-accent` - Placeholder for accent conversion
- `GET /api/voiceconversion/supported-types` - Get supported conversion types
- `GET /api/voiceconversion/health` - Health check

## SignalR Hub

The SignalR hub (`/callHub`) provides real-time communication:

### Client Methods (Server → Client)
- `IncomingCall` - Notify about new incoming call
- `CallStatusUpdate` - Notify about call status changes
- `AgentRegistered` - Confirm agent registration

### Server Methods (Client → Server)
- `RegisterAgent` - Register an agent for notifications

## Database Schema

### Customers Table
```sql
CREATE TABLE Customers (
    Id INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    Phone TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT
);
```

### CallLogs Table
```sql
CREATE TABLE CallLogs (
    Id INTEGER PRIMARY KEY,
    Phone TEXT NOT NULL,
    Timestamp TEXT NOT NULL,
    Status TEXT NOT NULL,
    Duration TEXT,
    Notes TEXT,
    AgentId TEXT,
    CallSid TEXT,
    CustomerId INTEGER,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (CustomerId) REFERENCES Customers(Id)
);
```

## Development

### Testing Incoming Calls

Use the test endpoint to simulate incoming calls:

```bash
curl -X POST https://localhost:7001/api/incomingcall/test \
  -H "Content-Type: application/json" \
  -d '{"from": "+1234567890", "to": "+1987654321"}'
```

### Sample Data

The application includes sample data:
- John Doe: +1234567890
- Jane Smith: +1987654321
- Bob Johnson: +1555123456

## Production Deployment

1. **Database**: Use SQL Server or PostgreSQL for production
2. **HTTPS**: Ensure HTTPS is properly configured
3. **CORS**: Update CORS policy for production domains
4. **Twilio**: Configure webhook URLs in Twilio console
5. **Logging**: Configure proper logging for production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the React app URL is in the CORS policy
2. **Database Errors**: Check connection string and ensure database exists
3. **SignalR Connection**: Verify the hub URL is correct in the frontend
4. **Twilio Webhooks**: Ensure the webhook URL is publicly accessible

### Logs

Check the console output for detailed logs. In development, Entity Framework queries are logged.

## Next Steps

1. Implement actual Twilio JS SDK integration in the frontend
2. Add accent conversion functionality
3. Implement call recording and transcription
4. Add authentication and authorization
5. Implement call queuing and routing
6. Add analytics and reporting features 