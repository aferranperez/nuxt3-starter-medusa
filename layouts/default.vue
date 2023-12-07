<template>
    <div class="flex min-h-screen flex-col">
        <LayoutNavBar/>
            <main>
                <slot/>
            </main>
        <LayoutFooter/>
    </div>
</template>