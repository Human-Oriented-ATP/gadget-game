/**
 * Collects technical information about the user's environment
 * for bug reporting and diagnostics
 */
export interface UserEnvironment {
  browser: string;
  browserVersion: string;
  os: string;
  platform: string;
  screenResolution: string;
  viewport: string;
  userAgent: string;
  language: string;
  timestamp: string;
  url: string;
}

export function collectUserEnvironment(): UserEnvironment {
  const ua = navigator.userAgent;
  
  // Detect browser
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    browser = 'Opera';
    browserVersion = ua.split('OPR/')[1]?.split(' ')[0] || ua.split('Opera/')[1]?.split(' ')[0] || 'Unknown';
  }
  
  // Detect OS
  let os = 'Unknown';
  
  if (ua.includes('Windows')) {
    os = 'Windows';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    const match = ua.match(/Mac OS X ([\d_]+)/);
    if (match) {
      os = `macOS ${match[1].replace(/_/g, '.')}`;
    }
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
    const match = ua.match(/Android ([\d.]+)/);
    if (match) os = `Android ${match[1]}`;
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    const match = ua.match(/OS ([\d_]+)/);
    if (match) {
      os = `iOS ${match[1].replace(/_/g, '.')}`;
    }
  }
  
  return {
    browser,
    browserVersion,
    os,
    platform: navigator.platform || 'Unknown',
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: ua,
    language: navigator.language || 'Unknown',
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };
}

/**
 * Formats user environment data for inclusion in bug reports
 */
export function formatUserEnvironmentForReport(env: UserEnvironment): string {
  return `
**Environment Information**
- Browser: ${env.browser} ${env.browserVersion}
- OS: ${env.os}
- Platform: ${env.platform}
- Screen Resolution: ${env.screenResolution}
- Viewport: ${env.viewport}
- Language: ${env.language}
- URL: ${env.url}
- Timestamp: ${env.timestamp}

**User Agent**
\`\`\`
${env.userAgent}
\`\`\`
`.trim();
}
