<template>
    <section class="drive">
        <loader v-if="loading"></loader>

        <section class="content">
            <h1 class="section-title">Drive</h1>

            <table>
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Size</th>
                    <th>Download</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td><i class="fa fa-folder" aria-hidden="true"></i></td>
                    <td>...</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>

                <tr>
                    <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                    <td>foo</td>
                    <td>root</td>
                    <td>152 Mb</td>
                    <td></td>
                </tr>

                <tr class="spacer">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>

                <tr>
                    <td><i class="fa fa-file-pdf-o" aria-hidden="true"></i></td>
                    <td>Bidon</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>

                <tr v-for="file in content" :key="file.id">
                    <td>Bidon</td>
                </tr>
                </tbody>
            </table>
        </section>

        <section class="actions">

        </section>
    </section>
</template>

<script>
    import store from '@/store';
    import Loader from '@/components/Loader';

    export default {
        components: {
            Loader,
        },
        mounted() {
            this.loading = true;
            store.dispatch('retrieveFolder', 1)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Can not retrieve the root folder',
                        text: err.message,
                        duration: -1
                    });
                })
                .then(this.loading = false);
        },
        data() {
            return {
                loading: false
            };
        },
        computed: {
            folder() {
                return store.getters.folder;
            },
            content() {
                return store.getters.content;
            }
        },
    };
</script>