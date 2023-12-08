<template>
    <div data-theme="light" class="flex min-h-screen flex-col">
        <LayoutNavBar/>
            <main>
                <slot/>
            </main>
        <LayoutFooter/>
    </div>
</template>