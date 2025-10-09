// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import courseData from './coursedata';
// import './lessonpage.css';

// function LessonPage() {
//   const { courseId, lessonId } = useParams();
//   const navigate = useNavigate();
//   const [unlockStatus, setUnlockStatus] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const course = courseData[courseId];
//   const lessons = course?.lessons || {};
//   const lessonKeys = Object.keys(lessons);
//   const firstLessonId = lessonKeys[0];
  
//   // Map numeric lessonId to actual lesson key
//   const getLessonKeyFromId = (id) => {
//     // If the id is already a valid lesson key, return it
//     if (lessons[id]) {
//       return id;
//     }
    
//     // If it's a numeric id, map it to the corresponding lesson key
//     const numericId = parseInt(id);
//     if (!isNaN(numericId) && numericId > 0 && numericId <= lessonKeys.length) {
//       return lessonKeys[numericId - 1]; // Convert 1-based index to 0-based
//     }
    
//     // If no valid mapping found, return the first lesson
//     return firstLessonId;
//   };
  
//   const actualLessonId = getLessonKeyFromId(lessonId);
//   const lesson = lessons[actualLessonId];

//   // Fetch user progress and unlock status
//   const fetchUserProgress = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('authToken') || localStorage.getItem('token');
//       const userEmail = localStorage.getItem('employeeEmail');

      
//       if (!token || !userEmail) {
//         console.log('No token or email found, using default unlock status');
//         setUnlockStatus(null);
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`/api/progress/get-with-unlocking?userEmail=${userEmail}&courseName=${course.name}&courseId=${courseId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('sarva',data)
//         console.log('🔍 Unlock status received:', data.lessonUnlockStatus);
//         console.log('📊 Progress data:', data.progress);
//         console.log('📈 Total lessons:', data.totalLessons);
//         console.log('✅ Completed lessons:', data.completedLessons);
//         setUnlockStatus(data.lessonUnlockStatus);
//         console.log('🔓 Unlock status set:', unlockStatus);
//       } else {
//         console.log('Failed to fetch progress, using default unlock status');
//         setUnlockStatus(null);
//       }
//     } catch (error) {
//       console.error('Error fetching user progress:', error);
//       setUnlockStatus(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Redirect to correct lesson if numeric ID is used
//   useEffect(() => {
//     if (course && lessonId !== actualLessonId) {
//       console.log(`Redirecting from lesson ${lessonId} to ${actualLessonId}`);
//       navigate(`/course/${courseId}/lesson/${actualLessonId}`, { replace: true });
//     }
//   }, [courseId, lessonId, actualLessonId, navigate]);

//   // Fetch user progress on component mount
//   useEffect(() => {
//     if (course) {
      
//       fetchUserProgress();
      
//       console.log("this is unlockstaus", unlockStatus);
//     }
//   }, [courseId, course]);

//   // Refresh unlock status when component becomes visible (e.g., after quiz completion)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (!document.hidden && course) {
//         console.log("🔄 Page became visible, refreshing unlock status...");
//         fetchUserProgress();
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [course]);

//   // Map lesson keys to module IDs for backend compatibility
//   const getModuleIdFromLessonKey = (lessonKey) => {
//     // This mapping should match the backend module IDs
//     const moduleMapping = {
//       'ISP01': 'ISP01',
//       'ISP02': 'ISP02', 
//       'ISP03': 'ISP03',
//       'ISP04': 'ISP04',
//       'POSH01': 'POSH01',
//       'POSH02': 'POSH02',
//       'POSH03': 'POSH03', 
//       'POSH04': 'POSH04',
//       'GDPR01': 'GDPR01',
//       'GDPR02': 'GDPR02',
//       'GDPR03': 'GDPR03',
//       'GDPR04': 'GDPR04',
//       'FACTORY01': 'FACTORY01',
//       'FACTORY02': 'FACTORY02',
//       'FACTORY03': 'FACTORY03',
//       'FACTORY04': 'FACTORY04',
//       'WELDING01': 'WELDING01',
//       'WELDING02': 'WELDING02',
//       'WELDING03': 'WELDING03',
//       'WELDING04': 'WELDING04',
//       'CNC01': 'CNC01',
//       'CNC02': 'CNC02',
//       'CNC03': 'CNC03',
//       'CNC04': 'CNC04'
//     };
    
//     // If the lessonKey is already in the mapping, return it
//     if (moduleMapping[lessonKey]) {
//       return moduleMapping[lessonKey];
//     }
    
//     // If not found, try to convert the lessonKey to uppercase (for cases like posh01 -> POSH01)
//     const upperKey = lessonKey.toUpperCase();
//     if (moduleMapping[upperKey]) {
//       return moduleMapping[upperKey];
//     }
    
//     // If still not found, return the original key
//     return lessonKey;
//   };

//   // Check if a lesson is unlocked
//   const isLessonUnlocked = (lessonKey) => {
//     if (!unlockStatus) {
//       // Default behavior: only first lesson unlocked
//       return lessonKeys.indexOf(lessonKey) === 0;
//     }
    
//     const moduleId = getModuleIdFromLessonKey(lessonKey);
//     console.log("🔍 Checking lesson unlock for:", lessonKey, "->", moduleId);
//     const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
//     const isUnlocked = lessonStatus ? lessonStatus.isUnlocked : false;
//     console.log("🔓 Lesson unlock status:", isUnlocked);
//     return isUnlocked;
//   };

//   // Check if a quiz is available
//   const isQuizAvailable = (lessonKey) => {
//     if (!unlockStatus) {
//       // Default behavior: only first quiz available
//       return lessonKeys.indexOf(lessonKey) === 0;
//     }
    
//     const moduleId = getModuleIdFromLessonKey(lessonKey);
//     console.log("🔍 Checking quiz availability for:", lessonKey, "->", moduleId);
//     const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
//     const canTakeQuiz = lessonStatus ? lessonStatus.canTakeQuiz : false;
//     console.log("🎯 Quiz availability status:", canTakeQuiz);
//     return canTakeQuiz;
//   };

//   // Check if lesson is completed
//   const isLessonCompleted = (lessonKey) => {
//     if (!unlockStatus) {
//       return false;
//     }
    
//     const moduleId = getModuleIdFromLessonKey(lessonKey);
//     const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
//     return lessonStatus ? lessonStatus.isCompleted : false;
//   };

//   // Check if quiz is completed (same as lesson completion)
//   const isQuizCompleted = (lessonKey) => {
//     return isLessonCompleted(lessonKey);
//   };

//   if (!course) {
//     console.log("Course not found for ID:", courseId);
//     return (
//       <div className="lesson-wrapper">
//         <div className="error-container">
//           <h2>Course not found</h2>
//           <p>The course you're looking for doesn't exist.</p>
//           <button onClick={() => navigate('/userdashboard')}>Go to Dashboard</button>
//         </div>
//       </div>
//     );
//   }

//   if (!lesson) {
//     console.log("Lesson not found for ID:", lessonId, "Actual lesson ID:", actualLessonId);
//     return (
//       <div className="lesson-wrapper">
//         <div className="error-container">
//           <h2>Lesson not found</h2>
//           <p>The lesson you're looking for doesn't exist in this course.</p>
//           <p>Available lessons: {lessonKeys.join(', ')}</p>
//           <button onClick={() => navigate(`/course/${courseId}/lesson/${firstLessonId}`)}>
//             Go to First Lesson
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="lesson-wrapper">
//         <div className="loading-container">
//           <h2>Loading lesson...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="lesson-wrapper">
//       {/* 🔶 TOP BAR */}
//       <div className="top-bar">
//         <div>
//           <h3>
//             Learn about <span>{course.name}</span>
//           </h3>
//           <p className="subtitle">{lesson.title}</p>
//         </div>
//         <div className="top-bar-actions">
//           <button 
//             className="refresh-button" 
//             onClick={fetchUserProgress}
//             disabled={loading}
//             title="Refresh unlock status"
//           >
//             🔄 Refresh
//           </button>
//           <div className="duration-text">{course.duration || '1 hour'}</div>
//         </div>
//       </div>

//       <div className="lesson-container">
//         {/* LEFT: Video + Notes */}
//         <div className="lesson-content">
//           <video width="100%" height="auto" controls>
//             <source src={lesson.videoUrl} type="video/mp4" />
//           </video>
//           <p className="progress-text">0% completed</p>
//           <div className="lesson-paragraphs">
//             {lesson.content.map((line, i) => (
//               <p key={i}>{line}</p>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT: Sidebar */}
//         <div className="lesson-sidebar">
//           <div className="sidebar-section">
//             <h4>Courses</h4>
//             {lessonKeys.map((id, idx) => {
//               console.log("this is id ",id)
              
//               const unlocked = isLessonUnlocked(id);
//               const completed = isLessonCompleted(id);
//               console.log("111111",id,actualLessonId)
//               const isCurrentLesson = id === actualLessonId;
              
//               return (
//                 <button
//                   key={id}
//                   className={`lesson-button ${isCurrentLesson ? 'active' : ''} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
//                   disabled={!unlocked}
//                   onClick={() => {
//                     if (unlocked) {
//                       navigate(`/course/${courseId}/lesson/${id}`);
//                     }
//                   }}
//                 >
//                   {!unlocked && <span className="lock-icon">🔒</span>}
//                   {completed && <span className="check-icon">✓</span>}
//                   Lesson {id}: {lessons[id].title.split(' ').slice(0, 3).join(' ')}...
//                   <span className="duration">30 mins</span>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="sidebar-section">
//             <h4>Practice Quiz</h4>
//             {lessonKeys.map((id, idx) => {
//               const quizAvailable = isQuizAvailable(id);
//               console.log("available quiz",quizAvailable)
//               const quizCompleted = isQuizCompleted(id);
//               const isCurrentLesson = id === actualLessonId;
              
