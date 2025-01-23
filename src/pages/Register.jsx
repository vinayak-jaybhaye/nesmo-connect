import React, { useState } from 'react'

function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [userType, setUserType] = useState('student')  // Default to 'student'

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle registration logic here
    console.log('Name:', name, 'Email:', email, 'Password:', password, 'City:', city, 'UserType:', userType)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 text-sm font-medium">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-600 text-sm font-medium">City</label>
            <input 
              type="text" 
              id="city" 
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userType" className="block text-gray-600 text-sm font-medium">I am a</label>
            <select 
              id="userType" 
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  )
}

export default Register
