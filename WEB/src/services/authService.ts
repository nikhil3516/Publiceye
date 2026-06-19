export interface Session {
  userId: string;
  email: string;
  name: string;
  userType: "citizen" | "admin";
  token: string;
}

// Simulated backend delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password: string):Promise<Session> => {
    await delay(1000);
    if (email === "admin@publiceye.com" && password === "admin123") {
      return {
        userId: "admin-1",
        email,
        name: "Admin User",
        userType: "admin",
        token: "fake-jwt-admin-token-12345",
      };
    }
    
    // Accept any other credentials for mock purposes
    if (password.length >= 6) {
      return {
        userId: "user-" + Math.floor(Math.random() * 10000),
        email,
        name: email.split("@")[0],
        userType: "citizen",
        token: "fake-jwt-citizen-token-abcde",
      };
    }
    
    throw new Error("Invalid email or password");
  },

  register: async (name: string, email: string, _password: string):Promise<Session> => {
    void _password;
    await delay(1000);
    return {
      userId: "user-" + Math.floor(Math.random() * 10000),
      email,
      name,
      userType: "citizen",
      token: "fake-jwt-citizen-token-newuser",
    };
  },

  sendOtp: async (_email: string):Promise<boolean> => {
    void _email;
    await delay(800);
    return true; // Simulate OTP sent successfully
  },

  verifyOtp: async (email: string, otp: string):Promise<boolean> => {
    await delay(800);
    return otp === "123456"; // Fixed OTP for mock
  },

  resetPassword: async (_email: string, _newPassword: string):Promise<boolean> => {
    void _email;
    void _newPassword;
    await delay(800);
    return true;
  }
};