//               return (
//                 <button
//                   key={id}
//                   className={`quiz-button ${isCurrentLesson ? 'active' : ''} ${quizCompleted ? 'completed' : ''} ${!quizAvailable ? 'locked' : ''}`}
//                   disabled={!quizAvailable}
//                   onClick={() => {
//                     if (quizAvailable) {
//                       navigate(`/quiz/${courseId}/${id}`);
//                     }
//                   }}
//                 >
//                   {!quizAvailable && <span className="lock-icon">🔒</span>}
//                   {quizCompleted && <span className="check-icon">✓</span>}
//                   Quiz {id}: {lessons[id].title.split(' ').slice(0, 2).join(' ')}...
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LessonPage; 



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseData from './coursedata';
import './lessonpage.css';

function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  
  
  // useEffect(() => {
  //   if (courseId === "68885cf5d486bba2975cdca9") {
  //     console.log("🚀 Redirecting to VRU Quiz Page");
  //     navigate("/vru-quiz", { replace: true });
  //   }
  // }, [courseId, navigate]);
const [unlockStatus, setUnlockStatus] = useState([]); // default to empty array
  const [loading, setLoading] = useState(true);
  

  const course = courseData[courseId];
  const lessons = course?.lessons || {};
  const lessonKeys = Object.keys(lessons);
  const firstLessonId = lessonKeys[0];
  
  // Map numeric lessonId to actual lesson key
  const getLessonKeyFromId = (id) => {
    if (lessons[id]) return id;
    const numericId = parseInt(id);
    if (!isNaN(numericId) && numericId > 0 && numericId <= lessonKeys.length) {
      return lessonKeys[numericId - 1];
    }
    return firstLessonId;
  };
  
  const actualLessonId = getLessonKeyFromId(lessonId);
  const lesson = lessons[actualLessonId];

  // Fetch user progress and unlock status
  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const userEmail = localStorage.getItem('employeeEmail');

      if (!token || !userEmail) {
        console.log('No token or email found, using default unlock status');
        setUnlockStatus([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
  `/api/progress/get-with-unlocking?userEmail=${userEmail}&courseName=${course.name}&courseId=${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('sarva', data);

        if (Array.isArray(data.lessonUnlockStatus)) {
          setUnlockStatus(data.lessonUnlockStatus);
        } else {
          console.warn("Unexpected lessonUnlockStatus format:", data.lessonUnlockStatus);
          setUnlockStatus([]);
        }
      } else {
        console.log('Failed to fetch progress, using default unlock status');
        setUnlockStatus([]);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setUnlockStatus([]);
    } finally {
      setLoading(false);
    }
  };

  // Log unlockStatus only when it actually changes
  useEffect(() => {
    console.log("🔓 Unlock status updated:", unlockStatus);
  }, [unlockStatus]);

  // Redirect to correct lesson if numeric ID is used
  useEffect(() => {
    if (course && lessonId !== actualLessonId) {
      console.log(`Redirecting from lesson ${lessonId} to ${actualLessonId}`);
      navigate(`/course/${courseId}/lesson/${actualLessonId}`, { replace: true });
    }
  }, [courseId, lessonId, actualLessonId, navigate]);

  // Fetch user progress on mount
  useEffect(() => {
    if (course) {
      fetchUserProgress();
    }
  }, [courseId, course]);

  // Refresh unlock status when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && course) {
        console.log("🔄 Page became visible, refreshing unlock status...");
        fetchUserProgress();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [course]);

  // Listen for quiz completion and progress update events
  useEffect(() => {
    const handleQuizCompleted = (event) => {
      const { moduleId, courseId: eventCourseId, courseName } = event.detail;
      console.log('🎉 Quiz completed event received in lesson page:', { moduleId, eventCourseId, courseName });
      
      // Check if this completion is for the current course
      const currentCourseName = course?.name;
      
      if (eventCourseId === courseId || courseName === currentCourseName) {
        console.log('🔄 Refreshing unlock status for current course in lesson page...');
        // Add a small delay to ensure backend has processed the completion
        setTimeout(() => {
          fetchUserProgress();
        }, 500);
      }
    };

    const handleProgressUpdated = (event) => {
      const { courseName: eventCourseName, lessonUnlockStatus } = event.detail;
      console.log('🔄 Progress updated event received in lesson page:', { eventCourseName, lessonUnlockStatus });
      
      // Check if this update is for the current course
      const currentCourseName = course?.name;
      
      if (eventCourseName === currentCourseName) {
        console.log('✅ Updating unlock status from progress update event in lesson page...');
        setUnlockStatus(lessonUnlockStatus);
      }
    };

    window.addEventListener('quizCompleted', handleQuizCompleted);
    window.addEventListener('progressUpdated', handleProgressUpdated);
    
    return () => {
      window.removeEventListener('quizCompleted', handleQuizCompleted);
      window.removeEventListener('progressUpdated', handleProgressUpdated);
    };
  }, [courseId, course?.name, fetchUserProgress]);

  // Map lesson keys to backend IDs
  const getModuleIdFromLessonKey = (lessonKey) => {
    const moduleMapping = {
      'ISP01': 'ISP01', 'ISP02': 'ISP02', 'ISP03': 'ISP03', 'ISP04': 'ISP04',
      'POSH01': 'POSH01', 'POSH02': 'POSH02', 'POSH03': 'POSH03', 'POSH04': 'POSH04',
      'GDPR01': 'GDPR01', 'GDPR02': 'GDPR02', 'GDPR03': 'GDPR03', 'GDPR04': 'GDPR04',
      'FACTORY01': 'FACTORY01', 'FACTORY02': 'FACTORY02', 'FACTORY03': 'FACTORY03', 'FACTORY04': 'FACTORY04',
      'WELDING01': 'WELDING01', 'WELDING02': 'WELDING02', 'WELDING03': 'WELDING03', 'WELDING04': 'WELDING04',
      'CNC01': 'CNC01', 'CNC02': 'CNC02', 'CNC03': 'CNC03', 'CNC04': 'CNC04'
    };
    if (moduleMapping[lessonKey]) return moduleMapping[lessonKey];
    const upperKey = lessonKey.toUpperCase();
    return moduleMapping[upperKey] || lessonKey;
  };

  const isLessonUnlocked = (lessonKey) => {
    if (!Array.isArray(unlockStatus) || unlockStatus.length === 0) {
      return lessonKeys.indexOf(lessonKey) === 0; // default: first lesson unlocked
    }
    const moduleId = getModuleIdFromLessonKey(lessonKey);
    const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
    return lessonStatus ? lessonStatus.isUnlocked : false;
  };

  const isQuizAvailable = (lessonKey) => {
    console.log("from isQuizAvailable function",lessonKey)
    if (!Array.isArray(unlockStatus) || unlockStatus.length === 0) {
      return lessonKeys.indexOf(lessonKey) === 0; // default: first quiz available
    }
    const moduleId = getModuleIdFromLessonKey(lessonKey);
    console.log('module id is ', moduleId)


    const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
    console.log("lesson status is ", lessonStatus)
    return lessonStatus ? lessonStatus.canTakeQuiz : false;
  };

  const isLessonCompleted = (lessonKey) => {
    if (!Array.isArray(unlockStatus)) return false;
    const moduleId = getModuleIdFromLessonKey(lessonKey);
    const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
    return lessonStatus ? lessonStatus.isCompleted : false;
  };

  const isQuizCompleted = (lessonKey) => isLessonCompleted(lessonKey);

  // Check if all modules in the course are completed
  const isCourseCompleted = () => {
    if (!Array.isArray(unlockStatus) || unlockStatus.length === 0) {
      return false;
    }
    
    // Check if all lessons are completed
    return lessonKeys.every(lessonKey => {
      const moduleId = getModuleIdFromLessonKey(lessonKey);
      const lessonStatus = unlockStatus.find(status => status.lessonId === moduleId);
      return lessonStatus ? lessonStatus.isCompleted : false;
    });
  };

  // Auto-generate certificate when course is completed
  useEffect(() => {
    const autoGenerateCertificate = async () => {
      if (isCourseCompleted() && course?.name) {
        console.log('🎓 Course completed! Auto-generating certificate...');
        
        try {
          const token = localStorage.getItem('authToken') || localStorage.getItem('token');
          if (!token) return;
          
          let userEmail = '';
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userEmail = payload.email;
          } catch (e) {
            console.error('Error parsing token:', e);
            return;
          }
          
          const generateResponse = await fetch('/api/certificate/check-course-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              courseName: course.name,
              userEmail: userEmail
            })
          });
          
          const generateData = await generateResponse.json();
          console.log('🎓 Auto-certificate generation response:', generateData);
          
          if (generateResponse.ok && generateData.success && generateData.isCompleted && generateData.certificate) {
            console.log('✅ Certificate auto-generated successfully:', generateData.certificate);
            // Store the generated certificate for later use
            localStorage.setItem('lastGeneratedCertificate', JSON.stringify(generateData.certificate));
          }
        } catch (error) {
          console.error('❌ Error auto-generating certificate:', error);
        }
      }
    };
    
    // Only run if we have unlock status and course data
    if (unlockStatus.length > 0 && course?.name) {
      autoGenerateCertificate();
    }
  }, [unlockStatus, course?.name]);

  // Handle certificate button click
  const handleViewCertificate = async () => {
    try {
      // Get user email from token for certificate generation
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      let userEmail = '';
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userEmail = payload.email;
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }

      console.log('🎓 Attempting to generate certificate for completed course:', course?.name);
      
      // Try to generate certificate from backend first
      try {
        const generateResponse = await fetch('/api/certificate/check-course-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            courseName: course?.name,
            userEmail: userEmail
          })
        });
        
        const generateData = await generateResponse.json();
        console.log('🎓 Certificate generation response:', generateData);
        
        if (generateResponse.ok && generateData.success && generateData.isCompleted && generateData.certificate) {
          // Certificate was generated successfully
          localStorage.setItem('lastGeneratedCertificate', JSON.stringify(generateData.certificate));
          localStorage.setItem('courseCompleted', 'true');
          localStorage.setItem('completedCourseName', course?.name);
          
          console.log('✅ Certificate generated successfully:', generateData.certificate);
        } else {
          console.log('⚠️ Certificate generation failed:', generateData.message);
          // Still proceed with course completion data
          localStorage.setItem('courseCompleted', 'true');
          localStorage.setItem('completedCourseName', course?.name);
        }
      } catch (generateError) {
        console.error('❌ Error generating certificate:', generateError);
        // Still proceed with course completion data
        localStorage.setItem('courseCompleted', 'true');
        localStorage.setItem('completedCourseName', course?.name);
      }
      
      // Navigate to certificate page
      navigate('/certificate');
    } catch (error) {
      console.error('❌ Error in handleViewCertificate:', error);
      // Fallback: just navigate to certificate page
      localStorage.setItem('courseCompleted', 'true');
      localStorage.setItem('completedCourseName', course?.name);
      navigate('/certificate');
    }
  };

  if (!course) {
    return (
      <div className="lesson-wrapper">
        <div className="error-container">
          <h2>Course not found</h2>
          <p>The course you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/userdashboard')}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="lesson-wrapper">
        <div className="error-container">
          <h2>Lesson not found</h2>
          <p>The lesson you're looking for doesn't exist in this course.</p>
          <p>Available lessons: {lessonKeys.join(', ')}</p>
          <button onClick={() => navigate(`/course/${courseId}/lesson/${firstLessonId}`)}>
            Go to First Lesson
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lesson-wrapper">
        <div className="loading-container">
          <h2>Loading lesson...</h2>
        </div>
      </div>
    );
  }
const renderFormattedContent = (contentArray) => {
  return contentArray.map((line, i) => {
    // Skip empty lines
    if (!line || line.trim() === '') {
      return <br key={i} />;
    }

    // Check if line is a heading (ends with ? or is a section title)
    const isHeading = line.endsWith('?') || 
                     line.endsWith(':') || 
                     line === 'Introduction:' ||
                     line === 'Basic Responsibilities:' ||
                     line === 'Overview of ISP — confidentiality, integrity, and availability of information.' ||
                     line.startsWith('What is') ||
                     line.includes('Responsibilities') ||
                     line.includes('Overview');

    // Check if line is a list item (starts with bullet point or dash)
    const isListItem = line.startsWith('•') || 
                      line.startsWith('-') || 
                      line.startsWith('Keep your') ||
                      line.startsWith('Handle all') ||
                      line.startsWith('Always follow');

    if (isHeading) {
      return (
        <h4 key={i} style={{ 
          fontWeight: 'bold', 
          marginTop: '20px', 
          marginBottom: '10px',
          color: '#2c3e50',
          fontSize: '1.1em'
        }}>
          {line}
        </h4>
      );
    } else if (isListItem) {
      return (
        <p key={i} style={{ 
          marginLeft: '20px', 
          marginBottom: '8px',
          color: '#34495e',
          lineHeight: '1.5'
        }}>
          • {line.replace(/^(•|-)\s*/, '')}
        </p>
      );
    } else {
      return (
        <p key={i} style={{ 
          marginBottom: '12px',
          color: '#34495e',
          lineHeight: '1.6',
          textAlign: 'justify'
        }}>
          {line}
        </p>
      );
    }
  });
};
  return (
    <div className="lesson-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div>
          <h3>Learn about <span>{course.name}</span></h3>
          <p className="subtitle">{lesson.title}</p>
        </div>
        <div className="top-bar-actions">
                        <a href="/" className="course-detail-nav-link">Home</a>

          {/* <button className="refresh-button" onClick={fetchUserProgress} disabled={loading} title="Refresh unlock status">
            🔄 Refresh
          </button> */}
          <div className="duration-text">{course.duration || '1 hour'}</div>
        </div>
      </div>

      <div className="lesson-container">
        {/* Video & Notes */}
        <div className="lesson-content">
          <video width="100%" height="auto" controls>
            <source src={lesson.videoUrl} type="video/mp4" />
          </video>
          <p className="progress-text">0% completed</p>
          <div className="lesson-paragraphs" style={{ 
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  marginTop: '20px'
}}>
  {renderFormattedContent(lesson.content)}
</div>
        </div>

        {/* Sidebar */}
        <div className="lesson-sidebar">
          <div className="sidebar-section">
            <h4>Courses</h4>
            {lessonKeys.map((id) => {
              const unlocked = isLessonUnlocked(id);
              const completed = isLessonCompleted(id);
              const isCurrentLesson = id === actualLessonId;
              return (
                <button
                  key={id}
                  className={`lesson-button ${isCurrentLesson ? 'active' : ''} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                  disabled={!unlocked}
                  onClick={() => unlocked && navigate(`/course/${courseId}/lesson/${id}`)}
                >
                  {!unlocked && <span className="lock-icon">🔒</span>}
                  {completed && <span className="check-icon">✓</span>}
                  Lesson {id}: {lessons[id].title.split(' ').slice(0, 3).join(' ')}...
                  <span className="duration">30 mins</span>
                </button>
              );
            })}
          </div>

          <div className="sidebar-section">
            <h4>Practice Quiz</h4>
            {lessonKeys.map((id) => {
              const quizAvailable = isQuizAvailable(id);
              console.log("is quiz available", quizAvailable);
              const quizCompleted = isQuizCompleted(id);
              const isCurrentLesson = id === actualLessonId;
              return (
                <button
                  key={id}
                  className={`quiz-button ${isCurrentLesson ? 'active' : ''} ${quizCompleted ? 'completed' : ''} ${!quizAvailable ? 'locked' : ''}`}
                  disabled={!quizAvailable}
                  onClick={async () => {
                    if (!quizAvailable) return;
                    
                    // Check quiz availability before navigating
                    try {
                      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
                      if (token) {
                        const courseName = course.name;
                        console.log('🔍 Checking quiz availability before navigation for course:', courseName);
                        
                        const response = await fetch('/api/courses/check-quiz-availability', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ courseName })
                        });
                        
                        if (response.ok) {
                          const result = await response.json();
                          console.log('📊 Quiz availability check result:', result);
                          
                          if (!result.canTake) {
                            // Quiz is blocked, show popup
                            const hours = result.cooldown.hours;
                            const minutes = result.cooldown.minutes;
                            alert(`⏰ You cannot take this quiz right now!\n\nYou already failed it recently and need to wait ${hours}h ${minutes}m before retrying.\n\nThis 24-hour cooldown ensures proper learning and prevents rapid retakes.`);
                            return;
                          }
                        }
                      }
                    } catch (error) {
                      console.error('❌ Error checking quiz availability:', error);
                      // Continue with navigation even if check fails
                    }
                    
                    // Navigate to quiz
                    navigate(`/quiz/${courseId}/${id}`);
                  }}
                >
                  {!quizAvailable && <span className="lock-icon">🔒</span>}
                  {quizCompleted && <span className="check-icon">✓</span>}
                  Quiz {id}: {lessons[id].title.split(' ').slice(0, 2).join(' ')}...
                </button>
              );
            })}
          </div>

          {/* Certificate Section - Show when course is completed */}
          {isCourseCompleted() && (
            <div className="sidebar-section certificate-section">
              <h4>🎓 Course Completed!</h4>
              <div className="completion-message" style={{
                fontSize: '14px',
                color: '#28a745',
                marginBottom: '12px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Congratulations! You have completed all modules in the {course?.name} course.
              </div>
              <button
                onClick={handleViewCertificate}
                className="certificate-button"
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '8px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                🏆 View Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
