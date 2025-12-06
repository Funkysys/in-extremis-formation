// Centralise l'export de toutes les mutations générées

// Mutations principales selon FRONTEND_API_REFERENCE
export * from "./account-mutations";
export * from "./chat-mutations";
export * from "./payment-mutations";
export * from "./user-mutations";
export * from "./video-mutations";

// Mutations spécifiques à la plateforme de formation
export * from "./cart-mutations";
export {
  CREATE_CHAPTER_MUTATION as CREATE_CHAPTER_MUTATION_CHAPTER,
  DELETE_CHAPTER_MUTATION,
  UPDATE_CHAPTER_MUTATION,
} from "./chapter-mutations";
export {
  CREATE_CHAPTER_MUTATION as CREATE_CHAPTER_MUTATION_COURSE,
  CREATE_COURSE_MUTATION,
  UPDATE_COURSE_MUTATION,
} from "./course-mutations";
export * from "./image-mutations";
export * from "./likes";
export * from "./playlists";
export * from "./purchase-mutations";

