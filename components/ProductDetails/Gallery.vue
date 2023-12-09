<template>
    <transition
        enter-active-class="transition ease duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        mode="out-in"
    >
        <img
            :key="imageUrl"
            :src="imageUrl"
            :alt="product_title"
            class="rounded-2xl"
        />
    </transition>
    <div
        class="mt-6 grid grid-cols-4 gap-2"
        v-if="product_images.length > 1"
    >
        <button
            v-for="image of product_images"
            @click="imageUrl = image.url"
        >
            <img
                :src="image.url"
                :alt="product_title"
                class="rounded-md border-2 transition-all"
                :class="[
                    imageUrl === image.url
                        ? 'border-violet-50'
                        : 'border-transparent',
                ]"
            />
        </button>
    </div>
</template>

<script lang="ts" setup>
    import { Image } from '@medusajs/medusa';

    const {product_title, product_images, product_thumbnail} = defineProps<{
                                                product_title ?: string|undefined,
                                                product_images ?: Image[],
                                                product_thumbnail ?: string|null
                                            }>()

    const imageUrl = ref(
        product_thumbnail ||
        `https://via.placeholder.com/1678x2098/F3F4F6/6B7280?text=${encodeURIComponent(
            product_title as any
        )}`
    );
</script>