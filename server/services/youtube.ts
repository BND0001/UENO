// YouTube Data API v3 integration for real-time data
// Note: This is a mock implementation for demo purposes
// In production, you would use the actual YouTube Data API

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  publishedAt: string;
  channelTitle: string;
  channelId: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
  };
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

// Mock YouTube data for demonstration
const MOCK_YOUTUBE_DATA = {
  channels: {
    'aliabdaal': {
      id: 'UCoOae5nYA7VqaXzerajD0lg',
      title: 'Ali Abdaal',
      description: 'Physician, YouTuber, and Entrepreneur',
      thumbnails: { default: { url: 'https://yt3.ggpht.com/ytc/AOPolaQlBXL9QQQ' } },
      statistics: {
        subscriberCount: '3200000',
        videoCount: '485',
        viewCount: '285000000'
      }
    },
    'mkbhd': {
      id: 'UCBJycsmduvYEL83R_U4JriQ',
      title: 'Marques Brownlee',
      description: 'Tech reviews and more',
      thumbnails: { default: { url: 'https://yt3.ggpht.com/ytc/AOPolaRbVBpqaMB' } },
      statistics: {
        subscriberCount: '17800000',
        videoCount: '1250',
        viewCount: '3200000000'
      }
    }
  },
  videos: [
    {
      id: 'dQw4w9WgXcQ',
      title: 'The ULTIMATE Productivity Setup for 2024',
      description: 'Here\'s how I organize my entire life using these amazing productivity tools...',
      thumbnails: { default: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' } },
      statistics: {
        viewCount: '1245000',
        likeCount: '42000',
        commentCount: '1250'
      },
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      channelTitle: 'Ali Abdaal',
      channelId: 'UCoOae5nYA7VqaXzerajD0lg'
    },
    {
      id: 'abc123def456',
      title: 'iPhone 15 Pro Max Review: The Complete Truth',
      description: 'After 3 months of testing, here\'s everything you need to know about Apple\'s latest flagship...',
      thumbnails: { default: { url: 'https://i.ytimg.com/vi/abc123def456/default.jpg' } },
      statistics: {
        viewCount: '2800000',
        likeCount: '125000',
        commentCount: '3400'
      },
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      channelTitle: 'Marques Brownlee',
      channelId: 'UCBJycsmduvYEL83R_U4JriQ'
    },
    {
      id: 'xyz789ghi012',
      title: 'My Morning Routine: How I Stay Productive as a Doctor + YouTuber',
      description: 'The exact morning routine that helps me balance medicine, content creation, and entrepreneurship...',
      thumbnails: { default: { url: 'https://i.ytimg.com/vi/xyz789ghi012/default.jpg' } },
      statistics: {
        viewCount: '856000',
        likeCount: '28000',
        commentCount: '890'
      },
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      channelTitle: 'Ali Abdaal',
      channelId: 'UCoOae5nYA7VqaXzerajD0lg'
    }
  ]
};

export async function getChannelInfo(channelHandle: string): Promise<YouTubeChannel | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const cleanHandle = channelHandle.replace('@', '');
  return MOCK_YOUTUBE_DATA.channels[cleanHandle] || null;
}

export async function getLatestVideos(channelHandle: string, maxResults = 10): Promise<YouTubeVideo[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const cleanHandle = channelHandle.replace('@', '');
  const channelData = MOCK_YOUTUBE_DATA.channels[cleanHandle];
  
  if (!channelData) return [];
  
  // Return videos from this channel
  return MOCK_YOUTUBE_DATA.videos.filter(video => 
    video.channelTitle.toLowerCase().includes(cleanHandle.toLowerCase()) ||
    video.channelId === channelData.id
  );
}

export async function searchChannels(query: string): Promise<YouTubeChannel[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const results = Object.values(MOCK_YOUTUBE_DATA.channels).filter(channel =>
    channel.title.toLowerCase().includes(query.toLowerCase()) ||
    channel.description.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
}

// Real YouTube API integration would look like this:
/*
export class YouTubeAPI {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async getChannelInfo(channelHandle: string): Promise<YouTubeChannel | null> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forUsername=${channelHandle}&key=${this.apiKey}`
    );
    const data = await response.json();
    return data.items?.[0] || null;
  }
  
  async getLatestVideos(channelId: string, maxResults = 10): Promise<YouTubeVideo[]> {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${this.apiKey}`
    );
    const data = await response.json();
    return data.items || [];
  }
}
*/