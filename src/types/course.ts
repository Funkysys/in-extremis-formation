export interface Image {
  url: string;
  altText?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration: number;
  order: number;
  thumbnail: Image | null;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  order: number;
  image: Image | null;
  videos: Video[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  image?: Image | null;
  chapters: Chapter[];
  
  // Champs pour la compatibilité ascendante
  coverImage?: Image; // Ancien nom du champ image
  imageUrl?: string;  // À supprimer une fois les mises à jour terminées
  level?: string;     // À supprimer si non utilisé
  category?: string;  // À supprimer si non utilisé
}

export interface VideoChapter {
  id?: string;
  title: string;
  description?: string | null;
  timestamp: number;
  order?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FilterOptions {
  search?: string;
  category: string;
  level: string;
  sort: string;
}
