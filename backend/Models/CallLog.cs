using System.ComponentModel.DataAnnotations;

namespace CustomerSupportAPI.Models
{
    public class CallLog
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty; // "incoming", "outgoing", "completed", "missed", "failed"
        
        public TimeSpan? Duration { get; set; }
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public string? AgentId { get; set; }
        
        public string? CallSid { get; set; } // Twilio Call SID
        
        // Foreign key for Customer
        public int? CustomerId { get; set; }
        public virtual Customer? Customer { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 