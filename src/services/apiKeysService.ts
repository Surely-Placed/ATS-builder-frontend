import { apiClient } from "./resumeApi";

// Types
export interface ApiKey {
  id: string;
  name: string;
  is_active: boolean;
  device_id: string | null;
  device_name: string | null;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyResponse {
  success: boolean;
  data: ApiKey[];
  message?: string;
}

export interface CreateApiKeyResponse {
  success: boolean;
  data: {
    id: string;
    key: string;
    name: string;
    device_id: string | null;
    device_name: string | null;
    created_at: string;
  };
  message?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

class ApiKeysService {
  async getApiKeys(): Promise<ApiKeyResponse> {
    const response = await apiClient.get<ApiKeyResponse>("/api-keys");
    return response.data;
  }

  async createApiKey(name: string = "Chrome Extension"): Promise<CreateApiKeyResponse> {
    const response = await apiClient.post<CreateApiKeyResponse>("/api-keys", { name });
    return response.data;
  }

  async releaseDevice(keyId: string): Promise<ActionResponse> {
    const response = await apiClient.post<ActionResponse>(`/api-keys/${keyId}/release`, {});
    return response.data;
  }

  async revokeApiKey(keyId: string): Promise<ActionResponse> {
    const response = await apiClient.delete<ActionResponse>(`/api-keys/${keyId}`);
    return response.data;
  }
}

export const apiKeysService = new ApiKeysService();
