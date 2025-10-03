import React, { useState } from 'react';
import { Home, Users, User, Settings } from 'react-feather';

const Admin = () => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [agentFilter, setAgentFilter] = useState('All Agents');

  // Sample ticket data with status
  const [tickets, setTickets] = useState([
    {
      id: '#TK-1001',
      subject: 'Login issues',
      category: 'Technical',
      priority: 'High',
      assignedTo: 'Agent 1',
      time: '2h ago',
      status: 'Ongoing'
    },
    {
      id: '#TK-1002',
      subject: 'Billing question',
      category: 'Billing',
      priority: 'Medium',
      assignedTo: 'Agent 2',
      time: '5h ago',
      status: 'Ongoing'
    },
    {
      id: '#TK-1003',
      subject: 'Feature request',
      category: 'Feature',
      priority: 'Low',
      assignedTo: 'Unassigned',
      time: '1d ago',
      status: 'Ongoing'
    },
    {
      id: '#TK-1004',
      subject: 'Password reset',
      category: 'Technical',
      priority: 'High',
      assignedTo: 'Agent 1',
      time: '3h ago',
      status: 'Resolved'
    },
    {
      id: '#TK-1005',
      subject: 'Software installation',
      category: 'IT',
      priority: 'Medium',
      assignedTo: 'Unassigned',
      time: '6h ago',
      status: 'Ongoing'
    }
  ]);

  // Filter tickets based on selected filters
  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = statusFilter === 'All Status' || ticket.status === statusFilter;
    const agentMatch = agentFilter === 'All Agents' || 
                      (agentFilter === 'Unassigned' && ticket.assignedTo === 'Unassigned') ||
                      (agentFilter !== 'Unassigned' && ticket.assignedTo === agentFilter);
    
    return statusMatch && agentMatch;
  });

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="sidebar-title">TicketZen 🎫</h1>
        <nav>
          <ul className="nav-list">
            <li>
              <a href="#" className="nav-link active">
                <Home className="nav-icon" size={16} />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                <Users className="nav-icon" size={16} />
                Agent Management
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                <User className="nav-icon" size={16} />
                User Management
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                <Settings className="nav-icon" size={16} />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-grid">
          {/* Workload Report */}
          <div className="dashboard-card">
            <h2 className="card-title">Agent Workload</h2>
            <div className="workload-content">
              <div className="workload-item">
                <div className="workload-info">
                  <span>HR</span>
                  <span>12 tickets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="workload-item">
                <div className="workload-info">
                  <span>IT</span>
                  <span>8 tickets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="workload-item">
                <div className="workload-info">
                  <span>Facilities</span>
                  <span>4 tickets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="workload-item">
                <div className="workload-info">
                  <span>Others</span>
                  <span>2 tickets</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Aggregation */}
          <div className="dashboard-card">
            <h2 className="card-title">Ticket Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <p className="stat-number">{tickets.filter(t => t.status !== 'Resolved').length}</p>
                <p className="stat-label">Open</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">{tickets.filter(t => t.status === 'Resolved').length}</p>
                <p className="stat-label">Resolved</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">{tickets.filter(t => t.priority === 'High').length}</p>
                <p className="stat-label">High Priority</p>
              </div>
              <div className="stat-item">
                <p className="stat-number">{tickets.filter(t => t.assignedTo === 'Unassigned').length}</p>
                <p className="stat-label">Unassigned</p>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="dashboard-card quick-actions">
            <h2 className="card-title">Performance metrics</h2>
            <div className="actions-grid">
              <button className="btn btn-primary">FC Resolution %</button>
              <button className="btn btn-secondary">SLA compliance</button>
             
            </div>
        
            <h2 className="card-title">Quick Actions</h2>
            <div className="actions-grid">
              <button className="btn btn-primary">Assign Tickets</button>
              <button className="btn btn-secondary">Ticket Data</button>
             
            </div>
          </div>
        </div>

        {/* Ticket Queue */}
        <div className="ticket-queue">
          <div className="queue-header">
            <div className="header-content">
              <h2 className="queue-title">Ticket Queue</h2>
              <div className="queue-filters">
                <select 
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Ongoing</option>
                  <option>Resolved</option>
                </select>
                <select 
                  className="filter-select"
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                >
                  <option>All Agents</option>
                  <option>Unassigned</option>
                  <option>Agent 1</option>
                  <option>Agent 2</option>
                </select>
              </div>
            </div>
          </div>
          <table className="queue-table">
            <thead className="table-header">
              <tr>
                <th className="table-head">Ticket ID</th>
                <th className="table-head">Subject</th>
                <th className="table-head">Category</th>
                <th className="table-head">Priority</th>
                <th className="table-head">Assigned To</th>
                <th className="table-head">Status</th>
                <th className="table-head">Time</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">{ticket.id}</td>
                    <td className="table-cell">{ticket.subject}</td>
                    <td className="table-cell">{ticket.category}</td>
                    <td className={`table-cell ${ticket.priority === 'High' ? 'high-priority' : ''}`}>
                      {ticket.priority}
                    </td>
                    <td className={`table-cell ${ticket.assignedTo === 'Unassigned' ? 'unassigned' : ''}`}>
                      {ticket.assignedTo}
                    </td>
                    <td className="table-cell">{ticket.status}</td>
                    <td className="table-cell">{ticket.time}</td>
                  </tr>
                ))
              ) : (
                <tr className="table-row">
                  <td colSpan="7" className="table-cell text-center">
                    No tickets found matching the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;