import { createWebHistory, createRouter } from 'vue-router'

import EditPost from '../pages/EditPost.vue';
import PostsPage from '../pages/PostsPage.vue';
import CreatePost from '../pages/CreatePost.vue';

const routes = [
  { path: '/edit/:id', name: 'edit', component: EditPost },
  { path: '/create-post', name: 'create', component: CreatePost },
  { path: '/', component: PostsPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})