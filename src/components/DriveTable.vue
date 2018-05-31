<template>
    <div>
        <loader v-if="loading"></loader>

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
            <!-- Go back -->
            <tr v-if="folder.name !== 'root'" @dblclick="goBack">
                <td><i class="fa fa-folder" aria-hidden="true"></i></td>
                <td>...</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>

            <!-- Actual folder -->
            <tr class="no-hover">
                <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                <td>{{ wrapName(folder.name) }}</td>
                <td>{{ wrapName(folder.owner.username) }}</td>
                <td>{{ convertSize(folder.size) }} Kb</td>
            </tr>

            <!-- Separator -->
            <tr class="spacer">
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
            </tr>

            <!-- Content -->
            <tr v-for="file in content" :key="file.id" @click="select(file)"
                @dblclick="openFile(file)"
                :class="{selected: file.id === selectedFile.id}">
                <td v-html="getIcon(file)"></td>
                <td class="overflow-wrap-hack">
                    <div class="content-td">
                        {{ wrapName(file.name) }}
                    </div>
                </td>
                <td>
                    {{ wrapName(file.owner.username) }}
                </td>
                <td>
                    {{ convertSize(file.size) }} Kb
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';

    export default {
        components: {
            Loader
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
            },
            selectedFile() {
                return store.getters.selectedFile;
            }
        },
        methods: {
            select(file) {
                if (file.id === this.selectedFile.id) store.dispatch('selectFile', {});
                else store.dispatch('selectFile', file);
            },
            wrapName(name) {
                if (name.length > 18)
                    return name.substring(0, 18) + '...';
                else
                    return name;
            },
            getIcon(file) {
                switch (file.type) {
                    // PDF
                    case 'application/pdf':
                        return '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>';
                        break;

                    // Archive
                    case 'application/zip':
                        return '<i class="fa fa-file-archive-o" aria-hidden="true"></i>';
                        break;

                    // Image
                    case 'image/gif':
                    case 'image/png':
                    case 'image/jpeg':
                    case 'image/tiff':
                        return '<i class="fa fa-file-image-o" aria-hidden="true"></i>';
                        break;

                    // Audio
                    case 'audio/mpeg':
                    case 'audio/x-ms-wma':
                    case 'audio/vnd.rn-realaudio':
                    case 'audio/x-wav':
                        return '<i class="fa fa-file-audio-o" aria-hidden="true"></i>';
                        break;

                    case 'video/mpeg':
                    case 'video/mp4':
                    case 'video/quicktime':
                    case 'video/x-ms-wmv':
                    case 'video/x-msvideo':
                    case 'video/x-flv':
                    case 'video/webm':
                        return '<i class="fa fa-file-video-o" aria-hidden="true"></i>';
                        break;

                    default:
                        if (file.isDir)
                            return '<i class="fa fa-folder" aria-hidden="true"></i>';
                        else
                            return '<i class="fa fa-file-o" aria-hidden="true"></i>';
                }
            },
            convertSize(size) {
                return size / 1000.0;
            },
            openFile(file) {
                if (file.isDir) {
                    this.loading = true;
                    store.dispatch('retrieveFolder', file.id)
                        .then(_ => store.dispatch('selectFile', {}))
                        .then(_ => this.loading = false);
                }
            },
            goBack() {
                this.loading = true;
                store.dispatch('retrieveFolder', this.folder.dirId)
                    .then(_ => store.dispatch('selectFile', {}))
                    .then(_ => this.loading = false);
            }
        }
    };
</script>