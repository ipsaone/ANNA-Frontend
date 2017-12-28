<template>
    <div class="basic-layout">
        <barcode></barcode>

        <div class="content">
            <h1>{{ user.username }}</h1>
            <p>{{ user.email }}</p>
        </div>

        <div class="actions">
            <h1 class="section-title">Actions</h1>
            <ul>
                <li>
                    <a href="#" @click.prevent="newBarcode"><i class="fa fa-barcode"></i> Generate a new barcode</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import store from '@/store';
    import Barcode from '@/components/Barcode';

    export default {
        components: {
            Barcode,
        },
        mounted() {
            store.dispatch('selectUser', this.$route.params.id)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Could not find the user.',
                        text: `User #${this.$route.params.id} does not exist.`,
                        duration: -1
                    });
                });
        },
        computed: {
            user() {
                return store.getters.selectedUser;
            }
        },
        methods: {
            newBarcode() {
                this.$modal.show('barcode');
            }
        }
    };
</script>
