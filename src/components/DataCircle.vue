<template>
    <div class="c100" :class="[percentageClass, color, size]"
         @click.prevent="increasePercentage"
         @contextmenu.prevent="decreasePercentage">
        <span>{{ percentage }}%</span>
        <div class="slice">
            <div class="bar"></div>
            <div class="fill"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['value', 'color', 'size'],
        data() {
            return {
                percentage: this.value,
            };
        },
        computed: {
            percentageClass() {
                return 'p' + this.percentage;
            }
        },
        methods: {
            increasePercentage() {
                if (this.percentage < 100) {
                    this.percentage += 1;
                }
            },
            decreasePercentage() {
                if (this.percentage > 0) {
                    this.percentage -= 1;
                }
            }
        }
    };
</script>