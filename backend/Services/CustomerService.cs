using Microsoft.EntityFrameworkCore;
using CustomerSupportAPI.Data;
using CustomerSupportAPI.Models;
using CustomerSupportAPI.DTOs;

namespace CustomerSupportAPI.Services
{
    public interface ICustomerService
    {
        Task<CustomerDto?> GetCustomerByPhoneAsync(string phone);
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto);
        Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerDto updateDto);
        Task<bool> DeleteCustomerAsync(int id);
    }

    public class CustomerService : ICustomerService
    {
        private readonly ApplicationDbContext _context;

        public CustomerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CustomerDto?> GetCustomerByPhoneAsync(string phone)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Phone == phone);

            return customer != null ? MapToDto(customer) : null;
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id);

            return customer != null ? MapToDto(customer) : null;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = await _context.Customers
                .OrderBy(c => c.Name)
                .ToListAsync();

            return customers.Select(MapToDto);
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto createDto)
        {
            // Check if customer with same phone already exists
            var existingCustomer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Phone == createDto.Phone);

            if (existingCustomer != null)
            {
                throw new InvalidOperationException($"Customer with phone {createDto.Phone} already exists.");
            }

            var customer = new Customer
            {
                Name = createDto.Name,
                Phone = createDto.Phone,
                Email = createDto.Email,
                CreatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return MapToDto(customer);
        }

        public async Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerDto updateDto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return null;

            // Update only provided fields
            if (!string.IsNullOrEmpty(updateDto.Name))
                customer.Name = updateDto.Name;
            
            if (!string.IsNullOrEmpty(updateDto.Phone))
            {
                // Check if new phone number already exists
                var existingCustomer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Phone == updateDto.Phone && c.Id != id);
                
                if (existingCustomer != null)
                {
                    throw new InvalidOperationException($"Customer with phone {updateDto.Phone} already exists.");
                }
                
                customer.Phone = updateDto.Phone;
            }
            
            if (!string.IsNullOrEmpty(updateDto.Email))
                customer.Email = updateDto.Email;

            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToDto(customer);
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }

        private static CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Email = customer.Email,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };
        }
    }
} 