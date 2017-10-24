<template>
    <section class="dashboard">
        <h1>Dashboard</h1>

        <section class="projects">
            <div class="main">
                <data-circle :value="25" size="big"></data-circle>
                <data-circle :value="50" size="big" color="red"></data-circle>
            </div>

            <div class="pole">
                <div class="dev">
                    <h1>Dev</h1>
                    <data-circle :value="75" color="green"></data-circle>
                    <data-circle :value="100" color="orange"></data-circle>
                </div>

                <div class="meca">
                    <h1>Meca</h1>
                    <data-circle :value="75" color="green"></data-circle>
                    <data-circle :value="100" color="green"></data-circle>
                </div>

                <div class="com">
                    <h1>Com</h1>
                    <data-circle :value="75" color="green"></data-circle>
                    <data-circle :value="100" color="green"></data-circle>
                </div>

                <div class="meca">
                    <h1>Meca</h1>
                    <data-circle :value="75" color="green"></data-circle>
                    <data-circle :value="100" color="green"></data-circle>
                </div>
            </div>
        </section>
    </section>
</template>

<script>
    import DataCircle from '@/components/DataCircle.vue';

    export default {
        components: {
            DataCircle
        }
    };
</script>