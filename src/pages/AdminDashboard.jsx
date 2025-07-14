import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [adminUsername, setAdminUsername] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'edit' or 'progress'
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUsername');
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
    setAdminUsername(adminUser);
    
    // Load candidates from localStorage (simulating API call)
    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      // Default candidates data
      const defaultCandidates = [
        {
          id: 1,
          username: 'john_doe',
          email: 'john@example.com',
          password: 'password123',
          steps: [
            { 
              id: 1, 
              title: 'Application Received', 
              date: 'Nov 15, 2024',
              status: 'Complete',
              description: 'Your immigration application has been successfully submitted and received by our processing center.'
            },
            { 
              id: 2, 
              title: 'Initial Review', 
              date: 'Nov 18, 2024',
              status: 'Complete',
              description: 'Initial document review has been completed. All required forms are present.'
            }
          ]
        },
        {
          id: 2,
          username: 'jane_smith',
          email: 'jane@example.com',
          password: 'password456',
          steps: [
            { 
              id: 1, 
              title: 'Application Received', 
              date: 'Nov 20, 2024',
              status: 'Complete',
              description: 'Your immigration application has been successfully submitted and received by our processing center.'
            }
          ]
        }
      ];
      setCandidates(defaultCandidates);
      localStorage.setItem('candidates', JSON.stringify(defaultCandidates));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUsername');
    navigate('/');
  };

  const openModal = (type, candidate) => {
    setModalType(type);
    setSelectedCandidate(candidate);
    if (type === 'edit') {
      setEditData({
        username: candidate.username,
        email: candidate.email,
        password: candidate.password
      });
    } else if (type === 'progress') {
      // Load the candidate's current progress
      const savedProgress = localStorage.getItem(`progress_${candidate.username}`);
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        setEditData({ 
          steps: progressData.steps || [],
          newStep: {
            title: '',
            description: '',
            status: 'In Progress',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
        });
      } else {
        setEditData({ 
          steps: candidate.steps || [],
          newStep: {
            title: '',
            description: '',
            status: 'In Progress',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
        });
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCandidate(null);
    setEditData({});
  };

  const addNewStep = () => {
    if (editData.newStep.title.trim() && editData.newStep.description.trim()) {
      const newStep = {
        id: Date.now(), // Simple ID generation
        ...editData.newStep
      };
      
      const updatedSteps = [...(editData.steps || []), newStep];
      setEditData({
        ...editData,
        steps: updatedSteps,
        newStep: {
          title: '',
          description: '',
          status: 'In Progress',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
      });
    }
  };

  const deleteStep = (stepId) => {
    const updatedSteps = editData.steps.filter(step => step.id !== stepId);
    setEditData({ ...editData, steps: updatedSteps });
  };

  const saveChanges = () => {
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === selectedCandidate.id) {
        if (modalType === 'edit') {
          return { ...candidate, ...editData };
        } else if (modalType === 'progress') {
          // Update progress in localStorage for candidate dashboard
          const progressData = { steps: editData.steps };
          localStorage.setItem(`progress_${candidate.username}`, JSON.stringify(progressData));
          return { ...candidate, steps: editData.steps };
        }
      }
      return candidate;
    });
    
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    closeModal();
  };

  const getStepStatus = (step) => {
    const statuses = {
      'Completed': 'bg-green-100 text-green-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-gray-100 text-gray-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return statuses[step] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {adminUsername}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Candidate Management</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {candidate.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {candidate.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {candidate.steps ? (
                            <>
                              <div className="bg-gray-200 rounded-full h-2 w-20 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(candidate.steps.filter(s => s.status === 'Complete').length / candidate.steps.length) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">
                                {candidate.steps.filter(s => s.status === 'Complete').length}/{candidate.steps.length}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">No progress data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal('edit', candidate)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit Account
                        </button>
                        <button
                          onClick={() => openModal('progress', candidate)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Update Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'edit' ? 'Edit Account' : 'Update Progress'}
              </h3>
              
              {modalType === 'edit' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editData.username || ''}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={editData.password || ''}
                      onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Existing Steps */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Current Progress Steps</h4>
                    {editData.steps && editData.steps.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {editData.steps.map((step, index) => (
                          <div key={step.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{step.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                              </div>
                              <button
                                onClick={() => deleteStep(step.id)}
                                className="text-red-500 hover:text-red-700 text-sm ml-2"
                              >
                                Delete
                              </button>
                            </div>
                            <select
                              value={step.status || 'In Progress'}
                              onChange={(e) => {
                                const updatedSteps = [...editData.steps];
                                updatedSteps[index] = { ...step, status: e.target.value };
                                setEditData({ ...editData, steps: updatedSteps });
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="In Progress">In Progress</option>
                              <option value="Complete">Complete</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No progress steps yet.</p>
                    )}
                  </div>

                  {/* Add New Step */}
                  <div className="border-t pt-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Add New Progress Step</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Step Title
                        </label>
                        <input
                          type="text"
                          value={editData.newStep?.title || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            newStep: { ...editData.newStep, title: e.target.value }
                          })}
                          placeholder="e.g., Document Review, Interview Scheduled"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editData.newStep?.description || ''}
                          onChange={(e) => setEditData({
                            ...editData,
                            newStep: { ...editData.newStep, description: e.target.value }
                          })}
                          placeholder="Describe what happened in this step..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editData.newStep?.status || 'In Progress'}
                          onChange={(e) => setEditData({
                            ...editData,
                            newStep: { ...editData.newStep, status: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="In Progress">In Progress</option>
                          <option value="Complete">Complete</option>
                        </select>
                      </div>
                      <button
                        onClick={addNewStep}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Add Step
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
