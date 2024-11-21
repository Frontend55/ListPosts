<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '../../stores/posts';
import {
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    Reactive,
    reactive,
    Ref,
    ref,
} from 'vue';
import { LOCAL_EDITOR_POST, LOCAL_POSTS } from '../constants';
import { PostTypes } from '../types/post.types';

const postsStore = usePostStore();
const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
    getPost();
});

onBeforeUnmount(() => {
    clearEditedLocalPost();
});

const editPost: Reactive<PostTypes> = reactive({
    id: '',
    name: '',
    content: '',
});
const isShowEmptyBlock: Ref<boolean> = ref(false);
const valid: Ref<boolean> = ref(false);
const nameRules = ref([
    (value) => {
        if (value) return true;

        return 'Обязательное поле';
    },
]);

const getPost = () => {
    const localEditorPost = localStorage.getItem(LOCAL_EDITOR_POST);

    if (localEditorPost) {
        writeValueEditPost(JSON.parse(localEditorPost));
        return;
    }

    const localPosts = localStorage.getItem(LOCAL_POSTS);
    const posts = localPosts ? JSON.parse(localPosts) : postsStore.posts;

    const post = posts.find((item) => item.id === route.params.id);

    if (!post) {
        isShowEmptyBlock.value = true;
        return;
    }

    writeValueEditPost(post);
};

const writeValueEditPost = (post: PostTypes) => {
    editPost.id = route.params.id as string;
    editPost.name = post.name;
    editPost.content = post?.content || '';
};

const savePostInLocalStore = () => {
    localStorage.setItem(LOCAL_EDITOR_POST, JSON.stringify(editPost));
};

const clearEditedLocalPost = () => {
    localStorage.removeItem(LOCAL_EDITOR_POST);
};

const submit = () => {
    postsStore.updatePost(editPost);

    router.push('/');
};
</script>

<template>
    <v-container v-if="isShowEmptyBlock">
        <div>Извините, что то пошло не так и пост не найден ...</div>
        <v-btn to="/" class="mt-5">Вернуться на главную</v-btn>
    </v-container>
    <v-container v-else class="edit-post">
        <div class="edit-port__title mb-5">Редактирование поста:</div>
        <v-form v-model="valid" @submit.prevent="submit">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="editPost.name"
                        v-debounce:500ms="savePostInLocalStore"
                        :rules="nameRules"
                        label="Название поста"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-textarea
                        v-model="editPost.content"
                        v-debounce:500ms="savePostInLocalStore"
                        label="Описание поста"
                    />
                </v-col>
                <v-col cols="12">
                    <v-btn to="/">Отмена</v-btn>
                    <v-btn :disabled="!valid" type="submit" class="ml-5"
                        >Отправить</v-btn
                    >
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<style lang="scss">
.edit-post {
    &__title {
        font-size: 16px;
        text-align: left;
    }
}
</style>
