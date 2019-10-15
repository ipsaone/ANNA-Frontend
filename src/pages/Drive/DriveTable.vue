v-if="file.size"<template>
    <div>
        <loader v-if="loading"></loader>
        <table>
          <tr style="border-bottom: none">
            <td>
                <table>
                    <tr class="pas-toi no-hover" style="cursor: default">
                      <th>Type<!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--></th>
                      <th>Name <!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--> </th>
                      <th>Serial nbr<!--i @click="clique" class="fas fa-caret-up" :class='classR'></i--></th>
                      <th>Owner <!--i @click='clique2' class="fas fa-caret-up" :class='classR2'></i--> </th>
                      <th v-if="showHistory">Date</th>
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
                        <td v-if="showHistory"> {{ getDate(folder.updatedAt) }} </td>
                        <td v-if="convertSize(folder) > 0">{{ convertSize(folder) }}</td>
                        <td v-else></td>
                    </tr>
                </table>
            </td>
          </tr>
          <tr>
              <td>
                  <div class="inside-folder">
                      <table id="file-history" v-if="showHistory">
                          <tr>
                              <th colspan="6">
                                  <p class="center" style="color: #7a7a7a">
                                      File History
                                  </p>
                              </th>
                          </tr>
                          <tr v-for="rev in metaData" :key="rev.id" @click="select(rev)"
                              @dblclick="openFolder(rev)" v-if="rev.exists == true"
                              :class="{selected: rev.id === selectedFile.id}">
                              <td v-html="getIcon(rev)"></td>
                              <td :title="rev.name">
                                 {{ wrapName(rev.name) }}
                              </td>
                              <td>
                                  {{ wrapName2(rev.serialNbr) }}
                              </td>
                              <td>
                                  {{ wrapName($store.getters.users.find(user => user.id == rev.ownerId).username) }}
                              </td>
                              <td>
                                  {{ getDate(rev.updatedAt) }}
                              </td>
                              <td v-if="rev.size > 0">
                                  {{ convertSize(rev) }}
                              </td>
                              <td v-else></td>
                          </tr>
                      </table>
                      <table id="result-search" v-if="keyword && keyword.trim().length >= 2">
                          <tr v-for="file in results" :key="file.fileId" @click="select(file)"
                              @dblclick="openFolder(file)"
                              :class="{selected: file.fileId === selectedFile.fileId}">
                              <td v-html="getIcon(file)"></td>
                              <td :title="file.name">
                                  {{ wrapName(file.name) }}
                              </td>
                              <td>
                                  {{ wrapName2(file.serialNbr) }}
                              </td>
                              <td v-if="file.owner">
                                  {{ wrapName(file.owner.username) }}
                              </td>
                              <td v-if="file.size > 0">
                                  {{ convertSize(file) }}
                              </td>
                              <td v-else></td>

                          </tr>
                          <tr v-if="results.length === 0">
                              <p class="center" >
                                  No Results
                              </p>
                          </tr>
                      </table>
                      <table id="inside-folder-list" v-if="!(keyword && keyword.trim().length >= 2) && !showHistory">
                          <tr v-for="file in content" :key="file.fileId" @click="select(file)"
                              @dblclick="openFolder(file)"
                              :class="{selected: file.fileId === selectedFile.fileId}">
                              <td v-html="getIcon(file)"></td>
                              <td :title="file.name">
                                  {{ wrapName(file.name) }}
                              </td>
                              <td>
                                  {{ wrapName2(file.serialNbr) }}
                              </td>
                              <td>
                                  {{ wrapName(file.owner.username) }}
                              </td>
                              <td v-if="file.size > 0">
                                  {{ convertSize(file) }}
                              </td>
                              <td v-else></td>
                          </tr>
                          <tr v-if="content.length === 0">
                              <p class="center" @click.prevent="$modal.show('uploadFile', {isFolder: false, isEditing: false})">
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
    import moment from 'moment';

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
                return store.getters.keyWord;
            },
            folder() {
                return store.getters.folder;
            },
            content() {
                return store.getters.content;
            },
            selectedFile() {
                return store.getters.selectedFile;
            },
            showHistory() {
                return store.getters.showHistory;
            },
            metaData() {
                return store.getters.metaData;
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
                if (file.fileId === this.selectedFile.fileId && this.selectedFile.exists==undefined) store.dispatch('selectFile', {});
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
            getDate(date) {
                return moment(date).format('YYYY-MM-DD');
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
            openFolder(file) {
                if (file.type === 'folder') {
                    this.loading = true;
                    store.dispatch('retrieveFolder', file.fileId)
                        .then(_ => store.dispatch('selectFile', {}))
                        .then(_ => this.loading = false);
                }
            },
            async goBack() {
                this.loading = true;
                await store.dispatch('retrieveFolder', this.folder.dirId)
                    .then(() => store.dispatch('selectFile', {}))
                    .then(() => this.loading = false);
            }
        }
    };
</script>
