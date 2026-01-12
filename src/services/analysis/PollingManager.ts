class PollingManager {
  private static instance: PollingManager;
  private readonly POLLING_STATUS_KEY = 'resume_analysis_polling_status';
  private readonly TAB_ID_KEY = 'resume_analysis_tab_id';
  private readonly PAGE_VISIBILITY_KEY = 'resume_analysis_page_visibility';
  
  private constructor() {}
  
  public static getInstance(): PollingManager {
    if (!PollingManager.instance) {
      PollingManager.instance = new PollingManager();
    }
    return PollingManager.instance;
  }
  
  public async acquirePollingLock(analysisId: string, jobId?: string): Promise<boolean> {
    const lockKey = this.getLockKey(analysisId, jobId);
    const tabId = this.getOrCreateTabId();
    
    // Check if another poller exists
    const currentStatus = this.getPollingStatus();
    const existingLock = currentStatus[lockKey];
    
    // If no lock exists or it's expired (older than 30 seconds), acquire it
    if (!existingLock || Date.now() - existingLock.timestamp > 30000) {
      // Attempt to acquire the lock
      const newStatus = {
        ...currentStatus,
        [lockKey]: {
          timestamp: Date.now(),
          tabId: tabId
        }
      };
      
      try {
        localStorage.setItem(this.POLLING_STATUS_KEY, JSON.stringify(newStatus));
        return true;
      } catch (error) {
        console.warn('Failed to acquire polling lock:', error);
        return false;
      }
    }
    
    // Check if the lock is held by this tab
    if (existingLock.tabId === tabId) {
      // Update timestamp to refresh the lock
      const newStatus = {
        ...currentStatus,
        [lockKey]: {
          timestamp: Date.now(),
          tabId: tabId
        }
      };
      try {
        localStorage.setItem(this.POLLING_STATUS_KEY, JSON.stringify(newStatus));
        return true;
      } catch (error) {
        console.warn('Failed to refresh polling lock:', error);
        return false;
      }
    }
    
    // Another tab holds the lock
    return false;
  }
  
  public releasePollingLock(analysisId: string, jobId?: string): void {
    const lockKey = this.getLockKey(analysisId, jobId);
    const currentStatus = this.getPollingStatus();
    
    delete currentStatus[lockKey];
    
    try {
      localStorage.setItem(this.POLLING_STATUS_KEY, JSON.stringify(currentStatus));
    } catch (error) {
      console.warn('Failed to release polling lock:', error);
    }
  }
  
  private getPollingStatus(): Record<string, { timestamp: number; tabId: string }> {
    try {
      const status = localStorage.getItem(this.POLLING_STATUS_KEY);
      return status ? JSON.parse(status) : {};
    } catch {
      return {};
    }
  }
  
  private getLockKey(analysisId: string, jobId?: string): string {
    return jobId ? `job_${jobId}` : `analysis_${analysisId}`;
  }
  
  private getOrCreateTabId(): string {
    try {
      let tabId = localStorage.getItem(this.TAB_ID_KEY);
      if (!tabId) {
        tabId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(this.TAB_ID_KEY, tabId);
      }
      return tabId;
    } catch {
      // Fallback for environments without localStorage
      return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  
  public isPollingActive(analysisId: string, jobId?: string): boolean {
    const lockKey = this.getLockKey(analysisId, jobId);
    const currentStatus = this.getPollingStatus();
    const lock = currentStatus[lockKey];
    
    // Check if lock exists and is not expired
    return !!lock && (Date.now() - lock.timestamp <= 30000);
  }
}

export { PollingManager };