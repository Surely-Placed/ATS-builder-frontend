import io from "socket.io-client";

// Get Socket type from the return type of io()
type Socket = ReturnType<typeof io>;

// Get API URL and remove /api suffix for WebSocket (Socket.IO runs on base server URL)
const getApiUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    "https://ai-resume-genius-backend-hidden-glitter-6547.fly.dev/api";
  // Remove /api suffix if present (WebSocket runs on base server URL, not /api path)
  const baseUrl = envUrl.replace(/\/api$/, "");
  return baseUrl;
};

const API_URL = getApiUrl();

export interface JobStatusEvent {
  jobId: string;
  status: "pending" | "running" | "complete" | "failed";
  progress: number;
  result?: any;
  error?: string;
  // OpenAI token usage (if provided by backend)
  token_usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    model?: string;
  };
}

interface SocketConfig {
  userId?: string; // Optional: Firebase UID (for logging)
  firebaseIdToken?: string; // Firebase ID token (RECOMMENDED - this will work now!)
  jwtToken?: string; // Alternative: JWT session token if you have it
}

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private jobStatusCallback: ((data: JobStatusEvent) => void) | null = null;

  connect(config: SocketConfig): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const { userId, firebaseIdToken, jwtToken } = config;

    // Build auth object
    const authConfig: any = {};

    // Priority 1: JWT session token (if available)
    if (jwtToken) {
      authConfig.token = jwtToken;
    }
    // Priority 2: Firebase ID token (works now with backend update!)
    else if (firebaseIdToken) {
      authConfig.token = firebaseIdToken;
    }

    // Optional: Include userId for logging (not required for auth)
    if (userId) {
      authConfig.userId = userId;
    }

    this.socket = io(API_URL, {
      auth: authConfig,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    } as any); // Type assertion to allow withCredentials if needed in future

    this.socket.on("connect", () => {
      this.reconnectAttempts = 0;
    });

    this.socket.on("connect_error", (error) => {
      this.reconnectAttempts++;
    });

    this.socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        this.socket?.connect();
      }
    });

    // Listen for jobStatus events
    this.socket.on("jobStatus", (data: JobStatusEvent) => {
      // Call registered callback if available
      if (this.jobStatusCallback) {
        this.jobStatusCallback(data);
      }
    });

    return this.socket;
  }

  // Register job status listener
  onJobStatus(callback: (data: JobStatusEvent) => void): void {
    this.jobStatusCallback = callback;
    if (this.socket) {
      this.socket.on("jobStatus", callback);
    }
  }

  offJobStatus(callback: (data: JobStatusEvent) => void): void {
    if (this.socket) {
      this.socket.off("jobStatus", callback);
      if (this.jobStatusCallback === callback) {
        this.jobStatusCallback = null;
      }
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
      this.jobStatusCallback = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
