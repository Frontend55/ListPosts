<script setup lang="ts">
const emit = defineEmits<{
    (event: 'changeValue', value: string): void;
}>();

const updateValue = (value) => {
    emit('changeValue', value);
};
</script>

<template>
    <v-text-field type="text" v-debounce:400ms="updateValue" label="Поиск" />
</template>

<style scoped lang="scss"></style>
