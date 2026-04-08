import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI, doctorAPI } from '../services/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelling, setCancelling] = useState(null);
  const [rescheduling, setRescheduling] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getAll();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancelling(id);
    try {
      await appointmentAPI.cancel(id);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    } finally {
      setCancelling(null);
    }
  };

  const handleRescheduleClick = async (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate('');
    setNewTime('');
    setAvailableSlots([]);
    setShowRescheduleModal(true);
  };

  const fetchAvailableSlots = async (date) => {
    if (!selectedAppointment || !date) return;
    try {
      const response = await doctorAPI.getAvailability(selectedAppointment.doctor._id, date);
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setNewDate(date);
    setNewTime('');
    if (date) {
      fetchAvailableSlots(date);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      alert('Please select a new date and time');
      return;
    }

    setRescheduling(selectedAppointment._id);
    try {
      await appointmentAPI.reschedule(selectedAppointment._id, newDate, newTime);
      setShowRescheduleModal(false);
      fetchAppointments();
      alert('Appointment rescheduled successfully!');
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      alert('Failed to reschedule appointment');
    } finally {
      setRescheduling(null);
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      if (activeTab === 'upcoming') {
        return aptDate >= now && apt.status !== 'cancelled';
      } else if (activeTab === 'past') {
        return aptDate < now || apt.status === 'completed';
      } else if (activeTab === 'cancelled') {
        return apt.status === 'cancelled';
      }
      return true;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="appointments-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">Manage your healthcare appointments</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
          <button
            className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3 className="empty-state-title">
              No {activeTab} appointments
            </h3>
            <p className="empty-state-text">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments" 
                : activeTab === 'past'
                ? "You don't have any past appointments"
                : "You haven't cancelled any appointments"}
            </p>
            {activeTab === 'upcoming' && (
              <Link to="/doctors" className="btn btn-primary mt-2">
                Book an Appointment
              </Link>
            )}
          </div>
        ) : (
          /* Appointments List */
          <div className="appointments-grid">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-card-header">
                  <div className="appointment-doctor">
                    <img
                      src={appointment.doctor?.image}
                      alt={appointment.doctor?.name}
                      className="appointment-doctor-img"
                    />
                    <div className="appointment-doctor-details">
                      <h3 className="appointment-doctor-name">
                        {appointment.doctor?.name}
                      </h3>
                      <p className="appointment-doctor-specialty">
                        {appointment.doctor?.specialty}
                      </p>
                    </div>
                  </div>
                  <span className={`badge badge-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-card-body">
                  <div className="appointment-info">
                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <span>
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">⏰</span>
                      <span>{appointment.time}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{appointment.doctor?.location}</span>
                    </div>
                  </div>
                  
                  {appointment.reason && (
                    <div className="appointment-reason">
                      <p className="reason-label">Reason:</p>
                      <p className="reason-text">{appointment.reason}</p>
                    </div>
                  )}
                </div>

                {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                  <div className="appointment-card-footer">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleRescheduleClick(appointment)}
                      disabled={rescheduling === appointment._id}
                    >
                      {rescheduling === appointment._id ? 'Rescheduling...' : 'Reschedule'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(appointment._id)}
                      disabled={cancelling === appointment._id}
                    >
                      {cancelling === appointment._id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Reschedule Appointment</h2>
                <button className="modal-close" onClick={() => setShowRescheduleModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="current-appointment-info">
                  <p><strong>Doctor:</strong> {selectedAppointment?.doctor?.name}</p>
                  <p><strong>Current Date:</strong> {new Date(selectedAppointment?.date).toLocaleDateString()}</p>
                  <p><strong>Current Time:</strong> {selectedAppointment?.time}</p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Select New Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {newDate && (
                  <div className="form-group">
                    <label className="form-label">Select New Time</label>
                    {availableSlots.length > 0 ? (
                      <div className="time-slots">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot ${newTime === slot ? 'selected' : ''}`}
                            onClick={() => setNewTime(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="no-slots">No available slots for this date</p>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowRescheduleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleReschedule}
                  disabled={rescheduling || !newDate || !newTime}
                >
                  {rescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
