<template>
    <modal name="barcode" :scrollable="true" height="auto">
        <div class="content anna-modal">
            <h1>Generate a barcode</h1>

            <input v-model="text" type="text" placeholder="Serial number..." />
            <canvas id="barcode" ref="barcode" />
        </div>
    </modal>
</template>

<script>
import jsbarcode from 'jsbarcode';

export default {
    data() {
        return {
            text: ''
        };
    },
    watch: {
        text: val => {
            jsbarcode('#barcode', val);
        }
    }
};
</script>
