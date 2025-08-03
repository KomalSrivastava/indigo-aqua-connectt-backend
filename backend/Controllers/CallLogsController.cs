using Microsoft.AspNetCore.Mvc;
using CustomerSupportAPI.Services;
using CustomerSupportAPI.DTOs;

namespace CustomerSupportAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CallLogsController : ControllerBase
    {
        private readonly ICallLogService _callLogService;

        public CallLogsController(ICallLogService callLogService)
        {
            _callLogService = callLogService;
        }

        /// <summary>
        /// Log a new call - used by frontend after call ends
        /// </summary>
        [HttpPost("log-call")]
        public async Task<ActionResult<CallLogDto>> LogCall(CreateCallLogDto createDto)
        {
            try
            {
                var callLog = await _callLogService.CreateCallLogAsync(createDto);
                return CreatedAtAction(nameof(GetCallLogById), new { id = callLog.Id }, callLog);
            }
            catch (Exception ex)
            {
                return BadRequest($"Failed to log call: {ex.Message}");
            }
        }

        /// <summary>
        /// Get call log by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CallLogDto>> GetCallLogById(int id)
        {
            var callLog = await _callLogService.GetCallLogByIdAsync(id);
            if (callLog == null)
            {
                return NotFound($"Call log with ID {id} not found");
            }

            return Ok(callLog);
        }

        /// <summary>
        /// Get call logs by phone number
        /// </summary>
        [HttpGet("by-phone")]
        public async Task<ActionResult<IEnumerable<CallLogDto>>> GetCallLogsByPhone([FromQuery] string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
            {
                return BadRequest("Phone number is required");
            }

            var callLogs = await _callLogService.GetCallLogsByPhoneAsync(phone);
            return Ok(callLogs);
        }

        /// <summary>
        /// Get all call logs with optional pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CallLogDto>>> GetAllCallLogs(
            [FromQuery] int? page = null,
            [FromQuery] int? pageSize = null)
        {
            var callLogs = await _callLogService.GetAllCallLogsAsync(page, pageSize);
            return Ok(callLogs);
        }

        /// <summary>
        /// Update call log
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<CallLogDto>> UpdateCallLog(int id, UpdateCallLogDto updateDto)
        {
            var callLog = await _callLogService.UpdateCallLogAsync(id, updateDto);
            if (callLog == null)
            {
                return NotFound($"Call log with ID {id} not found");
            }

            return Ok(callLog);
        }

        /// <summary>
        /// Delete call log
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCallLog(int id)
        {
            var success = await _callLogService.DeleteCallLogAsync(id);
            if (!success)
            {
                return NotFound($"Call log with ID {id} not found");
            }

            return NoContent();
        }

        /// <summary>
        /// Update call status by Call SID (used by Twilio webhooks)
        /// </summary>
        [HttpPut("status/{callSid}")]
        public async Task<ActionResult<CallLogDto>> UpdateCallStatus(
            string callSid,
            [FromBody] UpdateCallStatusDto updateDto)
        {
            var callLog = await _callLogService.UpdateCallStatusAsync(
                callSid, 
                updateDto.Status, 
                updateDto.Duration);

            if (callLog == null)
            {
                return NotFound($"Call log with Call SID {callSid} not found");
            }

            return Ok(callLog);
        }
    }

    public class UpdateCallStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public TimeSpan? Duration { get; set; }
    }
} 