// src/config/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const API_CONFIG = {
  // Base API URL - replaced with environment variable in production
  BASE_URL: API_BASE_URL,
  
  // API Endpoints (remove extra /api here)
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Employee Management
    EMPLOYEES: '/employee/employees',
    EMPLOYEE_CERTIFICATES: '/certificate/employee-certificates',
    
    // Course Management
    COURSES: '/courses/getcourse',
    COURSE_PROGRESS: '/progress/get-with-unlocking',
    QUIZ_AVAILABILITY: '/courses/check-quiz-availability',
    SUBMIT_QUIZ: '/progress/submit-quiz',
    
    // Certificate Management
    CERTIFICATES_ALL: '/certificates/all',
    CERTIFICATE_BY_ID: '/certificates',
    CHECK_COURSE_COMPLETION: '/certificate/check-course-completion',
    
    // Video Management
    VIDEO_GET: '/video/get',
    
    // Assigned Tasks
    ASSIGNED_TASKS: '/assigned-course-progress/quiz-completion-status',
    
    // Health Check
    HEALTH: '/health'
  },
  
  // Helper function to get full URL
  getUrl: function(endpoint) {
    return `${this.BASE_URL}${endpoint}`;
  },
  
  // Helper function to get API URL with query parameters
  getUrlWithParams: function(endpoint, params = {}) {
    const url = new URL(`${this.BASE_URL}${endpoint}`, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  }
};

export default API_CONFIG;
