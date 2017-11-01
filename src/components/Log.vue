<template>
    <div class="log" @click.prevent="showLog">
        <h1>{{ log.title }}</h1>
    </div>
</template>

<script>
    import swal from 'sweetalert2';

    export default {
        props: ['log'],
        methods: {
            showLog() {
                const description = `By <a href="#">${this.log.author.username}</a> `
                    + `on ${this.log.created_at}<br><br>`
                    + `${this.log.description}`;

                swal({
                    title: this.log.title,
                    html: description
                });
            }
        }
    };
</script>