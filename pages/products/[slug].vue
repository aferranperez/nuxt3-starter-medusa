<template>
    <div class="py-20 px-4">
        <div class="custom-container">
            <div class="grid grid-cols-5 gap-8">
                <div class="col-span-2">
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
                            :alt="product.title"
                            class="rounded-2xl"
                        />
                    </transition>
                    <div
                        class="mt-6 grid grid-cols-4 gap-2"
                        v-if="product.images.length > 1"
                    >
                        <button
                            v-for="image of product.images"
                            @click="imageUrl = image.url"
                        >
                            <img
                                :src="image.url"
                                :alt="product.title"
                                class="rounded-md border-2 transition-all"
                                :class="[
                                    imageUrl === image.url
                                        ? 'border-violet-50'
                                        : 'border-transparent',
                                ]"
                            />
                        </button>
                    </div>
                </div>
                <div class="col-span-3">
                    <h1 class="mb-2 text-4xl font-bold">{{ product.title }}</h1>
                    <div class="text-4xl text-violet-50">
                        {{ price }}
                    </div>

                    <p class="mt-8 text-lg text-grey-60">
                        {{ product.description }}
                    </p>
                    <div class="mt-16 grid gap-10">
                        <div v-for="filter of filters">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-medium text-grey-90">
                                    {{ filter.name }}
                                </h3>
                            </div>

                            <RadioGroup
                                v-model="selectedOptions[filter.name]"
                                class="mt-4"
                            >
                                <RadioGroupLabel class="sr-only">
                                    Choose a size
                                </RadioGroupLabel>
                                <div
                                    class="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4"
                                >
                                    <RadioGroupOption
                                        as="template"
                                        v-for="option of filter.options"
                                        :key="option.value"
                                        :value="option.value"
                                        v-slot="{ active, checked }"
                                    >
                                        <div
                                            :class="[
                                                'cursor-pointer bg-white text-grey-90 shadow-sm',
                                                active
                                                    ? 'ring-2 ring-violet-50'
                                                    : '',
                                                'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-grey-5 focus:outline-none sm:flex-1 sm:py-6',
                                            ]"
                                        >
                                            <RadioGroupLabel as="p">
                                                {{ option.value }}
                                            </RadioGroupLabel>
                                            <div
                                                :class="[
                                                    active
                                                        ? 'border'
                                                        : 'border-2',
                                                    checked
                                                        ? 'border-violet-50'
                                                        : 'border-transparent',
                                                    'pointer-events-none absolute -inset-px rounded-md',
                                                ]"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </RadioGroupOption>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="mt-10 flex space-x-4">
                        <button
                            @click="addToCart()"
                            :disabled="adding || !hasStock"
                            class="flex w-full items-center justify-center space-x-2 rounded-md bg-violet-50 px-6 py-3 font-medium text-white transition-all hover:bg-violet-60 focus:ring focus:ring-violet-60 focus:ring-offset-2 focus:ring-offset-white disabled:bg-grey-40"
                        >
                            <div>
                                {{ hasStock ? "Add to cart" : "Limit reached" }}
                            </div>
                        </button>
                        <CartQuantitySelector
                            :quantity="quantity"
                            :increment="increment"
                            :decrement="decrement"
                            size="normal"
                        />
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Product } from "@medusajs/medusa";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { UseStoreRefs } from "~~/types/stores";
import { useStore } from '@/stores/useStore'
import { storeToRefs } from 'pinia'

const { $medusa } = useNuxtApp();
const route = useRoute();

const slug: string = route.params.slug as string;

const { data: product } = await useAsyncData(`product-${slug}`, async () => {
    const { products } = await $medusa.products.list({
        limit: 1,
        handle: slug,
    });
    return products[0];
});

if (!product.value) {
    useCustomError({
        statusCode: 404,
        statusMessage: "Product not found",
    });
}

const { fetchCollections } = useFetches();

const collections = await fetchCollections();

const { filters: _filters } = useFilters({
    products: [product.value as Product],
    collections: collections.value,
});

const filters = computed(() =>
    _filters.value.filter(({ name }) => name !== "Collection")
);

const selectedOptions = ref(
    Object.fromEntries(
        filters.value.map(({ name, options }) => [name, options[0].value])
    )
);

const variant = computed(() => {
    return product.value.variants.find((variant) => {
        return variant.options.every(
            (option) =>
                option.value ===
                selectedOptions.value[
                    filters.value.find((filter) =>
                        filter.options
                            .map((o) => o.value)
                            .includes(option.value)
                    ).name
                ]
        );
    });
});

const { formatPrice } = usePrices();

const price = computed(() => formatPrice(variant.value));

const { variantQuantity } = useHelpers();
const { quantity, increment, decrement, reset, hasStock } =
    variantQuantity(variant);

const imageUrl = ref(
    product.value.thumbnail ||
        `https://via.placeholder.com/1678x2098/F3F4F6/6B7280?text=${encodeURIComponent(
            product.value.title
        )}`
);

const store = useStore();
const { adding }: UseStoreRefs = storeToRefs(store) as any;
const { addVariantToCart } = store;

const addToCart = async () => {
    await addVariantToCart({
        variantId: variant.value.id,
        quantity: quantity.value,
    });
    reset();
};
</script>
