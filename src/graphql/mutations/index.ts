// Centralise l'export de toutes les mutations générées
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
export * from "./purchase-mutations";
export * from "./video-mutations";
