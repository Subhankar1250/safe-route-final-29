
import { Navigate } from "react-router-dom";

const Index = () => {
  // Check local storage for existing user session
  const storedUser = localStorage.getItem('sishuTirthaUser');
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      // Redirect based on role
      if (userData.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userData.role === 'driver') {
        return <Navigate to="/driver/dashboard" replace />;
      } else if (userData.role === 'guardian') {
        return <Navigate to="/guardian/dashboard" replace />;
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      // If there's an error, redirect to login
    }
  }
  
  // Default redirect to login if no valid session exists
  return <Navigate to="/login" replace />;
};

export default Index;
