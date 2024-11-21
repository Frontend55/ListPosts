<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive, Ref, ref } from 'vue';
import { uuid } from 'vue-uuid';
import { usePostStore } from '../../stores/posts';
import { useRouter } from 'vue-router';
import { LOCAL_CREATE_POST } from '../constants';

const valid: Ref<boolean> = ref(false);
const nameRules = ref([
    (value) => {
        if (value) return true;

        return 'Обязательное поле';
    },
]);

onBeforeMount(() => {
    getLocalPost();
});

onBeforeUnmount(() => {
    clearLocalPost();
});

const postsStore = usePostStore();
const router = useRouter();
const isLoading = ref(false);
const newPost = reactive({
    id: uuid.v1(),
    name: '',
    content: '',
});

const savePost = () => {
    localStorage.setItem(LOCAL_CREATE_POST, JSON.stringify(newPost));
};

const submit = () => {
    isLoading.value = true;

    postsStore.addPost(newPost);

    isLoading.value = false;

    router.push('/');
};

const getLocalPost = () => {
    const savedPost = localStorage.getItem(LOCAL_CREATE_POST);

    if (savedPost) {
        const previouslyCreatedPost = JSON.parse(savedPost);
        newPost.name = previouslyCreatedPost.name;
        newPost.content = previouslyCreatedPost.content;
    }
};

const clearLocalPost = () => {
    localStorage.removeItem(LOCAL_CREATE_POST);
};
</script>

<template>
    <v-container class="edit-post">
        <div class="edit-port__title mb-5">Создание поста:</div>
        <v-form v-model="valid" @submit.prevent="submit">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                        v-model="newPost.name"
                        v-debounce:500ms="savePost"
                        :rules="nameRules"
                        label="Название поста"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-textarea
                        v-model="newPost.content"
                        v-debounce:500ms="savePost"
                        label="Описание поста"
                    />
                </v-col>
                <v-col cols="12">
                    <v-btn to="/">Отмена</v-btn>
                    <v-btn
                        :loading="isLoading"
                        :disabled="!valid"
                        type="submit"
                        class="ml-5"
                        >Отправить</v-btn
                    >
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<style lang="scss"></style>
