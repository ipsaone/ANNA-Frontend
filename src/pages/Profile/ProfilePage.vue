<template>
    <div class="profile basic-layout">
        <barcode></barcode>

        <div class="content">

            <div class="myself">
                <div class="user-image">
                    <img src="https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-1/p240x240/41548489_1083714755126011_7097230446420819968_n.jpg?_nc_cat=0&oh=e5a655eae8ce4024ff449ae53a9a5515&oe=5C62D8D3"
                     alt="photo du membre">
                    <h3>EDIT</h3>
                </div>
                <h1> PAGE MEMBRE </h1>
                <p> {{user.username}} <p>
                <p> {{ user.email }} </p>
            </div>

            <div class="assignments">
                <div class="groupes">
                    <h2> groupes </h2>
                    <ul>
                        <li> salut </li>
                        <li> salutsalut </li>
                    </ul>
                </div>
                <div class="missions">
                    <h2> missions </h2>
                    <ul>
                        <li> salut </li>
                        <li> salutsalut </li>
                    </ul>
                </div>
            </div>


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
    import store from '@/modules/store';
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
