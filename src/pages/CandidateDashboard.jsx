import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CandidateDashboard() {
  const [username, setUsername] = useState('');
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const candidateUsername = localStorage.getItem('candidateUsername');
    if (!candidateUsername) {
      navigate('/candidate-login');
      return;
    }
    setUsername(candidateUsername);
    
    // Load progress from localStorage (simulating API call)
    const savedProgress = localStorage.getItem(`progress_${candidateUsername}`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setSteps(parsed.steps || []);
    } else {
      // Check if there are any steps from the admin-set candidates data
      const savedCandidates = localStorage.getItem('candidates');
      if (savedCandidates) {
        const candidates = JSON.parse(savedCandidates);
        const currentCandidate = candidates.find(c => c.username === candidateUsername);
        if (currentCandidate && currentCandidate.steps) {
          setSteps(currentCandidate.steps);
          localStorage.setItem(`progress_${candidateUsername}`, JSON.stringify({ steps: currentCandidate.steps }));
        } else {
          setSteps([]);
        }
      } else {
        setSteps([]);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('candidateUsername');
    navigate('/');
  };

  const getCurrentOverallStatus = () => {
    const hasInProgress = steps.some(step => step.status === 'In Progress');
    const allComplete = steps.every(step => step.status === 'Complete');
    
    if (allComplete) return 'COMPLETE';
    if (hasInProgress) return 'IN PROGRESS';
    return 'IN PROGRESS';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Immigration Application Tracking</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {username}!</span>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          
          {/* Status Badge */}
          <div className="inline-block">
            <div className={`px-8 py-3 rounded text-white font-semibold text-lg ${
              getCurrentOverallStatus() === 'COMPLETE' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              {getCurrentOverallStatus()}
            </div>
          </div>
        </div>

        {/* Progress Trail */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {steps.length > 0 ? (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex items-start mb-6 last:mb-0">
                  {/* Circle with checkmark or in progress indicator */}
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.status === 'Complete' ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {step.status === 'Complete' ? (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Content Card */}
                  <div className="ml-6 flex-1">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600 mr-2">Immigration Office</span>
                          <span className="text-sm text-gray-500">{step.date}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Updates Yet</h3>
              <p className="text-gray-500">Your immigration application progress will appear here once processing begins. Please check back later or contact our office if you have questions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
