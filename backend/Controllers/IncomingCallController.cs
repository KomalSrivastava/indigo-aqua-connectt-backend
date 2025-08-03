using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using CustomerSupportAPI.Services;
using CustomerSupportAPI.DTOs;
using CustomerSupportAPI.Hubs;

namespace CustomerSupportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomingCallController : ControllerBase
    {
        private readonly ICallLogService _callLogService;
        private readonly ICustomerService _customerService;
        private readonly IHubContext<CallHub> _callHub;

        public IncomingCallController(
            ICallLogService callLogService,
            ICustomerService customerService,
            IHubContext<CallHub> callHub)
        {
            _callLogService = callLogService;
            _customerService = customerService;
            _callHub = callHub;
        }

        /// <summary>
        /// Handle incoming call webhook from Twilio
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> HandleIncomingCall([FromForm] TwilioWebhookRequest request)
        {
            try
            {
                var from = request.From ?? string.Empty;
                var to = request.To ?? string.Empty;
                var callSid = request.CallSid ?? string.Empty;
                var direction = request.Direction ?? "inbound";

                // Create incoming call DTO
                var incomingCallDto = new IncomingCallDto
                {
                    From = from,
                    To = to,
                    CallSid = callSid,
                    Direction = direction,
                    Timestamp = DateTime.UtcNow
                };

                // Log the incoming call
                var callLog = await _callLogService.LogIncomingCallAsync(incomingCallDto);

                // Notify all connected agents via SignalR
                await _callHub.Clients.All.SendAsync("IncomingCall", incomingCallDto);

                // Return simple response for now
                return Ok(new { 
                    success = true, 
                    message = "Incoming call logged and agents notified",
                    callLog = callLog
                });
            }
            catch (Exception ex)
            {
                // Log the error
                Console.WriteLine($"Error handling incoming call: {ex.Message}");
                
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Handle call status webhook from Twilio (call completed, failed, etc.)
        /// </summary>
        [HttpPost("status")]
        public async Task<IActionResult> HandleCallStatus([FromForm] TwilioWebhookRequest request)
        {
            try
            {
                var callSid = request.CallSid ?? string.Empty;
                var callStatus = request.CallStatus ?? string.Empty;
                var callDuration = request.CallDuration;

                // Parse duration if available
                TimeSpan? duration = null;
                if (!string.IsNullOrEmpty(callDuration) && int.TryParse(callDuration, out var durationSeconds))
                {
                    duration = TimeSpan.FromSeconds(durationSeconds);
                }

                // Update call status in database
                var callLog = await _callLogService.UpdateCallStatusAsync(callSid, callStatus, duration);

                if (callLog != null)
                {
                    // Notify agents about call status update
                    await _callHub.Clients.All.SendAsync("CallStatusUpdate", callSid, callStatus);
                }

                return Ok(new { success = true, callSid, status = callStatus });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error handling call status: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Test endpoint to simulate incoming call (for development/testing)
        /// </summary>
        [HttpPost("test")]
        public async Task<IActionResult> TestIncomingCall([FromBody] TestIncomingCallDto testDto)
        {
            try
            {
                var incomingCallDto = new IncomingCallDto
                {
                    From = testDto.From,
                    To = testDto.To,
                    CallSid = $"test_{Guid.NewGuid()}",
                    Direction = "inbound",
                    Timestamp = DateTime.UtcNow
                };

                // Log the test call
                var callLog = await _callLogService.LogIncomingCallAsync(incomingCallDto);

                // Notify all connected agents
                await _callHub.Clients.All.SendAsync("IncomingCall", incomingCallDto);

                return Ok(new { 
                    success = true, 
                    callLog = callLog,
                    message = "Test incoming call logged and agents notified"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class TwilioWebhookRequest
    {
        public string? From { get; set; }
        public string? To { get; set; }
        public string? CallSid { get; set; }
        public string? Direction { get; set; }
        public string? CallStatus { get; set; }
        public string? CallDuration { get; set; }
    }

    public class TestIncomingCallDto
    {
        public string From { get; set; } = string.Empty;
        public string To { get; set; } = string.Empty;
    }
} 