import { useState, useEffect, useRef, useCallback } from 'react';
import JsonViewer from '../components/JsonViewer';

interface RequestHeader {
  id: string;
  key: string;
  value: string;
}

interface APIRequest {
  id: string;
  url: string;
  method: string;
  headers: RequestHeader[];
  body: string;
  timestamp: Date;
}

interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  ttfbTime?: number;      // Time to first byte (network latency)
  downloadTime?: number;  // Time to download the response body
  processingTime?: number; // Time to process the response
  networkTime?: number;   // Legacy field, kept for backward compatibility
}

interface SavedRequest {
  id: string;
  name: string;
  request: APIRequest;
}

// Test mode types
type TestMode = 'single' | 'repeated' | 'sequence' | 'transform';

interface RepeatedTestConfig {
  repetitions: number;
  delay: number;
  concurrency: number;
}

interface SequenceStep {
  id: string;
  name: string;
  request: APIRequest;
  extractors?: {
    name: string;
    path: string;
    defaultValue?: string;
  }[];
  condition?: {
    type: 'status' | 'value';
    path?: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: string | number;
  };
}

interface SequenceTestConfig {
  steps: SequenceStep[];
}

interface TransformConfig {
  type: 'increment' | 'random' | 'list' | 'timestamp';
  path: string; // JSON path or 'url' or 'header.{name}'
  start?: number;
  step?: number;
  min?: number;
  max?: number;
  values?: string[];
}

interface TransformTestConfig {
  baseRequest: APIRequest;
  transforms: TransformConfig[];
  repetitions: number;
}

interface TestResult {
  id: string;
  timestamp: Date;
  mode: TestMode;
  summary: {
    totalRequests: number;
    successCount: number;
    failureCount: number;
    minTime: number;
    maxTime: number;
    avgTime: number;
  };
  requests: {
    request: APIRequest;
    response: APIResponse;
  }[];
}

interface NotificationProps {
  message: string;
  content: string;
  isVisible: boolean;
}

