<script setup lang="ts">
import { Ref, ref, TransitionGroup } from 'vue';

import type { PostTypes } from '../types/post.types';
import { debounce, DebounceInstance } from 'vue-debounce';

const { post, isActive } = defineProps<{
    post: PostTypes;
    isActive: boolean;
}>();

const emit = defineEmits<{
    (emit: 'delete', value: string): void;
    (emit: 'select', value: string): void;
}>();

const isShowActiveBtn: Ref<boolean> = ref(false);

const toggleStateBtn: DebounceInstance<[state: boolean]> = debounce(
    (state: boolean) => {
        isShowActiveBtn.value = state;
    },
    '100ms',
);
</script>

<template>
    <v-card
        min-height="200px"
        variant="outlined"
        hover
        class="card"
        :class="{ 'is-active': isActive }"
        @click="emit('select', post.id)"
        @mouseover="toggleStateBtn(true)"
        @mouseleave="toggleStateBtn(false)"
    >
        <div class="d-flex justify-end ma-2 card__wrapper-buttons">
            <TransitionGroup>
                <v-btn
                    v-show="isShowActiveBtn"
                    :to="{ name: 'edit', params: { id: post.id } }"
                    class="mr-2"
                    icon="mdi-pencil"
                    size="small"
                    density="compact"
                    variant="plain"
                    key="pencil"
                />
                <v-btn
                    v-show="isShowActiveBtn"
                    icon="mdi-delete"
                    size="small"
                    density="compact"
                    variant="plain"
                    key="delete"
                    @click="emit('delete', post.id)"
                />
            </TransitionGroup>
        </div>

        <v-card-title>{{ post.name }}</v-card-title>
        <v-card-text v-if="post.content">{{ post.content }}</v-card-text>
    </v-card>
</template>

<style scoped lang="scss">
.card {
    &.is-active {
        border-color: rgba(147, 112, 219, 0.64);
    }
    &:hover {
        -webkit-box-shadow: 4px 4px 14px 0px rgba(147, 112, 219, 0.64);
        -moz-box-shadow: 4px 4px 14px 0px rgba(147, 112, 219, 0.64);
        box-shadow: 4px 4px 14px 0px rgba(147, 112, 219, 0.64);
    }

    &__wrapper-buttons {
        min-height: 20px;
    }
}
</style>
