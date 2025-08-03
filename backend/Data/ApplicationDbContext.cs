using Microsoft.EntityFrameworkCore;
using CustomerSupportAPI.Models;

namespace CustomerSupportAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<CallLog> CallLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Customer entity
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                
                // Create unique index on phone number
                entity.HasIndex(e => e.Phone).IsUnique();
                
                // Create index on email
                entity.HasIndex(e => e.Email);
            });

            // Configure CallLog entity
            modelBuilder.Entity<CallLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Notes).HasMaxLength(500);
                
                // Create index on phone number for faster lookups
                entity.HasIndex(e => e.Phone);
                
                // Create index on timestamp for call history queries
                entity.HasIndex(e => e.Timestamp);
                
                // Create index on status for filtering
                entity.HasIndex(e => e.Status);
                
                // Configure relationship with Customer
                entity.HasOne(e => e.Customer)
                      .WithMany(c => c.CallLogs)
                      .HasForeignKey(e => e.CustomerId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // Seed some sample data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Sample customers
            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    Id = 1,
                    Name = "John Doe",
                    Phone = "+1234567890",
                    Email = "john.doe@example.com",
                    CreatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    Id = 2,
                    Name = "Jane Smith",
                    Phone = "+1987654321",
                    Email = "jane.smith@example.com",
                    CreatedAt = DateTime.UtcNow
                },
                new Customer
                {
                    Id = 3,
                    Name = "Bob Johnson",
                    Phone = "+1555123456",
                    Email = "bob.johnson@example.com",
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Sample call logs
            modelBuilder.Entity<CallLog>().HasData(
                new CallLog
                {
                    Id = 1,
                    Phone = "+1234567890",
                    Timestamp = DateTime.UtcNow.AddHours(-2),
                    Status = "completed",
                    Duration = TimeSpan.FromMinutes(5),
                    CustomerId = 1,
                    AgentId = "agent001",
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new CallLog
                {
                    Id = 2,
                    Phone = "+1987654321",
                    Timestamp = DateTime.UtcNow.AddHours(-1),
                    Status = "missed",
                    CustomerId = 2,
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                }
            );
        }
    }
} 