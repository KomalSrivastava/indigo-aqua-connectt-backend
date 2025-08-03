using Microsoft.EntityFrameworkCore;
using CustomerSupportAPI.Data;
using CustomerSupportAPI.Models;
using CustomerSupportAPI.DTOs;

namespace CustomerSupportAPI.Services
{
    public interface ICallLogService
    {
        Task<CallLogDto?> GetCallLogByIdAsync(int id);
        Task<IEnumerable<CallLogDto>> GetCallLogsByPhoneAsync(string phone);
        Task<IEnumerable<CallLogDto>> GetAllCallLogsAsync(int? page = null, int? pageSize = null);
        Task<CallLogDto> CreateCallLogAsync(CreateCallLogDto createDto);
        Task<CallLogDto?> UpdateCallLogAsync(int id, UpdateCallLogDto updateDto);
        Task<bool> DeleteCallLogAsync(int id);
        Task<CallLogDto> LogIncomingCallAsync(IncomingCallDto incomingCallDto);
        Task<CallLogDto?> UpdateCallStatusAsync(string callSid, string status, TimeSpan? duration = null);
    }

    public class CallLogService : ICallLogService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customerService;

        public CallLogService(ApplicationDbContext context, ICustomerService customerService)
        {
            _context = context;
            _customerService = customerService;
        }

        public async Task<CallLogDto?> GetCallLogByIdAsync(int id)
        {
            var callLog = await _context.CallLogs
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            return callLog != null ? MapToDto(callLog) : null;
        }

        public async Task<IEnumerable<CallLogDto>> GetCallLogsByPhoneAsync(string phone)
        {
            var callLogs = await _context.CallLogs
                .Include(c => c.Customer)
                .Where(c => c.Phone == phone)
                .OrderByDescending(c => c.Timestamp)
                .ToListAsync();

            return callLogs.Select(MapToDto);
        }

        public async Task<IEnumerable<CallLogDto>> GetAllCallLogsAsync(int? page = null, int? pageSize = null)
        {
            IQueryable<CallLog> query = _context.CallLogs
                .Include(c => c.Customer)
                .OrderByDescending(c => c.Timestamp);

            if (page.HasValue && pageSize.HasValue)
            {
                query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
            }

            var callLogs = await query.ToListAsync();
            return callLogs.Select(MapToDto);
        }

        public async Task<CallLogDto> CreateCallLogAsync(CreateCallLogDto createDto)
        {
            var callLog = new CallLog
            {
                Phone = createDto.Phone,
                Timestamp = DateTime.UtcNow,
                Status = createDto.Status,
                Duration = createDto.Duration,
                Notes = createDto.Notes,
                AgentId = createDto.AgentId,
                CallSid = createDto.CallSid,
                CustomerId = createDto.CustomerId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CallLogs.Add(callLog);
            await _context.SaveChangesAsync();

            // Reload with customer data
            await _context.Entry(callLog).Reference(c => c.Customer).LoadAsync();
            
            return MapToDto(callLog);
        }

        public async Task<CallLogDto?> UpdateCallLogAsync(int id, UpdateCallLogDto updateDto)
        {
            var callLog = await _context.CallLogs.FindAsync(id);
            if (callLog == null)
                return null;

            if (!string.IsNullOrEmpty(updateDto.Status))
                callLog.Status = updateDto.Status;
            
            if (updateDto.Duration.HasValue)
                callLog.Duration = updateDto.Duration;
            
            if (!string.IsNullOrEmpty(updateDto.Notes))
                callLog.Notes = updateDto.Notes;
            
            if (!string.IsNullOrEmpty(updateDto.AgentId))
                callLog.AgentId = updateDto.AgentId;

            await _context.SaveChangesAsync();

            // Reload with customer data
            await _context.Entry(callLog).Reference(c => c.Customer).LoadAsync();
            
            return MapToDto(callLog);
        }

        public async Task<bool> DeleteCallLogAsync(int id)
        {
            var callLog = await _context.CallLogs.FindAsync(id);
            if (callLog == null)
                return false;

            _context.CallLogs.Remove(callLog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<CallLogDto> LogIncomingCallAsync(IncomingCallDto incomingCallDto)
        {
            // Try to find customer by phone number
            var customer = await _customerService.GetCustomerByPhoneAsync(incomingCallDto.From);
            
            var callLog = new CallLog
            {
                Phone = incomingCallDto.From,
                Timestamp = incomingCallDto.Timestamp,
                Status = "incoming",
                CallSid = incomingCallDto.CallSid,
                CustomerId = customer?.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.CallLogs.Add(callLog);
            await _context.SaveChangesAsync();

            // Reload with customer data
            await _context.Entry(callLog).Reference(c => c.Customer).LoadAsync();
            
            return MapToDto(callLog);
        }

        public async Task<CallLogDto?> UpdateCallStatusAsync(string callSid, string status, TimeSpan? duration = null)
        {
            var callLog = await _context.CallLogs
                .FirstOrDefaultAsync(c => c.CallSid == callSid);

            if (callLog == null)
                return null;

            callLog.Status = status;
            if (duration.HasValue)
                callLog.Duration = duration;

            await _context.SaveChangesAsync();

            // Reload with customer data
            await _context.Entry(callLog).Reference(c => c.Customer).LoadAsync();
            
            return MapToDto(callLog);
        }

        private static CallLogDto MapToDto(CallLog callLog)
        {
            return new CallLogDto
            {
                Id = callLog.Id,
                Phone = callLog.Phone,
                Timestamp = callLog.Timestamp,
                Status = callLog.Status,
                Duration = callLog.Duration,
                Notes = callLog.Notes,
                AgentId = callLog.AgentId,
                CallSid = callLog.CallSid,
                CustomerId = callLog.CustomerId,
                Customer = callLog.Customer != null ? new CustomerDto
                {
                    Id = callLog.Customer.Id,
                    Name = callLog.Customer.Name,
                    Phone = callLog.Customer.Phone,
                    Email = callLog.Customer.Email,
                    CreatedAt = callLog.Customer.CreatedAt,
                    UpdatedAt = callLog.Customer.UpdatedAt
                } : null,
                CreatedAt = callLog.CreatedAt
            };
        }
    }
} 