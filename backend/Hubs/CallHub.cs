using Microsoft.AspNetCore.SignalR;
using CustomerSupportAPI.DTOs;

namespace CustomerSupportAPI.Hubs
{
    public class CallHub : Hub
    {
        private static readonly Dictionary<string, string> _agentConnections = new();

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Remove agent from connection mapping
            var agentId = _agentConnections.FirstOrDefault(x => x.Value == Context.ConnectionId).Key;
            if (!string.IsNullOrEmpty(agentId))
            {
                _agentConnections.Remove(agentId);
            }

            await base.OnDisconnectedAsync(exception);
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}");
        }

        // Method for agents to register themselves
        public async Task RegisterAgent(string agentId)
        {
            _agentConnections[agentId] = Context.ConnectionId;
            await Clients.Caller.SendAsync("AgentRegistered", agentId);
            Console.WriteLine($"Agent {agentId} registered with connection {Context.ConnectionId}");
        }

        // Method to notify all agents about incoming call
        public async Task NotifyIncomingCall(IncomingCallDto incomingCall)
        {
            await Clients.All.SendAsync("IncomingCall", incomingCall);
            Console.WriteLine($"Notified all agents about incoming call from {incomingCall.From}");
        }

        // Method to notify specific agent about incoming call
        public async Task NotifyAgentIncomingCall(string agentId, IncomingCallDto incomingCall)
        {
            if (_agentConnections.TryGetValue(agentId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("IncomingCall", incomingCall);
                Console.WriteLine($"Notified agent {agentId} about incoming call from {incomingCall.From}");
            }
            else
            {
                Console.WriteLine($"Agent {agentId} not found in connections");
            }
        }

        // Method to notify about call status updates
        public async Task NotifyCallStatusUpdate(string callSid, string status, string? agentId = null)
        {
            if (!string.IsNullOrEmpty(agentId) && _agentConnections.TryGetValue(agentId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("CallStatusUpdate", callSid, status);
            }
            else
            {
                await Clients.All.SendAsync("CallStatusUpdate", callSid, status);
            }
        }

        // Method to get all connected agents
        public List<string> GetConnectedAgents()
        {
            return _agentConnections.Keys.ToList();
        }
    }
} 