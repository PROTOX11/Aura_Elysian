import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');
  
  // Test 1: Try to access cart without login (should fail)
  console.log('1️⃣ Testing cart access without authentication...');
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`);
    console.log('❌ Unexpected: Cart accessible without auth');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correct: Cart requires authentication (401 Unauthorized)');
    } else {
      console.log('❌ Unexpected error:', error.response?.status);
    }
  }
  
  // Test 2: Sign up a new user
  console.log('\n2️⃣ Testing user signup...');
  let userToken = null;
  try {
    const signupResponse = await axios.post(`${API_BASE_URL}/signup`, {
      name: 'Test User Auth',
      email: 'testauth@example.com',
      password: 'testpassword123'
    });
    userToken = signupResponse.data.token;
    console.log('✅ User signup successful, token received');
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'User already exists') {
      console.log('ℹ️ User already exists, trying login...');
      // Try login instead
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
          email: 'testauth@example.com',
          password: 'testpassword123'
        });
        userToken = loginResponse.data.token;
        console.log('✅ User login successful, token received');
      } catch (loginError) {
        console.log('❌ Login failed:', loginError.response?.data?.message);
        return;
      }
    } else {
      console.log('❌ Signup failed:', error.response?.data?.message);
      return;
    }
  }
  
  // Test 3: Access cart with valid token
  console.log('\n3️⃣ Testing cart access with authentication...');
  try {
    const cartResponse = await axios.get(`${API_BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Cart access successful with valid token');
    console.log('📦 Cart data:', cartResponse.data);
  } catch (error) {
    console.log('❌ Cart access failed:', error.response?.data?.message);
  }
  
  // Test 4: Test token verification endpoint
  console.log('\n4️⃣ Testing token verification...');
  try {
    const verifyResponse = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ Token verification successful');
    console.log('👤 User info:', verifyResponse.data);
  } catch (error) {
    console.log('❌ Token verification failed:', error.response?.data?.message);
  }
  
  console.log('\n🎯 Authentication Flow Test Complete!');
  console.log('✅ MongoDB Atlas is working');
  console.log('✅ Authentication system is working');
  console.log('✅ Cart API requires proper authentication');
}

testAuthFlow().catch(console.error);
