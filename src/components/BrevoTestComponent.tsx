import React, { useState } from "react";
import { brevoService } from "../services/brevoService";

export const BrevoTestComponent: React.FC = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<Record<string, unknown> | null>(null);

  const testApiKey = async () => {
    setIsLoading(true);
    setTestResult("Testing API key...");

    try {
      const result = await brevoService.testApiKey();
      setTestResult(result.message);
    } catch (error) {
      setTestResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkContact = async () => {
    if (!contactEmail) return;

    setIsLoading(true);
    setContactInfo(null);

    try {
      const info = await brevoService.getContactInfo(contactEmail);
      setContactInfo(info);
      setTestResult(info ? "Contact found!" : "Contact not found");
    } catch (error) {
      setTestResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Brevo API Key Test</h3>
      <button
        onClick={testApiKey}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
      >
        {isLoading ? "Testing..." : "Test API Key"}
      </button>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Check Contact Status</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter email to check"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={checkContact}
            disabled={isLoading || !contactEmail}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Check Contact
          </button>
        </div>
      </div>

      {testResult && (
        <div className="mt-2 p-2 bg-white border rounded">
          <p className="text-sm">{testResult}</p>
        </div>
      )}

      {contactInfo && (
        <div className="mt-2 p-2 bg-white border rounded">
          <h5 className="font-medium mb-1">Contact Details:</h5>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(contactInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
