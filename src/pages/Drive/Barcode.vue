<template>
    <modal name="barcode" :scrollable="true" height="auto">
        <div class="content anna-modal">
            <h1>Generate a barcode</h1>

            <input type="text" placeholder="Serial number..." v-model="text">
            <canvas id="barcode" ref="barcode"></canvas>
        </div>
    </modal>
</template>

<script>
    import jsbarcode from 'jsbarcode';

    export default {
        data() {
            return {
                text: '',
            };
        },
        watch: {
            text: val => {
                jsbarcode('#barcode', val);
            }
        }
    };
</script>
