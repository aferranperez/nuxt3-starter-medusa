<template>
    <div>
        <div>FAQ</div>
        <div>{{ cartView }}</div>
        <button @click="updateCartViewDisplay()">UPDATE</button>
    </div>
</template>
+

<script setup lang="ts">
import { UseDisplayRefs } from "~/types/stores";
import { useDisplay } from '@/stores/useDisplay'
import { storeToRefs } from 'pinia'

const display = useDisplay();
const { cartView }: UseDisplayRefs = storeToRefs(display);
const { updateCartViewDisplay } = display;
</script>
