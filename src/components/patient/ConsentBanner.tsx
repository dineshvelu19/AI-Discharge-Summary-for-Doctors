import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const ConsentBanner = ({ onConsentGiven }: { patientId?: string, onConsentGiven?: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = async () => {
    // In a real app, you would make an API call here to record consent
    // e.g. await fetch(`/api/patients/${patientId}/consent`, { method: 'POST', body: JSON.stringify({ act: 'DPDP_2023', granted: true }) });
    setIsVisible(false);
    if (onConsentGiven) {
      onConsentGiven();
    }
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md shadow-sm transition-all duration-300 animate-[slide-down_0.3s_ease-out]"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ShieldAlert className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            DPDP Act 2023 Compliance Action Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              In accordance with the Digital Personal Data Protection (DPDP) Act 2023, explicit patient consent is required prior to processing or analyzing health records for generating this discharge summary.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1 flex space-x-3">
              <button
                type="button"
                onClick={handleAccept}
                className="rounded-md bg-yellow-100 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 transition-colors duration-200"
              >
                Acknowledge & Record Consent
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleDecline}
              className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 transition-colors duration-200"
            >
              <span className="sr-only">Dismiss consent requirement</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
