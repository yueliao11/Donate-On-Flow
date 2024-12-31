// 根据项目类别返回相应的 Unsplash 图片
export const getProjectImage = (category: string, imageUrl?: string | null): string => {
  if (imageUrl) {
    return imageUrl;
  }

  // 默认的 Unsplash 图片集合
  const defaultImages = {
    EDUCATION: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    HEALTHCARE: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800',
    ENVIRONMENT: 'https://images.unsplash.com/photo-1498925008800-019c7d59d903?w=800',
    TECHNOLOGY: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    COMMUNITY: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    ARTS: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    DEFAULT: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800'
  };

  return defaultImages[category as keyof typeof defaultImages] || defaultImages.DEFAULT;
};
