namespace CustomerSupportAPI.DTOs
{
    public class CallLogDto
    {
        public int Id { get; set; }
        public string Phone { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Status { get; set; } = string.Empty;
        public TimeSpan? Duration { get; set; }
        public string? Notes { get; set; }
        public string? AgentId { get; set; }
        public string? CallSid { get; set; }
        public int? CustomerId { get; set; }
        public CustomerDto? Customer { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateCallLogDto
    {
        public string Phone { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public TimeSpan? Duration { get; set; }
        public string? Notes { get; set; }
        public string? AgentId { get; set; }
        public string? CallSid { get; set; }
        public int? CustomerId { get; set; }
    }

    public class UpdateCallLogDto
    {
        public string? Status { get; set; }
        public TimeSpan? Duration { get; set; }
        public string? Notes { get; set; }
        public string? AgentId { get; set; }
    }

    public class IncomingCallDto
    {
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
        public string CallSid { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
} 