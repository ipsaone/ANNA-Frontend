<template>
    <section class="drive">
        <loader v-if="loading"></loader>

        <context-menu id="context-menu" ref="optionsMenu" @ctx-open="onMenuOpen" @ctx-cancel="selectedEl = 0">
            <li class="action" @click="clickMenu"><i class="fa fa-download" aria-hidden="true"></i> Download</li>
            <li class="action red" @click="clickMenu"><i class="fa fa-trash" aria-hidden="true"></i> Delete</li>
        </context-menu>

        <section class="content">
            <h1 class="section-title">Drive</h1>

            <table>
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Size</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td><i class="fa fa-folder" aria-hidden="true"></i></td>
                    <td>...</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>

                <tr>
                    <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                    <td>foo</td>
                    <td>root</td>
                    <td>152 Mb</td>
                </tr>

                <tr class="spacer">
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>

                <tr @contextmenu.prevent="$refs.optionsMenu.open($event, 1)">
                    <td><i class="fa fa-file-pdf-o" aria-hidden="true"></i></td>
                    <td>Fichier bidon</td>
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
    import ContextMenu from 'vue-context-menu';

    export default {
        components: {
            Loader,
            ContextMenu
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
                loading: false,
                selectedEl: 0
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
        methods: {
            onMenuOpen(locals) {
                this.selectedEl = locals;
            },
            clickMenu() {
                console.log('clicked!');
            }
        }
    };
</script>