<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref } from 'vue';

import Post from '../components/Post.vue';
import Search from '../components/Search.vue';
import Preloader from '../components/Preloader.vue';

import { PostTypes, ResponseServer } from '../types/post.types';

import { usePostStore } from '../../stores/posts';

import {
    DEFAULT_COUNT_POSTS_ON_PAGE,
    DEFAULT_RESPONSE_SERVER,
    LOCAL_POSTS,
} from '../constants';

const postsStore = usePostStore();

const isShowPreloader: Ref<boolean> = ref(false);
const searchValue: Ref<string> = ref('');
const currentPage: Ref<number> = ref(1);
const filteredPosts: Ref<PostTypes[]> = ref<PostTypes[]>([]);
const selectedIdCard: Ref<string> = ref('');

onBeforeMount(async () => {
    isShowPreloader.value = true;
    const localPosts = localStorage.getItem(LOCAL_POSTS);

    if (localPosts && JSON.parse(localPosts).length) {
        await postsStore.setPosts(JSON.parse(localPosts), false);
        isShowPreloader.value = false;
        return;
    }

    const { posts } = await new Promise<ResponseServer>((resolve) => {
        setTimeout(() => {
            resolve(DEFAULT_RESPONSE_SERVER);
        }, 400);
    });
    await postsStore.setPosts(posts);
    isShowPreloader.value = false;
});

const listPosts = computed((): PostTypes[] => {
    const countPostsForPage =
        DEFAULT_COUNT_POSTS_ON_PAGE * (currentPage.value - 1);

    if (searchValue.value.length) {
        filteredPosts.value = filterPosts();

        return [...filteredPosts.value].splice(
            countPostsForPage,
            DEFAULT_COUNT_POSTS_ON_PAGE,
        );
    }

    return [...postsStore.posts].splice(
        countPostsForPage,
        DEFAULT_COUNT_POSTS_ON_PAGE,
    );
});

const lengthPagination = computed((): number => {
    const posts = searchValue.value.length
        ? filteredPosts.value
        : postsStore.posts;

    return Math.ceil(posts.length / DEFAULT_COUNT_POSTS_ON_PAGE);
});

const isShowEmptyBlock = computed((): boolean => {
    return filteredPosts.value.length === 0 && !!searchValue.value.length;
});

const setSearchValue = (value: string): void => {
    searchValue.value = value;
};

const deletePost = (id: string): void => {
    const newArrayPosts: PostTypes[] = postsStore.posts.filter(
        (post) => post.id !== id,
    );
    postsStore.setPosts(newArrayPosts);
};

const filterPosts = (): PostTypes[] => {
    return [...postsStore.posts].filter(
        (post: PostTypes) =>
            post.name
                .toLocaleLowerCase()
                .includes(searchValue.value.toLocaleLowerCase()) ||
            post.content
                ?.toLocaleLowerCase()
                .includes(searchValue.value.toLocaleLowerCase()),
    );
};
</script>

<template>
    <Preloader v-if="isShowPreloader" />
    <v-container class="posts-pages">
        <v-row>
            <Search class="mt-3" @changeValue="setSearchValue" />
        </v-row>
        <v-row>
            <v-btn to="create-post" class="mb-5">Добавить пост</v-btn>
        </v-row>
        <v-row>
            <v-col v-if="isShowEmptyBlock" cols="12">
                УПС.... А ничего и нет {{ filteredPosts.length }}
            </v-col>
            <v-row justify="start" class="posts-pages__wrapper-posts">
                <v-col
                    v-for="post in listPosts"
                    :key="post.id"
                    cols="12"
                    sm="4"
                >
                    <Post
                        :post="post"
                        :is-active="selectedIdCard === post.id"
                        @delete="deletePost"
                        @select="selectedIdCard = $event"
                    />
                </v-col>
            </v-row>
            <v-col cols="12">
                <v-pagination
                    v-if="lengthPagination > 1"
                    v-model="currentPage"
                    :length="lengthPagination"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped lang="scss">
.posts-pages {
    &__wrapper-posts {
        min-height: calc(100vh - 200px);
    }
}
</style>
