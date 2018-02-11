<template>
    <section class="admin basic-layout">
        <div class="content">
            <h1 class="section-title">Administration</h1>

            <collapse>
                <div slot="collapse-header">Groups</div>

                <div slot="collapse-body">
                    test
                </div>
            </collapse>

            <collapse>
                <div slot="collapse-header">Users</div>

                <div slot="collapse-body">
                    test
                </div>
            </collapse>
        </div>

        <div class="actions">

        </div>
    </section>
</template>

<script>
    import store from '@/store';
    import Loader from '@/components/Loader';
    import Collapse from '@/components/Collapse';

    export default {
        components: {
            Loader,
            Collapse
        },
        data() {
            return {
                loading: false
            };
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveUsers')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve data from server',
                        text: err.message,
                        duration: -1
                    });
                })
                .then(this.loading = false);
        },
    };
</script>