import { defineStore } from "pinia";
import { Cart, Region } from "@medusajs/medusa";
import { useStoreStorage } from "~/composables/useStoreStorage";
import defaults from "~/utils/defaults";

const KEY = "store";

export const useStore = defineStore(KEY, () => {
    const { $medusa } = useNuxtApp();

    const cart = ref<Partial<Cart>>();
    const countryName = ref<string>(defaults.country);
    const regions = ref<Region[]>([]);
    const adding = ref<boolean>(false);

    const storage = useStoreStorage({
        key: KEY,
        state: { cart, countryName, regions },
        exclude: ["regions"],
    });

    const region = computed(() => cart.value?.region);
    const currencyCode = computed(() => region.value?.currency_code);
    const taxRate = computed(() => region.value.tax_rate / 100);

    const createCart = async () => {
        const data = await $medusa.carts.create({});
        cart.value = data.cart;
    };

    const retrieveCart = async () => {
        if (cart.value === undefined) {
            return await createCart();
        }

        const data = await $medusa.carts.retrieve(cart.value.id);
        cart.value = data.cart;
    };

    const getRegions = async () => {
        const { regions: data } = await $medusa.regions.list();
        regions.value = data;
    };

    const updateCart = async ({ regionId }: { regionId?: string }) => {
        const data = await $medusa.carts.update(cart.value.id, {
            region_id: regionId,
        });
        cart.value = data.cart;
    };

    const setRegion = async ({
        regionId: r,
        countryName: c,
    }: {
        regionId: string;
        countryName: string;
    }) => {
        await updateCart({ regionId: r });
        countryName.value = c;
    };

    const addVariantToCart = async ({
        variantId,
        quantity,
    }: {
        variantId: string;
        quantity: number;
    }) => {
        if (adding.value) {
            return;
        }
        adding.value = true;
        const data = await $medusa.carts.lineItems.create(cart.value.id, {
            variant_id: variantId,
            quantity,
        });
        cart.value = data.cart;
        adding.value = false;
    };

    const removeLineItem = async (lineId: string) => {
        const data = await $medusa.carts.lineItems.delete(
            cart.value.id,
            lineId
        );
        cart.value = data.cart;
    };

    const updateLineItem = async ({
        lineId,
        quantity,
    }: {
        lineId: string;
        quantity: number;
    }) => {
        const data = await $medusa.carts.lineItems.update(
            cart.value.id,
            lineId,
            {
                quantity,
            }
        );
        cart.value = data.cart;
    };

    const initialize = async () => {
        storage.init();
        await retrieveCart();
        await getRegions();
    };

    return {
        cart,
        countryName,
        regions,
        region,
        currencyCode,
        taxRate,
        createCart,
        retrieveCart,
        updateCart,
        getRegions,
        setRegion,
        initialize,
        // order,
        // products,
        adding,
        addVariantToCart,
        removeLineItem,
        updateLineItem,
        // getShippingOptions,
        // setShippingMethod,
        // updateAddress,
        // createPaymentSession,
        // completeCart,
        // retrieveOrder,
        // setPaymentSession,
    };
});