export const Notification: React.FC<NotificationProps> = ({ message, content, isVisible }) => {
  return (
    <div
      className={`fixed bottom-8 right-8 bg-gray-800 text-white p-4 rounded-lg shadow-lg border border-theme-primary transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="flex items-start">
        <div className="bg-green-500 rounded-full p-1 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-medium">{message}</p>
          <p className="text-sm text-gray-300 mt-1">{content}</p>
        </div>
      </div>
    </div>
  );
};

const APITester = () => {
  const [url, setUrl] = useState<string>('');
  const [method, setMethod] = useState<string>('GET');
  const [headers, setHeaders] = useState<RequestHeader[]>([
    { id: crypto.randomUUID(), key: '', value: '' }
  ]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [requestHistory, setRequestHistory] = useState<APIRequest[]>([]);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [responseTab, setResponseTab] = useState<'body' | 'headers'>('body');
  const [requestBodyError, setRequestBodyError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; content: string; isVisible: boolean }>({
    message: '',
    content: '',
    isVisible: false
  });
  const [saveRequestName, setSaveRequestName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);

  // Test mode states
  const [testMode, setTestMode] = useState<TestMode>('single');

  // Repeated test config
  const [repeatedTestConfig, setRepeatedTestConfig] = useState<RepeatedTestConfig>({
    repetitions: 5,
    delay: 500,
    concurrency: 1
  });

  // Ethical usage confirmation
  const [hasConfirmedEthicalUsage, setHasConfirmedEthicalUsage] = useState<boolean>(false);

  // Placeholder configs for future implementation
  // These are kept as state variables to maintain the component structure
  // but aren't actively used in the current implementation
  const [_sequenceTestConfig, _setSequenceTestConfig] = useState<SequenceTestConfig>({
    steps: []
  });

  const [_transformTestConfig, _setTransformTestConfig] = useState<TransformTestConfig>({
    baseRequest: {
      id: crypto.randomUUID(),
      url: '',
      method: 'GET',
      headers: [],
      body: '',
      timestamp: new Date()
    },
    transforms: [],
    repetitions: 5
  });

  // Test results
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [selectedRequestIndex, setSelectedRequestIndex] = useState<number | null>(null);
  const [shouldCancelTest, setShouldCancelTest] = useState<boolean>(false);

  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestBodyRef = useRef<HTMLTextAreaElement>(null);

  // Load saved requests from localStorage
  useEffect(() => {
    const savedRequestsData = localStorage.getItem('api-tester-saved-requests');
    if (savedRequestsData) {
      try {
        const parsed = JSON.parse(savedRequestsData);
        setSavedRequests(parsed);
      } catch (error) {
        console.error('Failed to parse saved requests', error);
      }
    }

    const historyData = localStorage.getItem('api-tester-history');
    if (historyData) {
      try {
        const parsed = JSON.parse(historyData);
        setRequestHistory(parsed);
      } catch (error) {
        console.error('Failed to parse request history', error);
      }
    }
  }, []);

  // Save to localStorage when savedRequests or history changes
  useEffect(() => {
    localStorage.setItem('api-tester-saved-requests', JSON.stringify(savedRequests));
  }, [savedRequests]);

  useEffect(() => {
    localStorage.setItem('api-tester-history', JSON.stringify(requestHistory));
  }, [requestHistory]);

  const showNotification = (message: string, content: string) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setNotification({
      message,
      content,
      isVisible: true
    });

    notificationTimerRef.current = setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const addHeader = () => {
    setHeaders([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);
  };

  const removeHeader = (id: string) => {
    setHeaders(headers.filter(header => header.id !== id));
  };

  const updateHeader = (id: string, field: 'key' | 'value', value: string) => {
    setHeaders(
      headers.map(header =>
        header.id === id ? { ...header, [field]: value } : header
      )
    );
  };

  const validateRequestBody = () => {
    if (!requestBody.trim() || method === 'GET') {
      setRequestBodyError(null);
      return true;
    }

    try {
      JSON.parse(requestBody);
      setRequestBodyError(null);
      return true;
    } catch (error) {
      setRequestBodyError('Invalid JSON format');
      return false;
    }
  };

  const formatRequestBody = () => {
    if (!requestBody.trim()) return;

    try {
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // If not valid JSON, don't format
      setRequestBodyError('Invalid JSON format');
    }
  };

  // Execute a single API request and return the response
  const executeSingleRequest = async (
    requestUrl: string,
    requestMethod: string,
    requestHeaders: Record<string, string>,
    requestBody: string
  ): Promise<{ response: APIResponse, error?: Error }> => {
    // Reset performance measurements for this request
    // This ensures each request is measured independently
    const startTime = performance.now();
    let ttfbTime = 0; // Time to first byte (network latency)
    let downloadTime = 0; // Time to download the response
    let processingTime = 0; // Time to process the response

    try {
      // Add a cache-busting parameter to prevent browser caching
      // This helps ensure each request is treated as a new request
      let cacheBustUrl;
      try {
        cacheBustUrl = new URL(requestUrl);
        cacheBustUrl.searchParams.append('_cb', Date.now().toString());
      } catch (error) {
        // If URL parsing fails, use the original URL
        console.warn('Failed to parse URL for cache busting, using original URL', error);
        cacheBustUrl = { toString: () => requestUrl };
      }

      // Create a copy of the headers to avoid modifying the original
      const enhancedHeaders = { ...requestHeaders };

      // Only add cache control headers if they don't already exist
      if (!enhancedHeaders['pragma']) {
        enhancedHeaders['pragma'] = 'no-cache';
      }
      if (!enhancedHeaders['cache-control']) {
        enhancedHeaders['cache-control'] = 'no-cache, no-store, must-revalidate';
      }

      const requestOptions: RequestInit = {
        method: requestMethod,
        headers: enhancedHeaders,
        redirect: 'follow',
        // Note: 'cache' property is not standard in all browsers, so we rely on headers
        credentials: 'same-origin' // Include cookies for same-origin requests
      };

      if (requestMethod !== 'GET' && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      // Use a more accurate approach to measure network timing
      // Create a new controller for each request to ensure isolation
      const controller = new AbortController();
      const signal = controller.signal;
      requestOptions.signal = signal;

      // Start the fetch request with the cache-busting URL
      // Use the original URL if there were issues with the cache-busting URL
      const urlToFetch = cacheBustUrl.toString();
      console.log(`Fetching URL: ${urlToFetch}`);
      const fetchPromise = fetch(urlToFetch, requestOptions);

      // Create a promise that resolves when headers are received
      const headersPromise = fetchPromise.then(response => {
        // Record time to first byte (when headers are received)
        ttfbTime = performance.now() - startTime;
        return response;
      });

      // Wait for the headers to be received
      const response = await headersPromise;

      // Start measuring download and processing time
      const downloadStartTime = performance.now();

      // Get the response data
      let responseData;
      const contentType = response.headers.get('content-type');

      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Calculate download time (time to get the full response body)
        const downloadEndTime = performance.now();
        downloadTime = downloadEndTime - downloadStartTime;

        // Process the response (in this case, just collecting headers)
        const processingStartTime = performance.now();
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        const processingEndTime = performance.now();
        processingTime = processingEndTime - processingStartTime;

        // Total time is ttfb + download + processing
        const totalTime = ttfbTime + downloadTime + processingTime;

        const apiResponse: APIResponse = {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: responseData,
          time: Math.round(totalTime),
          ttfbTime: Math.round(ttfbTime),
          downloadTime: Math.round(downloadTime),
          processingTime: Math.round(processingTime)
        };

        return { response: apiResponse };
      } catch (processingError) {
        console.error('Error processing response', processingError);
        const endTime = performance.now();
        const totalTime = endTime - startTime;

        const apiResponse: APIResponse = {
          status: response.status,
          statusText: response.statusText,
          headers: {},
          data: processingError instanceof Error ? processingError.message : 'Error processing response',
          time: Math.round(totalTime),
          ttfbTime: Math.round(ttfbTime),
          downloadTime: Math.round(downloadTime - processingTime),
          processingTime: 0
        };

        return {
          response: apiResponse,
          error: processingError instanceof Error ? processingError : new Error('Error processing response')
        };
      }
    } catch (error) {
      console.error('API request failed', error);
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Provide more detailed error information
      let errorMessage = 'Unknown error occurred';
      let errorDetails = '';

      if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = error.stack || '';

        // Check for common network errors
        if (error.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
          errorMessage = 'CORS Error: The browser blocked this request due to Cross-Origin Resource Sharing (CORS) restrictions.\n\n' +
            'This is a security feature of web browsers that prevents websites from making requests to different domains unless the server explicitly allows it.\n\n' +
            'Possible solutions:\n' +
            '1. Use an API that supports CORS or has CORS enabled\n' +
            '2. Test with a local API or same-origin API\n' +
            '3. Use a browser extension that disables CORS for testing (not recommended for security reasons)\n' +
            '4. Set up a proxy server that adds the necessary CORS headers';
        }
      }

      console.log(`Request failed with error: ${errorMessage}`);

      const apiResponse: APIResponse = {
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: `${errorMessage}\n${errorDetails}`,
        time: Math.round(totalTime),
        ttfbTime: Math.round(ttfbTime),
        downloadTime: 0,
        processingTime: 0
      };

      return {
        response: apiResponse,
        error: error instanceof Error ? error : new Error(errorMessage)
      };
    }
  };

  // Execute repeated requests
  const executeRepeatedRequests = async () => {
    if (!url.trim()) {
      showNotification('Error', 'Please enter a URL');
      return;
    }

    if (!validateRequestBody()) {
      showNotification('Error', 'Invalid JSON in request body');
      return;
    }

    if (!hasConfirmedEthicalUsage) {
      showNotification('Error', 'Please confirm that you have permission to test this endpoint');
      return;
    }

    // Apply rate limiting safeguards
    if (repeatedTestConfig.repetitions > 50) {
      showNotification('Warning', 'For ethical reasons, repetitions have been limited to 50');
      setRepeatedTestConfig(prev => ({...prev, repetitions: 50}));
    }

    if (repeatedTestConfig.concurrency > 5) {
      showNotification('Warning', 'For ethical reasons, concurrency has been limited to 5');
      setRepeatedTestConfig(prev => ({...prev, concurrency: 5}));
    }

    if (repeatedTestConfig.delay < 100 && repeatedTestConfig.repetitions > 10) {
      showNotification('Warning', 'For ethical reasons, delay has been increased to 100ms');
      setRepeatedTestConfig(prev => ({...prev, delay: 100}));
    }

    // Reset state for new test
    setIsTestRunning(true);
    setTestProgress(0);
    setResponse(null);
    setActiveTab('response');
    setShouldCancelTest(false);

    const requestHeaders: Record<string, string> = {};
    headers.forEach(header => {
      if (header.key.trim() && header.value.trim()) {
        requestHeaders[header.key] = header.value;
      }
    });

    const results: { request: APIRequest; response: APIResponse }[] = [];
    const totalRequests = repeatedTestConfig.repetitions;
    let completedRequests = 0;

    // Function to update live results and create a partial test result
    const updateLiveResults = (newResults: { request: APIRequest; response: APIResponse }[]) => {
      // Recalculate stats from scratch for accuracy
      let recalcTotalTime = 0;
      let recalcMinTime = Number.MAX_VALUE;
      let recalcMaxTime = 0;
      let recalcSuccessCount = 0;

      // Calculate stats based on all completed requests
      newResults.forEach(result => {
        if (result.response.status >= 200 && result.response.status < 300) {
          recalcSuccessCount++;
        }

        if (result.response.time > 0) {
          recalcTotalTime += result.response.time;
          recalcMinTime = Math.min(recalcMinTime, result.response.time);
          recalcMaxTime = Math.max(recalcMaxTime, result.response.time);
        }
      });

      // Calculate current average time based on recalculated values
      const currentAvgTime = recalcSuccessCount > 0 ? Math.round(recalcTotalTime / recalcSuccessCount) : 0;

      // Create partial test result
      const partialTestResult: TestResult = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        mode: 'repeated',
        summary: {
          totalRequests: completedRequests,
          successCount: recalcSuccessCount,
          failureCount: completedRequests - recalcSuccessCount,
          minTime: recalcMinTime === Number.MAX_VALUE ? 0 : recalcMinTime,
          maxTime: recalcMaxTime,
          avgTime: currentAvgTime
        },
        requests: newResults
      };

      setTestResults(partialTestResult);

      // Set the last response as the current response
      if (newResults.length > 0) {
        setResponse(newResults[newResults.length - 1].response);
      }
    };

    try {
      // Create a queue of requests based on concurrency
      const concurrency = Math.min(repeatedTestConfig.concurrency, totalRequests);
      const delay = repeatedTestConfig.delay;

      // Function to process a single request in the queue
      const processRequest = async (_index: number) => {
        // Check if test should be cancelled
        if (shouldCancelTest) {
          return null;
        }

        // Add a minimal delay before each request to ensure they're properly separated
        // Just enough to prevent browser connection pooling issues without affecting timing
        const preRequestDelay = 5; // Fixed small delay
        await new Promise(resolve => setTimeout(resolve, preRequestDelay));

        const requestId = crypto.randomUUID();
        const requestTimestamp = new Date();

        const { response } = await executeSingleRequest(url, method, requestHeaders, requestBody);

        const request: APIRequest = {
          id: requestId,
          url,
          method,
          headers: headers.filter(h => h.key.trim() && h.value.trim()),
          body: requestBody,
          timestamp: requestTimestamp
        };

        results.push({ request, response });
        completedRequests++;

        // Update progress and live results
        setTestProgress(Math.round((completedRequests / totalRequests) * 100));
        updateLiveResults([...results]); // Create a new array to trigger state update

        return response;
      };

      // Process requests with concurrency and delay
      outerLoop: for (let i = 0; i < totalRequests; i += concurrency) {
        // Check if test should be cancelled
        if (shouldCancelTest) {
          break;
        }

        const batch = [];
        for (let j = 0; j < concurrency && i + j < totalRequests; j++) {
          // Add a minimal staggered delay within the batch to prevent network congestion
          // Just enough to ensure requests don't interfere with each other
          if (j > 0) {
            // Small fixed delay between requests in the same batch
            const staggerDelay = 5;
            await new Promise(resolve => setTimeout(resolve, staggerDelay));
          }
          batch.push(processRequest(i + j));
        }

        const batchResults = await Promise.all(batch);

        // If any result is null, it means the test was cancelled
        if (batchResults.includes(null)) {
          break outerLoop;
        }

        if (i + concurrency < totalRequests && delay > 0 && !shouldCancelTest) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Recalculate all stats from scratch for the final result
      let finalTotalTime = 0;
      let finalMinTime = Number.MAX_VALUE;
      let finalMaxTime = 0;
      let finalSuccessCount = 0;
      let finalFailureCount = 0;

      // Calculate stats based on all completed requests
      results.forEach(result => {
        if (result.response.status >= 200 && result.response.status < 300) {
          finalSuccessCount++;
        } else {
          finalFailureCount++;
        }

        if (result.response.time > 0) {
          finalTotalTime += result.response.time;
          finalMinTime = Math.min(finalMinTime, result.response.time);
          finalMaxTime = Math.max(finalMaxTime, result.response.time);
        }
      });

      // Calculate final average time
      const avgTime = finalSuccessCount > 0 ? Math.round(finalTotalTime / finalSuccessCount) : 0;

      // Create final test result
      const testResult: TestResult = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        mode: 'repeated',
        summary: {
          totalRequests: completedRequests,
          successCount: finalSuccessCount,
          failureCount: finalFailureCount,
          minTime: finalMinTime === Number.MAX_VALUE ? 0 : finalMinTime,
          maxTime: finalMaxTime,
          avgTime
        },
        requests: results
      };

      setTestResults(testResult);

      // Set the last response as the current response
      if (results.length > 0) {
        setResponse(results[results.length - 1].response);
      }

      if (shouldCancelTest) {
        showNotification(
          'Test Stopped',
          `Completed ${finalSuccessCount}/${completedRequests} requests successfully before stopping. Avg: ${avgTime}ms`
        );
      } else {
        showNotification(
          'Repeated Test Completed',
          `Completed ${finalSuccessCount}/${totalRequests} requests successfully. Avg: ${avgTime}ms, Min: ${finalMinTime === Number.MAX_VALUE ? 0 : finalMinTime}ms, Max: ${finalMaxTime}ms`
        );
      }
    } catch (error) {
      console.error('Repeated test failed', error);
      showNotification('Test Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsTestRunning(false);
      setShouldCancelTest(false);
      setTestProgress(100);
    }
  };

  // Function to stop a running test
  const stopTest = () => {
    if (isTestRunning) {
      setShouldCancelTest(true);
      showNotification('Stopping Test', 'The test will stop after the current batch of requests completes');
    }
  };

  // Execute a sequence of requests
  const executeSequenceRequests = async () => {
    // Implementation will be added later
    showNotification('Not Implemented', 'Sequence testing is not yet implemented');
  };

  // Execute transform requests
  const executeTransformRequests = async () => {
    // Implementation will be added later
    showNotification('Not Implemented', 'Transform testing is not yet implemented');
  };

  // Main send request function that delegates to the appropriate test mode
  const sendRequest = async () => {
    if (!url.trim()) {
      showNotification('Error', 'Please enter a URL');
      return;
    }

    if (!validateRequestBody()) {
      showNotification('Error', 'Invalid JSON in request body');
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setActiveTab('response');

    const requestHeaders: Record<string, string> = {};
    headers.forEach(header => {
      if (header.key.trim() && header.value.trim()) {
        requestHeaders[header.key] = header.value;
      }
    });

    try {
      // Execute based on test mode
      if (testMode === 'single') {
        const { response: apiResponse } = await executeSingleRequest(url, method, requestHeaders, requestBody);

        setResponse(apiResponse);

        // Add to history
        const newRequest: APIRequest = {
          id: crypto.randomUUID(),
          url,
          method,
          headers: headers.filter(h => h.key.trim() && h.value.trim()),
          body: requestBody,
          timestamp: new Date()
        };

        setRequestHistory(prev => [newRequest, ...prev.slice(0, 9)]);

        showNotification(
          'Request Completed',
          `Status: ${apiResponse.status} ${apiResponse.statusText} (${apiResponse.time}ms)`
        );
      } else if (testMode === 'repeated') {
        await executeRepeatedRequests();
      } else if (testMode === 'sequence') {
        await executeSequenceRequests();
      } else if (testMode === 'transform') {
        await executeTransformRequests();
      }
    } catch (error) {
      console.error('API request failed', error);
      setResponse({
        status: 0,
        statusText: 'Request Failed',
        headers: {},
        data: error instanceof Error ? error.message : 'Unknown error occurred',
        time: 0
      });

      showNotification('Request Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequest = (request: APIRequest) => {
    setUrl(request.url);
    setMethod(request.method);
    setHeaders(request.headers.length > 0
      ? request.headers
      : [{ id: crypto.randomUUID(), key: '', value: '' }]
    );
    setRequestBody(request.body);
    setActiveTab('request');
  };

  const saveCurrentRequest = () => {
    if (!url.trim()) {
      showNotification('Error', 'Please enter a URL before saving');
      return;
    }

    if (!saveRequestName.trim()) {
      showNotification('Error', 'Please enter a name for this request');
      return;
    }

    const newSavedRequest: SavedRequest = {
      id: crypto.randomUUID(),
      name: saveRequestName,
      request: {
        id: crypto.randomUUID(),
        url,
        method,
        headers: headers.filter(h => h.key.trim() && h.value.trim()),
        body: requestBody,
        timestamp: new Date()
      }
    };

    setSavedRequests(prev => [...prev, newSavedRequest]);
    setShowSaveDialog(false);
    setSaveRequestName('');
    showNotification('Request Saved', `"${saveRequestName}" has been saved to your collection`);
  };

  const deleteSavedRequest = (id: string) => {
    setSavedRequests(prev => prev.filter(req => req.id !== id));
    showNotification('Request Deleted', 'The saved request has been removed from your collection');
  };

  const clearHistory = () => {
    setRequestHistory([]);
    showNotification('History Cleared', 'Your request history has been cleared');
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Enter to send request
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      sendRequest();
    }

    // Ctrl+Tab to switch between request and response tabs
    if (e.ctrlKey && e.key === 'Tab') {
      e.preventDefault();
      setActiveTab(prev => prev === 'request' ? 'response' : 'request');
    }

    // Ctrl+Shift+F to format JSON
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      if (activeTab === 'request' && method !== 'GET') {
        formatRequestBody();
      }
    }
  }, [activeTab, method, formatRequestBody]);

  // Set up keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-theme-gradient-start via-theme-gradient-middle to-theme-gradient-end flex flex-col items-center justify-start py-12 px-4 transition-colors duration-300">
      {/* Notification */}
      <Notification
        message={notification.message}
        content={notification.content}
        isVisible={notification.isVisible}
      />

      {/* Save Request Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-theme-border">
            <h3 className="text-xl font-bold text-white mb-4">Save Request</h3>
            <input
              type="text"
              value={saveRequestName}
              onChange={(e) => setSaveRequestName(e.target.value)}
              placeholder="Enter a name for this request"
              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentRequest}
                className="px-4 py-2 bg-theme-primary text-white rounded-md hover:bg-theme-primary/80"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Heading */}
      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-8 border border-theme-border/30 mb-8 dark:bg-black/80 dark:border-white/20">
        <h1 className="text-5xl md:text-6xl font-extrabold font-saira text-theme-primary drop-shadow-lg mb-4 text-center">
          API Tester
        </h1>
        <section className="text-center">
          <p className="text-xl max-w-3xl mx-auto text-gray-100 font-medium shadow-sm mb-4">
            Test your API endpoints with our intuitive API testing tool. Send requests, view responses, and debug your APIs with ease.
          </p>
        </section>
      </div>

      {/* API Tester Tool */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Saved Requests & History */}
            <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4 border border-gray-700">
              <div className="mb-6">
                <h2 className="text-xl font-saira text-theme-primary font-semibold mb-3">Saved Requests</h2>
                {savedRequests.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {savedRequests.map((saved) => (
                      <div
                        key={saved.id}
                        className="bg-gray-800 rounded p-2 border border-gray-700 hover:border-theme-primary cursor-pointer group"
                      >
                        <div className="flex justify-between items-center">
                          <div
                            className="flex-1 truncate"
                            onClick={() => loadRequest(saved.request)}
                          >
                            <span className="font-medium text-white">{saved.name}</span>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <span className={`px-2 py-0.5 rounded ${
                                saved.request.method === 'GET' ? 'bg-green-800 text-green-200' :
                                saved.request.method === 'POST' ? 'bg-blue-800 text-blue-200' :
                                saved.request.method === 'PUT' ? 'bg-yellow-800 text-yellow-200' :
                                saved.request.method === 'DELETE' ? 'bg-red-800 text-red-200' :
                                'bg-gray-700 text-gray-300'
                              }`}>
                                {saved.request.method}
                              </span>
                              <span className="ml-2 truncate">{saved.request.url}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteSavedRequest(saved.id)}
                            className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No saved requests yet. Save your frequently used requests for quick access.</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-saira text-theme-primary font-semibold">History</h2>
                  {requestHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-400"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {requestHistory.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {requestHistory.map((request) => (
                      <div
                        key={request.id}
                        className="bg-gray-800 rounded p-2 border border-gray-700 hover:border-theme-primary cursor-pointer"
                        onClick={() => loadRequest(request)}
                      >
                        <div className="flex items-center">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            request.method === 'GET' ? 'bg-green-800 text-green-200' :
                            request.method === 'POST' ? 'bg-blue-800 text-blue-200' :
                            request.method === 'PUT' ? 'bg-yellow-800 text-yellow-200' :
                            request.method === 'DELETE' ? 'bg-red-800 text-red-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {request.method}
                          </span>
                          <span className="ml-2 text-sm text-gray-300 truncate flex-1">{request.url}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(request.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No request history yet. Your recent requests will appear here.</p>
                )}
              </div>
            </div>

            {/* Main Content - Request & Response */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'request'
                      ? 'text-theme-primary border-b-2 border-theme-primary'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('request')}
                >
                  Request
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'response'
                      ? 'text-theme-primary border-b-2 border-theme-primary'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('response')}
                >
                  Response
                  {response && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-green-800 text-green-200'
                        : response.status >= 400
                        ? 'bg-red-800 text-red-200'
                        : 'bg-yellow-800 text-yellow-200'
                    }`}>
                      {response.status}
                    </span>
                  )}
                </button>
              </div>

              {/* Request Panel */}
              {activeTab === 'request' && (
                <div>
                  {/* Test Mode Selection */}
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Test Mode</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        onClick={() => setTestMode('single')}
                        className={`p-3 rounded-lg border transition-all ${
                          testMode === 'single'
                            ? 'bg-theme-primary/20 border-theme-primary text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">Single Request</div>
                        <div className="text-xs mt-1 text-gray-400">Standard API request</div>
                      </button>
                      <button
                        onClick={() => setTestMode('repeated')}
                        className={`p-3 rounded-lg border transition-all ${
                          testMode === 'repeated'
                            ? 'bg-theme-primary/20 border-theme-primary text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">Repeated Requests</div>
                        <div className="text-xs mt-1 text-gray-400">Stress/performance testing</div>
                      </button>
                      <button
                        onClick={() => setTestMode('sequence')}
                        className={`p-3 rounded-lg border transition-all ${
                          testMode === 'sequence'
                            ? 'bg-theme-primary/20 border-theme-primary text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">Sequence Testing</div>
                        <div className="text-xs mt-1 text-gray-400">Chain multiple requests</div>
                      </button>
                      <button
                        onClick={() => setTestMode('transform')}
                        className={`p-3 rounded-lg border transition-all ${
                          testMode === 'transform'
                            ? 'bg-theme-primary/20 border-theme-primary text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">Transform Testing</div>
                        <div className="text-xs mt-1 text-gray-400">Modify parameters between calls</div>
                      </button>
                    </div>
                  </div>

                  {/* Test Mode Configuration */}
                  {testMode === 'repeated' && (
                    <div className="mb-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium text-white mb-3">Repeated Request Configuration</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">Number of Repetitions</label>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={repeatedTestConfig.repetitions}
                              onChange={(e) => setRepeatedTestConfig({
                                ...repeatedTestConfig,
                                repetitions: Math.max(1, parseInt(e.target.value) || 1)
                              })}
                              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2">Delay Between Requests (ms)</label>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              value={repeatedTestConfig.delay}
                              onChange={(e) => setRepeatedTestConfig({
                                ...repeatedTestConfig,
                                delay: Math.max(0, parseInt(e.target.value) || 0)
                              })}
                              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-300 mb-2">Concurrency Level</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={repeatedTestConfig.concurrency}
                              onChange={(e) => setRepeatedTestConfig({
                                ...repeatedTestConfig,
                                concurrency: Math.max(1, parseInt(e.target.value) || 1)
                              })}
                              className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                            />
                          </div>
                        </div>

                        <div className="mt-3 bg-blue-900/30 p-3 rounded border border-blue-700/50">
                          <p className="text-gray-300 text-sm">
                            <strong>Repetitions:</strong> Total number of requests to send<br />
                            <strong>Delay:</strong> Time to wait between batches of requests (in milliseconds)<br />
                            <strong>Concurrency:</strong> Number of simultaneous requests to send in each batch
                          </p>
                        </div>

                        {/* Ethical Usage Warning */}
                        <div className="mt-3 bg-red-900/30 p-3 rounded border border-red-700/50">
                          <h4 className="text-red-400 font-medium flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Important: Ethical Usage Warning
                          </h4>
                          <p className="text-gray-300 text-sm mb-2">
                            Sending repeated requests to an API endpoint without permission may be considered a Denial of Service (DoS) attack and could:
                          </p>
                          <ul className="list-disc list-inside text-gray-300 text-sm mb-3 ml-2">
                            <li>Violate the API provider's terms of service</li>
                            <li>Potentially cause service disruptions</li>
                            <li>Result in your IP address being blocked</li>
                            <li>Have legal consequences in some jurisdictions</li>
                          </ul>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="ethical-usage-confirmation"
                              checked={hasConfirmedEthicalUsage}
                              onChange={(e) => setHasConfirmedEthicalUsage(e.target.checked)}
                              className="h-4 w-4 text-theme-primary focus:ring-theme-primary border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor="ethical-usage-confirmation" className="ml-2 block text-sm text-gray-300">
                              I confirm that I have permission to test this endpoint and will use this tool responsibly
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {testMode === 'sequence' && (
                    <div className="mb-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium text-white mb-3">Sequence Testing</h3>
                        <p className="text-gray-400 mb-2">
                          This feature allows you to chain multiple requests together, extracting data from previous responses to use in subsequent requests.
                        </p>
                        <div className="bg-yellow-900/30 p-3 rounded border border-yellow-700/50">
                          <p className="text-yellow-300 text-sm">
                            Sequence testing is coming soon. Please check back later!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {testMode === 'transform' && (
                    <div className="mb-4">
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <h3 className="text-lg font-medium text-white mb-3">Transform Testing</h3>
                        <p className="text-gray-400 mb-2">
                          This feature allows you to make multiple requests with automatically transformed parameters (incremented values, random values, etc.).
                        </p>
                        <div className="bg-yellow-900/30 p-3 rounded border border-yellow-700/50">
                          <p className="text-yellow-300 text-sm">
                            Transform testing is coming soon. Please check back later!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="md:w-1/4">
                        <select
                          value={method}
                          onChange={(e) => setMethod(e.target.value)}
                          className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                          <option value="PATCH">PATCH</option>
                          <option value="HEAD">HEAD</option>
                          <option value="OPTIONS">OPTIONS</option>
                        </select>
                      </div>
                      <div className="md:w-3/4 flex">
                        <input
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Enter API URL (e.g. https://api.example.com/data)"
                          className="flex-1 bg-gray-700 text-white rounded-l-md py-2 px-3 border border-gray-600"
                        />
                        <button
                          onClick={sendRequest}
                          disabled={isLoading || isTestRunning}
                          className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-r-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isLoading || isTestRunning ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              {testMode === 'single' ? 'Sending...' : `Testing (${testProgress}%)...`}
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                              </svg>
                              {testMode === 'single' ? 'Send' : 'Run Test'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-white mb-2">Headers</h3>
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                      {headers.map((header) => (
                        <div key={header.id} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={header.key}
                            onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                            placeholder="Header name"
                            className="flex-1 bg-gray-700 text-white rounded-l-md py-2 px-3 border border-gray-600"
                          />
                          <input
                            type="text"
                            value={header.value}
                            onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                            placeholder="Value"
                            className="flex-1 bg-gray-700 text-white py-2 px-3 border-t border-b border-gray-600"
                          />
                          <button
                            onClick={() => removeHeader(header.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-r-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addHeader}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-md text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Header
                      </button>
                    </div>
                  </div>

                  {method !== 'GET' && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-white">Request Body</h3>
                        <button
                          onClick={formatRequestBody}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded"
                        >
                          Format JSON
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                        <textarea
                          ref={requestBodyRef}
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          placeholder="Enter request body (JSON)"
                          className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 font-mono h-60 resize-none"
                        />
                        {requestBodyError && (
                          <p className="text-red-400 text-sm mt-1">{requestBodyError}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowSaveDialog(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Request
                    </button>
                    <button
                      onClick={sendRequest}
                      disabled={isLoading}
                      className="bg-theme-primary hover:bg-theme-primary/80 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                          Send Request
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Response Panel */}
              {activeTab === 'response' && (
                <div>
                  {response ? (
                    <>
                      {/* Test Results Summary (for repeated tests) */}
                      {testResults && testResults.mode === 'repeated' && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium text-white">Test Results Summary</h3>
                            {testResults.summary.totalRequests < repeatedTestConfig.repetitions && (
                              <div className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded-md">
                                Test stopped early ({testResults.summary.totalRequests}/{repeatedTestConfig.repetitions} requests completed)
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                              <div className="text-3xl font-bold text-theme-primary mb-1">
                                {testResults.summary.successCount}/{testResults.summary.totalRequests}
                              </div>
                              <div className="text-sm text-gray-400">Successful Requests</div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                              <div className="text-3xl font-bold text-theme-primary mb-1">
                                {testResults.summary.avgTime}ms
                              </div>
                              <div className="text-sm text-gray-400">Average Response Time</div>
                            </div>

                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 text-center">
                              <div className="text-3xl font-bold text-theme-primary mb-1">
                                {testResults.summary.minTime}ms / {testResults.summary.maxTime}ms
                              </div>
                              <div className="text-sm text-gray-400">Min / Max Response Time</div>
                            </div>
                          </div>

                          {/* Response Time Distribution Chart (improved version) */}
                          <div className="mb-4">
                            <h4 className="text-md font-medium text-white mb-2">Response Time Distribution</h4>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>0ms</span>
                                <span>{Math.round(testResults.summary.maxTime / 2)}ms</span>
                                <span>{testResults.summary.maxTime}ms</span>
                              </div>
                              <div className="h-32 flex items-end relative">
                                {/* Time markers */}
                                <div className="absolute inset-0 border-t border-gray-700 top-1/4"></div>
                                <div className="absolute inset-0 border-t border-gray-700 top-1/2"></div>
                                <div className="absolute inset-0 border-t border-gray-700 top-3/4"></div>

                                {/* Sort requests by index, not by response time */}
                                {testResults.requests.map((req, index) => {
                                  // Calculate height percentage with a minimum of 8% for visibility
                                  const heightPercentage = testResults.summary.maxTime > 0
                                    ? Math.max(8, (req.response.time / testResults.summary.maxTime) * 100)
                                    : 8;

                                  return (
                                    <div
                                      key={index}
                                      className="flex-1 mx-0.5 flex flex-col items-center group cursor-pointer"
                                      onClick={() => setSelectedRequestIndex(index)}
                                    >
                                      <div className="w-full flex justify-center">
                                        <div
                                          className={`w-full max-w-[20px] rounded-t ${
                                            req.response.status >= 200 && req.response.status < 300
                                              ? 'bg-green-600 group-hover:bg-green-500'
                                              : req.response.status >= 400
                                              ? 'bg-red-600 group-hover:bg-red-500'
                                              : 'bg-yellow-600 group-hover:bg-yellow-500'
                                          } transition-colors`}
                                          style={{
                                            height: `${heightPercentage}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {req.response.time}ms
                                      </div>

                                      {/* Tooltip on hover with detailed timing */}
                                      <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-56">
                                        <div className="font-bold mb-1">Request #{index + 1}</div>
                                        <div className="flex justify-between mb-1">
                                          <span>Status:</span>
                                          <span className={`${
                                            req.response.status >= 200 && req.response.status < 300
                                              ? 'text-green-400'
                                              : req.response.status >= 400
                                              ? 'text-red-400'
                                              : 'text-yellow-400'
                                          }`}>
                                            {req.response.status} {req.response.statusText}
                                          </span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                          <span>Total Time:</span>
                                          <span>{req.response.time}ms</span>
                                        </div>
                                        {req.response.ttfbTime !== undefined && (
                                          <div className="flex justify-between mb-1">
                                            <span>TTFB:</span>
                                            <span>{req.response.ttfbTime}ms</span>
                                          </div>
                                        )}
                                        {req.response.downloadTime !== undefined && (
                                          <div className="flex justify-between mb-1">
                                            <span>Download:</span>
                                            <span>{req.response.downloadTime}ms</span>
                                          </div>
                                        )}
                                        {req.response.processingTime !== undefined && (
                                          <div className="flex justify-between mb-1">
                                            <span>Processing:</span>
                                            <span>{req.response.processingTime}ms</span>
                                          </div>
                                        )}
                                        <div className="mt-1 text-gray-400 text-center text-[10px]">
                                          Click to view details
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Request #1</span>
                                <span>Request #{testResults.requests.length}</span>
                              </div>
                            </div>
                          </div>
                          </div>
                      )};

                          {/* Status Code Distribution */}
                          <div>
                            <h4 className="text-md font-medium text-white mb-2">Status Code Distribution</h4>
                            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              {(() => {
                                const statusCounts: Record<number, number> = {};
                                testResults?.requests.forEach(req => {
                                  const status = req.response.status;
                                  statusCounts[status] = (statusCounts[status] || 0) + 1;
                                });

                                return Object.entries(statusCounts).map(([status, count]) => {
                                  const statusNum = parseInt(status);
                                  const percentage = testResults?.requests.length ? (count / testResults.requests.length) * 100 : 0;

                                  return (
                                    <div key={status} className="mb-2 last:mb-0">
                                      <div className="flex justify-between mb-1">
                                        <span className={`text-sm ${
                                          statusNum >= 200 && statusNum < 300
                                            ? 'text-green-400'
                                            : statusNum >= 400
                                            ? 'text-red-400'
                                            : 'text-yellow-400'
                                        }`}>
                                          {status} ({count} requests)
                                        </span>
                                        <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                                      </div>
                                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div
                                          className={`h-2.5 rounded-full ${
                                            statusNum >= 200 && statusNum < 300
                                              ? 'bg-green-600'
                                              : statusNum >= 400
                                              ? 'bg-red-600'
                                              : 'bg-yellow-600'
                                          }`}
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>

                          {/* Detailed Request History */}
                          <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-md font-medium text-white">Detailed Request History</h4>
                              <button
                                onClick={() => selectedRequestIndex === null ? setSelectedRequestIndex(0) : setSelectedRequestIndex(null)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded"
                              >
                                {selectedRequestIndex !== null ? 'Show All' : 'Collapse All'}
                              </button>
                            </div>

                            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                              {selectedRequestIndex !== null && testResults ? (
                                // Show single selected request
                                <div className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <h5 className="font-medium text-theme-primary">
                                      Request #{selectedRequestIndex + 1}
                                    </h5>
                                    <div className={`px-2 py-0.5 rounded text-xs ${
                                      testResults.requests[selectedRequestIndex].response.status >= 200 &&
                                      testResults.requests[selectedRequestIndex].response.status < 300
                                        ? 'bg-green-800 text-green-200'
                                        : testResults.requests[selectedRequestIndex].response.status >= 400
                                        ? 'bg-red-800 text-red-200'
                                        : 'bg-yellow-800 text-yellow-200'
                                    }`}>
                                      {testResults.requests[selectedRequestIndex].response.status}
                                      {testResults.requests[selectedRequestIndex].response.statusText}
                                      {' '}
                                      ({testResults.requests[selectedRequestIndex].response.time}ms)
                                    </div>
                                  </div>

                                  {/* Request Details */}
                                  <div className="mb-4">
                                    <h6 className="text-sm font-medium text-gray-300 mb-2">Request</h6>
                                    <div className="bg-gray-900 rounded p-3 text-sm">
                                      <div className="flex mb-2">
                                        <span className="text-theme-primary font-mono w-20">Method:</span>
                                        <span className="text-gray-300">{testResults.requests[selectedRequestIndex].request.method}</span>
                                      </div>
                                      <div className="flex mb-2">
                                        <span className="text-theme-primary font-mono w-20">URL:</span>
                                        <span className="text-gray-300 break-all">{testResults.requests[selectedRequestIndex].request.url}</span>
                                      </div>

                                      {/* Headers */}
                                      <div className="mb-2">
                                        <span className="text-theme-primary font-mono">Headers:</span>
                                        {testResults.requests[selectedRequestIndex].request.headers.length > 0 ? (
                                          <div className="ml-4 mt-1">
                                            {testResults.requests[selectedRequestIndex].request.headers.map((header, i) => (
                                              <div key={i} className="flex text-gray-300">
                                                <span className="text-gray-400 mr-2">{header.key}:</span>
                                                <span>{header.value}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-gray-500 ml-2">No headers</span>
                                        )}
                                      </div>

                                      {/* Body */}
                                      {testResults.requests[selectedRequestIndex].request.body && (
                                        <div>
                                          <span className="text-theme-primary font-mono">Body:</span>
                                          <pre className="ml-4 mt-1 text-gray-300 overflow-auto max-h-40 bg-gray-800 p-2 rounded">
                                            {testResults.requests[selectedRequestIndex].request.body}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Response Details */}
                                  <div>
                                    <h6 className="text-sm font-medium text-gray-300 mb-2">Response</h6>
                                    <div className="bg-gray-900 rounded p-3 text-sm">
                                      <div className="flex mb-2">
                                        <span className="text-theme-primary font-mono w-20">Status:</span>
                                        <span className={`${
                                          testResults.requests[selectedRequestIndex].response.status >= 200 &&
                                          testResults.requests[selectedRequestIndex].response.status < 300
                                            ? 'text-green-400'
                                            : testResults.requests[selectedRequestIndex].response.status >= 400
                                            ? 'text-red-400'
                                            : 'text-yellow-400'
                                        }`}>
                                          {testResults.requests[selectedRequestIndex].response.status}
                                          {' '}
                                          {testResults.requests[selectedRequestIndex].response.statusText}
                                        </span>
                                      </div>
                                      <div className="flex mb-2">
                                        <span className="text-theme-primary font-mono w-20">Total Time:</span>
                                        <span className="text-gray-300">{testResults.requests[selectedRequestIndex].response.time}ms</span>
                                      </div>

                                      {testResults.requests[selectedRequestIndex].response.ttfbTime !== undefined && (
                                        <div className="flex mb-2">
                                          <span className="text-theme-primary font-mono w-20">TTFB:</span>
                                          <span className="text-gray-300">{testResults.requests[selectedRequestIndex].response.ttfbTime}ms</span>
                                          <span className="text-gray-500 text-xs ml-2 self-center">(Time to first byte)</span>
                                        </div>
                                      )}

                                      {testResults.requests[selectedRequestIndex].response.downloadTime !== undefined && (
                                        <div className="flex mb-2">
                                          <span className="text-theme-primary font-mono w-20">Download:</span>
                                          <span className="text-gray-300">{testResults.requests[selectedRequestIndex].response.downloadTime}ms</span>
                                          <span className="text-gray-500 text-xs ml-2 self-center">(Time to download response body)</span>
                                        </div>
                                      )}

                                      {testResults.requests[selectedRequestIndex].response.processingTime !== undefined && (
                                        <div className="flex mb-2">
                                          <span className="text-theme-primary font-mono w-20">Processing:</span>
                                          <span className="text-gray-300">{testResults.requests[selectedRequestIndex].response.processingTime}ms</span>
                                          <span className="text-gray-500 text-xs ml-2 self-center">(Time to process response)</span>
                                        </div>
                                      )}

                                      {/* Headers */}
                                      <div className="mb-2">
                                        <span className="text-theme-primary font-mono">Headers:</span>
                                        {Object.keys(testResults.requests[selectedRequestIndex].response.headers).length > 0 ? (
                                          <div className="ml-4 mt-1">
                                            {Object.entries(testResults.requests[selectedRequestIndex].response.headers).map(([key, value], i) => (
                                              <div key={i} className="flex text-gray-300">
                                                <span className="text-gray-400 mr-2">{key}:</span>
                                                <span>{value}</span>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="text-gray-500 ml-2">No headers</span>
                                        )}
                                      </div>

                                      {/* Body */}
                                      <div>
                                        <span className="text-theme-primary font-mono">Body:</span>
                                        <div className="ml-4 mt-1 overflow-auto max-h-40">
                                          {typeof testResults.requests[selectedRequestIndex].response.data === 'object' ? (
                                            <JsonViewer
                                              data={testResults.requests[selectedRequestIndex].response.data}
                                              maxHeight="40vh"
                                            />
                                          ) : (
                                            <div className="bg-gray-800 p-2 rounded">
                                              <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                                                {testResults.requests[selectedRequestIndex].response.data}
                                              </pre>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : testResults ? (
                                // Show all requests in a list
                                <div className="divide-y divide-gray-700">
                                  {testResults.requests.map((req, index) => (
                                    <div
                                      key={index}
                                      className="p-3 hover:bg-gray-700 cursor-pointer transition-colors"
                                      onClick={() => setSelectedRequestIndex(index)}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                          <span className="text-gray-400 mr-2">#{index + 1}</span>
                                          <span className={`px-2 py-0.5 rounded text-xs ${
                                            req.response.status >= 200 && req.response.status < 300
                                              ? 'bg-green-800 text-green-200'
                                              : req.response.status >= 400
                                              ? 'bg-red-800 text-red-200'
                                              : 'bg-yellow-800 text-yellow-200'
                                          }`}>
                                            {req.response.status}
                                          </span>
                                          <span className="ml-2 text-gray-300">{req.request.method}</span>
                                          <span className="ml-2 text-gray-500 truncate max-w-[300px]">{req.request.url}</span>
                                        </div>
                                        <div className="text-gray-400 text-sm">{req.response.time}ms</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>


                      {/* Individual Response Details */}
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                              response.status >= 200 && response.status < 300
                                ? 'bg-green-800 text-green-200'
                                : response.status >= 400
                                ? 'bg-red-800 text-red-200'
                                : 'bg-yellow-800 text-yellow-200'
                            }`}>
                              {response.status} {response.statusText}
                            </span>
                            <span className="ml-3 text-gray-400">
                              {response.time > 0 ? `${response.time}ms` : ''}
                            </span>
                            {testResults && testResults.mode !== 'single' && (
                              <span className="ml-3 text-gray-400 text-sm">
                                Showing last response of {testResults.requests.length} requests
                              </span>
                            )}
                          </div>
                          <div className="flex">
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-l-md ${
                                responseTab === 'body'
                                  ? 'bg-theme-primary text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                              onClick={() => setResponseTab('body')}
                            >
                              Body
                            </button>
                            <button
                              className={`py-1 px-3 text-sm font-medium rounded-r-md ${
                                responseTab === 'headers'
                                  ? 'bg-theme-primary text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                              onClick={() => setResponseTab('headers')}
                            >
                              Headers
                            </button>
                          </div>
                        </div>

                        {responseTab === 'body' && (
                          <div className="overflow-auto max-h-96">
                            {typeof response.data === 'object' ? (
                              <JsonViewer data={response.data} maxHeight="96vh" />
                            ) : (
                              <div className="bg-gray-800 rounded-md p-3 border border-gray-700">
                                <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
                                  {response.data}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {responseTab === 'headers' && (
                          <div className="bg-gray-800 rounded-md p-3 border border-gray-700 overflow-auto max-h-96">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="text-left py-2 px-3 text-gray-400">Header</th>
                                  <th className="text-left py-2 px-3 text-gray-400">Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(response.headers).map(([key, value]) => (
                                  <tr key={key} className="border-b border-gray-700">
                                    <td className="py-2 px-3 text-theme-primary font-medium">{key}</td>
                                    <td className="py-2 px-3 text-gray-300">{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
                      {isLoading || isTestRunning ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-primary mb-4"></div>
                          {isTestRunning ? (
                            <>
                              <p className="text-gray-300 mb-2">Running test...</p>
                              <div className="w-64 bg-gray-700 rounded-full h-2.5 mb-2">
                                <div
                                  className="bg-theme-primary h-2.5 rounded-full"
                                  style={{ width: `${testProgress}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center mb-4">
                                <p className="text-gray-400 text-sm mr-3">{testProgress}% complete</p>
                                <button
                                  onClick={stopTest}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Stop Test
                                </button>
                              </div>

                              {testResults && testResults.requests.length > 0 && (
                                <div className="w-full max-w-md bg-gray-800 rounded-lg p-3 border border-gray-700 mt-2">
                                  <h4 className="text-sm font-medium text-theme-primary mb-2">Live Results</h4>
                                  <div className="grid grid-cols-2 gap-3 text-center">
                                    <div>
                                      <div className="text-xl font-bold text-white">
                                        {testResults.summary.successCount}/{testResults.summary.totalRequests}
                                      </div>
                                      <div className="text-xs text-gray-400">Successful Requests</div>
                                    </div>
                                    <div>
                                      <div className="text-xl font-bold text-white">
                                        {testResults.summary.avgTime}ms
                                      </div>
                                      <div className="text-xs text-gray-400">Average Response Time</div>
                                    </div>
                                  </div>

                                  <div className="mt-3 text-xs text-center text-gray-400">
                                    Results are being updated in real-time. You can view full details when the test completes or after stopping.
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-gray-300">Sending request...</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-400 text-lg mb-2">No Response Yet</p>
                          <p className="text-gray-500">Send a request to see the response here</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="w-full max-w-6xl mb-10">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg shadow-lg p-6 border border-theme-border/30 dark:bg-black/80 dark:border-white/20">
          <h2 className="text-2xl font-saira text-theme-primary font-semibold mb-4">API Testing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-theme-primary mb-2">Getting Started</h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>Use <strong>GET</strong> requests to retrieve data without modifying resources</li>
                <li>Use <strong>POST</strong> requests to create new resources</li>
                <li>Use <strong>PUT</strong> requests to update existing resources</li>
                <li>Use <strong>DELETE</strong> requests to remove resources</li>
                <li>Add appropriate headers like <code className="bg-gray-800 px-1 rounded">Content-Type: application/json</code> for JSON requests</li>
              </ul>
              <div className="mt-3 bg-gray-800 p-2 rounded border border-gray-700">
                <p className="text-xs text-theme-primary font-medium mb-1">Try these CORS-friendly APIs:</p>
                <ul className="list-disc list-inside text-gray-400 text-xs space-y-1">
                  <li><code className="bg-gray-700 px-1 rounded">https://jsonplaceholder.typicode.com/todos/1</code></li>
                  <li><code className="bg-gray-700 px-1 rounded">https://api.publicapis.org/entries</code></li>
                  <li><code className="bg-gray-700 px-1 rounded">https://catfact.ninja/fact</code></li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-theme-primary mb-2">Test Modes</h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li><strong>Single Request</strong>: Standard API testing for individual endpoints</li>
                <li><strong>Repeated Requests</strong>: Stress test endpoints with multiple identical requests</li>
                <li><strong>Sequence Testing</strong>: Chain multiple requests together with data extraction</li>
                <li><strong>Transform Testing</strong>: Test with automatically modified parameters</li>
                <li>Use the test results visualization to identify performance bottlenecks</li>
              </ul>
            </div>

            <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-theme-primary mb-2">Advanced Usage</h3>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                <li>Save frequently used requests for quick access</li>
                <li>Check response headers for useful information like rate limits</li>
                <li>Use the Format JSON button to prettify your request body</li>
                <li>For authentication, add an <code className="bg-gray-800 px-1 rounded">Authorization</code> header with your token</li>
                <li>Test your APIs with different parameters to ensure robust error handling</li>
              </ul>
            </div>

            <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-medium text-theme-primary mb-2">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Send Request</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Ctrl</kbd>
                    <span className="text-gray-500">+</span>
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Enter</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Switch Tabs</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Ctrl</kbd>
                    <span className="text-gray-500">+</span>
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Tab</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Format JSON</span>
                  <div className="flex space-x-1">
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Ctrl</kbd>
                    <span className="text-gray-500">+</span>
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Shift</kbd>
                    <span className="text-gray-500">+</span>
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">F</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-blue-900/30 p-3 rounded border border-blue-700/50">
              <h4 className="text-blue-400 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important: CORS Limitations
              </h4>
              <p className="text-gray-300 text-sm mt-1">
                <strong className="text-yellow-400">Browser Security Restriction:</strong> Due to Cross-Origin Resource Sharing (CORS) security policies,
                this browser-based tool can only make requests to:
              </p>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-2 space-y-1">
                <li>APIs on the same domain as this application</li>
                <li>APIs that explicitly allow cross-origin requests from this domain</li>
                <li>APIs that are configured with appropriate CORS headers</li>
              </ul>
              <p className="text-gray-300 text-sm mt-2">
                If you see <span className="text-red-400">status code 0</span> with a CORS error, the API doesn't allow requests from browsers.
                Consider using:
              </p>
              <ul className="list-disc list-inside text-gray-300 text-sm mt-1 space-y-1">
                <li>A server-side proxy that adds CORS headers</li>
                <li>Postman, cURL, or other API testing tools that aren't subject to browser CORS restrictions</li>
                <li>APIs that explicitly support CORS (many public APIs do)</li>
              </ul>
            </div>

            <div className="bg-green-900/30 p-3 rounded border border-green-700/50">
              <h4 className="text-green-400 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Performance Testing Tips
              </h4>
              <p className="text-gray-300 text-sm mt-1">
                When using Repeated Requests mode for performance testing:
                <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                  <li>Start with a small number of requests and gradually increase</li>
                  <li>Adjust concurrency to simulate different load scenarios</li>
                  <li>Look for patterns in response times as load increases</li>
                  <li>Monitor for error rates that might indicate API rate limiting</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITester;
