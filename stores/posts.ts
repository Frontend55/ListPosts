import { defineStore } from "pinia";
import { ref } from "vue";
import { PostTypes } from "../src/types/post.types.js";
import { LOCAL_POSTS } from "../src/constants/index.js";

export const usePostStore = defineStore('posts', () => {
  const posts = ref<PostTypes[]>([]);
  const filteredPosts = ref<PostTypes[]>([]);

  const setPosts = (list: PostTypes[], updateLocalStore: boolean = true): void => {
    posts.value = list;

    if (updateLocalStore) {
      localStorage.setItem(LOCAL_POSTS, JSON.stringify(list));
    }
  }

  const addPost = (post: PostTypes): void => {
    const localPosts = localStorage.getItem(LOCAL_POSTS);

    if (!posts.value.length && localPosts) {
      const newAllPosts = JSON.stringify([...JSON.parse(localPosts), post]);
      localStorage.setItem(LOCAL_POSTS, newAllPosts);
      return;
    }

    posts.value.push(post);
    localStorage.setItem(LOCAL_POSTS, JSON.stringify(posts.value));
  }

  const updatePost = (newPost: PostTypes): void => {
    const localPosts = localStorage.getItem(LOCAL_POSTS);
    let currentPosts = posts.value;

    if (!posts.value.length && localPosts) {
      currentPosts = [...JSON.parse(localPosts)]
    }

    const indexPost = currentPosts.findIndex((post) => post.id === newPost.id);
    currentPosts[indexPost] = newPost;
    localStorage.setItem(LOCAL_POSTS, JSON.stringify(currentPosts));
  }

  return { posts, filteredPosts, setPosts, addPost, updatePost };
})