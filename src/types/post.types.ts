export interface PostTypes {
  id: string,
  name: string,
  content?: string,
}

export interface ResponseServer {
  posts: PostTypes[],
}