// Mock API service for service-related data

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Mock dashboard data per service
const dashboardData = {
  cipher: {
    stats: { projects: 12, commits: 847, deployments: 34 },
    recentActivity: [
      { type: 'deploy', message: 'Deployed v2.3.1 to production', time: '2 hours ago' },
      { type: 'commit', message: 'Fixed authentication bug', time: '5 hours ago' },
      { type: 'review', message: 'Code review completed', time: '1 day ago' }
    ]
  },
  aurora: {
    stats: { designs: 45, revisions: 128, exports: 89 },
    recentActivity: [
      { type: 'design', message: 'Created new landing page mockup', time: '1 hour ago' },
      { type: 'export', message: 'Exported brand assets', time: '3 hours ago' },
      { type: 'feedback', message: 'Client approved homepage', time: '1 day ago' }
    ]
  },
  nexus: {
    stats: { models: 8, predictions: 45000, accuracy: 94.2 },
    recentActivity: [
      { type: 'train', message: 'Model training completed', time: '30 min ago' },
      { type: 'deploy', message: 'Deployed chatbot v3', time: '2 hours ago' },
      { type: 'insight', message: 'New pattern detected', time: '6 hours ago' }
    ]
  },
  void: {
    stats: { instances: 24, uptime: 99.97, requests: '2.4M' },
    recentActivity: [
      { type: 'scale', message: 'Auto-scaled to 8 instances', time: '15 min ago' },
      { type: 'deploy', message: 'Container updated', time: '1 hour ago' },
      { type: 'alert', message: 'Resolved memory spike', time: '3 hours ago' }
    ]
  },
  pulse: {
    stats: { campaigns: 15, reach: '1.2M', conversions: 8420 },
    recentActivity: [
      { type: 'campaign', message: 'Q1 campaign launched', time: '2 hours ago' },
      { type: 'analytics', message: 'Weekly report generated', time: '1 day ago' },
      { type: 'social', message: 'Post went viral', time: '2 days ago' }
    ]
  },
  quantum: {
    stats: { datasets: 34, queries: 12400, dashboards: 18 },
    recentActivity: [
      { type: 'query', message: 'Complex analysis completed', time: '45 min ago' },
      { type: 'dashboard', message: 'Executive dashboard updated', time: '3 hours ago' },
      { type: 'insight', message: 'Anomaly detected in sales data', time: '1 day ago' }
    ]
  },
  ember: {
    stats: { videos: 28, renders: 156, hours: 340 },
    recentActivity: [
      { type: 'render', message: 'Final cut exported', time: '1 hour ago' },
      { type: 'edit', message: 'Color grading completed', time: '4 hours ago' },
      { type: 'upload', message: 'Raw footage uploaded', time: '1 day ago' }
    ]
  },
  frost: {
    stats: { audits: 23, vulnerabilities: 0, scans: 890 },
    recentActivity: [
      { type: 'scan', message: 'Security scan completed', time: '30 min ago' },
      { type: 'patch', message: 'Critical patch applied', time: '2 hours ago' },
      { type: 'audit', message: 'Compliance audit passed', time: '3 days ago' }
    ]
  },
  terra: {
    stats: { products: 1240, orders: 3400, revenue: '$124K' },
    recentActivity: [
      { type: 'order', message: 'Large order processed', time: '10 min ago' },
      { type: 'inventory', message: 'Stock replenished', time: '2 hours ago' },
      { type: 'integration', message: 'Payment gateway updated', time: '1 day ago' }
    ]
  },
  echo: {
    stats: { tracks: 67, masters: 45, podcasts: 23 },
    recentActivity: [
      { type: 'master', message: 'Album mastering completed', time: '2 hours ago' },
      { type: 'mix', message: 'Podcast episode mixed', time: '5 hours ago' },
      { type: 'upload', message: 'Audio assets delivered', time: '1 day ago' }
    ]
  },
  prism: {
    stats: { photos: 2340, edits: 890, galleries: 34 },
    recentActivity: [
      { type: 'shoot', message: 'Product shoot completed', time: '3 hours ago' },
      { type: 'edit', message: 'Batch processing done', time: '6 hours ago' },
      { type: 'delivery', message: 'Gallery delivered to client', time: '1 day ago' }
    ]
  },
  flux: {
    stats: { animations: 56, frames: 24000, exports: 123 },
    recentActivity: [
      { type: 'render', message: '3D animation rendered', time: '1 hour ago' },
      { type: 'keyframe', message: 'Character rig completed', time: '4 hours ago' },
      { type: 'export', message: 'Motion graphics exported', time: '1 day ago' }
    ]
  }
}

export const apiService = {
  async getDashboardData(serviceId, _token) {
    await delay(400 + Math.random() * 200)

    if (!dashboardData[serviceId]) {
      throw new Error('Service not found')
    }

    return {
      ...dashboardData[serviceId],
      serviceId,
      lastUpdated: new Date().toISOString()
    }
  },

  async getServiceAnalytics(serviceId, token, timeRange = '7d') {
    await delay(300)

    // Generate mock analytics data
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = []

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.floor(Math.random() * 1000) + 500
      })
    }

    return { serviceId, timeRange, data }
  }
}
