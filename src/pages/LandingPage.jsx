import React from 'react';

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Immigration Portal</h1>
      <div className="space-x-4">
        <a href="/candidate-login" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Candidate Login</a>
        <a href="/admin-login" className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Admin Login</a>
      </div>
    </div>
  );
}

export default LandingPage;
