
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useVoiceAssistant } from "../hooks/useVoiceAssistant";

const NotFound = () => {
  const location = useLocation();
  const { speak } = useVoiceAssistant();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    speak("Page not found. The requested page does not exist in this SAP S/4HANA system. You can return to the home page using the link below.");
  }, [location.pathname, speak]);

  return (
    <div className="min-h-screen flex flex-col bg-sap-bg">
      <header className="bg-white shadow-sm w-full">
        <div className="flex items-center px-4 h-16">
          <div className="h-8 w-14 bg-sap-blue flex items-center justify-center rounded text-white font-bold">
            SAP
          </div>
          <span className="ml-3 font-semibold text-sap-text">Home</span>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-6xl font-light text-sap-blue mb-6">404</div>
          <h1 className="text-2xl font-semibold mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            The page you are looking for does not exist in this SAP S/4HANA system.
          </p>
          <Link
            to="/"
            className="inline-block py-2 px-6 bg-sap-blue text-white rounded hover:bg-sap-light-blue transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
