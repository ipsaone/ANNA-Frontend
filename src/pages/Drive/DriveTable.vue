<template>
    <div>
        <loader v-if="loading"></loader>

        <!--<table>
            <thead>
            <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Size</th>
            </tr>
            </thead>

            <tbody>
                <Go back>
                <tr class="top-row" v-if="folder && folder.name !== 'root'" @dblclick="goBack">
                    <td><i class="fa fa-folder" aria-hidden="true"></i></td>
                    <td>...</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>

                < Actual folder >
                <tr class="no-hover top-row" v-if="folder">
                    <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                    <td>{{ wrapName(folder.name) }}</td>
                    <td>{{ wrapName(folder.owner.username) }}</td>
                    <td>{{ convertSize(folder) }}</td>
                </tr>

                <tr style="height: 5vh"></tr>

                < Content >
                <tr v-for="file in content" :key="file.fileId" @click="select(file)"
                    @dblclick="openFile(file)"
                    :class="{selected: file.fileId === selectedFile.fileId}">
                    <td v-html="getIcon(file)"></td>
                    <td>
                        {{ wrapName(file.name) }}
                    </td>
                    <td>
                        {{ wrapName(file.owner.username) }}
                    </td>
                    <td>
                        {{ convertSize(file) }}
                    </td>
                </tr>
            </tbody>
        </table-->

        <table>
          <tr style="border-bottom: none">
            <td>
                <table>
                    <tr class="pas-toi">
                      <th>Type</th>
                      <th>Name <i @click="clique" class="fas fa-caret-up" :class='classR'></i> </th>
                      <th>Owner <i @click='clique2' class="fas fa-caret-up" :class='classR2'></i> </th>
                      <th>Size <i @click='clique3' class="fas fa-caret-up" :class='classR3'></i> </th>
                    </tr>
                    <tr class="pas-toi" v-if="folder && folder.name !== 'root'" @dblclick="goBack">
                        <td><i class="fa fa-folder" aria-hidden="true"></i></td>
                        <td>...</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr class="pas-toi no-hover" v-if="folder">
                        <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                        <td>{{ wrapName(folder.name) }}</td>
                        <td>{{ wrapName(folder.owner.username) }}</td>
                        <td>{{ convertSize(folder) }}</td>
                    </tr>
                </table>
            </td>
          </tr>
          <tr>
              <td>
                  <div class="inside-folder">
                      <table>
                          <tr v-for="file in content" :key="file.fileId" @click="select(file)"
                              @dblclick="openFile(file)"
                              :class="{selected: file.fileId === selectedFile.fileId}">
                              <td v-html="getIcon(file)"></td>
                              <td>
                                  {{ wrapName(file.name) }}
                              </td>
                              <td>
                                  {{ wrapName(file.owner.username) }}
                              </td>
                              <td>
                                  {{ convertSize(file) }}
                              </td>
                          </tr>
                      </table>
                  </div>
              </td>
          </tr>
        </table>



    </div>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import FileSize from 'filesize';

    export default {
        components: {
            Loader
        },
        data() {
            return {
                loading: false,
                classR: '',
                classR2: '',
                classR3: '',
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
            clique(){
                console.log('ce que tu veux', this);
                if (this.classR === 'rotate') {
                    this.classR = '';
                }else if (this.classR === '') {
                    this.classR = 'rotate';
                }
            },
            clique2(){
                console.log('ce que tu veux', this);
                if (this.classR2 === 'rotate') {
                    this.classR2 = '';
                }else if (this.classR2 === '') {
                    this.classR2 = 'rotate';
                }
            },
            clique3(){
                console.log('ce que tu veux', this);
                if (this.classR3 === 'rotate') {
                    this.classR3 = '';
                }else if (this.classR3 === '') {
                    this.classR3 = 'rotate';
                }
            },
            select(file) {
                if (file.fileId === this.selectedFile.fileId) store.dispatch('selectFile', {});
                else store.dispatch('selectFile', file);
            },
            wrapName(name) {
                if (name && name.length > 18)
                    return name.substring(0, 18) + '...';
                else
                    return name;
            },
            getIcon(file) {
                if (file.isDir) {
                    return '<i class="fa fa-folder" aria-hidden="true"></i>';
                }

                if(!file.type) { file.type = ''; }
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

                    case 'folder':
                        return '<i class="fa fa-file-folder" aria-hidden="true"></i>';
                        break;

                    case '':
                    default:
                        return '<i class="fa fa-file-o" aria-hidden="true"></i>';
                }
            },
            convertSize(file) {
                if(file.isDir) {
                    return '';
                }

                return FileSize(file.size);
            },
            openFile(file) {
                if (file.isDir) {
                    this.loading = true;
                    store.dispatch('retrieveFolder', file.fileId)
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
