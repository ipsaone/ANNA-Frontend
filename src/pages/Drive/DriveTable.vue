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
                      <th>Type<!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--></th>
                      <th>Name <!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--> </th>
                      <th>Serial nbr<!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--></th>
                      <th>Owner <!--i @click='clique2' class="fas fa-caret-up" :class='classR2'></i--> </th>
                      <th>Size <!--i @click='clique3' class="fas fa-caret-up" :class='classR3'></i--> </th>
                    </tr>
                    <tr class="pas-toi" v-if="folder && folder.name !== 'root'" @dblclick="goBack" style="user-select: none">
                        <td><i class="fa fa-backward" aria-hidden="true"></i></td>
                        <td>..</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr class="pas-toi no-hover" v-if="folder">
                        <td><i class="fa fa-folder-open" aria-hidden="true"></i></td>
                        <td>{{ wrapName(folder.name) }}</td>
                        <td></td>
                        <td>{{ wrapName(folder.owner.username) }}</td>
                        <td>{{ convertSize(folder) }}</td>
                    </tr>
                </table>
            </td>
          </tr>
          <tr>
              <td>
                  <div class="inside-folder">
                      <table id="result-search" v-if="keyword && keyWord.trim() !== ''">
                          <tr v-for="file in results" :key="file.fileId" @click="select(file)"
                              @dblclick="openFile(file)"
                              :class="{selected: file.fileId === selectedFile.fileId}">
                              <td v-html="getIcon(file)"></td>
                              <td>
                                  {{ wrapName(file.name) }}
                              </td>
                              <td>
                                  {{ wrapName2(file.serialNbr) }}
                              </td>
                              <td v-if="file.owner">
                                  {{ wrapName(file.owner.username) }}
                              </td>
                              <td>
                                  {{ convertSize(file) }}
                              </td>

                          </tr>
                          <tr v-if="results.length === 0">
                              <p class="center" >
                                  No Results
                              </p>
                          </tr>
                      </table>
                      <table id="inside-folder-list" v-else>
                          <tr v-for="file in content" :key="file.fileId" @click="select(file)"
                              @dblclick="openFile(file)"
                              :class="{selected: file.fileId === selectedFile.fileId}">
                              <td v-html="getIcon(file)"></td>
                              <td>
                                  {{ wrapName(file.name) }}
                              </td>
                              <td>
                                  {{ wrapName2(file.serialNbr) }}
                              </td>
                              <td>
                                  {{ wrapName(file.owner.username) }}
                              </td>
                              <td>
                                  {{ convertSize(file) }}
                              </td>
                          </tr>
                          <tr v-if="content.length === 0">
                              <p class="center" @click.prevent="$modal.show('uploadFile')">
                                  This folder is still empty.
                              </p>
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
            results() {
                return store.getters.searchResultsContent;
            },
            keyword() {
                return this.searchKeyWord;
            },
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
            addClass(e) {
                e.addClass('rotate');
            },
            clique(){
                if (this.classR === 'rotate') {
                    this.classR = '';
                }else if (this.classR === '') {
                    this.classR = 'rotate';
                }
            },
            clique2(){
                if (this.classR2 === 'rotate') {
                    this.classR2 = '';
                }else if (this.classR2 === '') {
                    this.classR2 = 'rotate';
                }
            },
            clique3(){
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
                if (name && name.length > 38)
                    return name.substring(0, 38) + '...';
                else
                    return name;
            },
            wrapName2(name) {
                if (name && name.length > 16)
                    return name.substring(0, 16) + '...';
                else
                    return name;
            },
            getIcon(file) {
                if (file.type === 'folder') {
                    return '<i class="fa fa-folder" aria-hidden="true"></i>';
                }

                if(!file.type) { file.type = ''; }
                switch (file.type) {

                    // PDF
                    case 'application/pdf':
                        return '<i class="fa fa-file-pdf" aria-hidden="true"></i>';
                        break;

                    // Archive
                    case 'application/zip':
                        return '<i class="fa fa-file-archive" aria-hidden="true"></i>';
                        break;

                    // Image
                    case 'image/gif':
                        return '<i class="fas fa-file-image"></i>';
                        break;
                    case 'image/png':
                        return '<i class="fas fa-file-image"></i>';
                        break;
                    case 'image/jpeg':
                        return '<i class="fas fa-file-image"></i>';
                        break;
                    case 'image/tiff':
                        return '<i class="fa fa-file-image" aria-hidden="true"></i>';
                        break;

                    // Audio
                    case 'audio/mpeg':
                        return '<i class="fas fa-file-audio"></i>';
                        break;
                    case 'audio/x-ms-wma':
                        return '<i class="fas fa-file-audio"></i>';
                        break;
                    case 'audio/vnd.rn-realaudio':
                        return '<i class="fas fa-file-audio"></i>';
                        break;
                    case 'audio/x-wav':
                        return '<i class="fas fa-file-audio"></i>';
                        break;

                    // Video
                    case 'video/mpeg':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/mp4':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/quicktime':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/x-ms-wmv':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/x-msvideo':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/x-flv':
                        return '<i class="fas fa-file-video"></i>';
                        break;
                    case 'video/webm':
                        return '<i class="fas fa-file-video"></i>';
                        break;

                    case 'folder':
                        return '<i class="fa fa-file-folder" aria-hidden="true"></i>';
                        break;

                    case '':
                    default:
                        return '<i class="fa fa-file" aria-hidden="true"></i>';
                }
            },
            convertSize(file) {
                if(file.type === 'folder') {
                    return '';
                }
                return FileSize(file.size);
            },
            openFile(file) {
                if (file.type === 'folder') {
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
