<template>
    <modal
        id="move-modal"
        name="moveFile"
        height="auto"
        :scrollable="true"
        @before-open="beforeOpen"
    >
        <div
            id="move-file"
            class="content anna-modal"
        >
            <h1>Move file</h1>
            <span style="font-weight: 700;"> File name: </span>{{ file.name }}
            <div class="big-wrapper">
                <div
                    v-if="firstParent"
                    class="dir-tree"
                >
                    <div
                        class="firstParent"
                        @dblclick="goBack()"
                    >
                        <i class="fa fa-folder-open folder-icon parentFolderIcon" />
                        <h4 :title="firstParent.name">
                            {{ wrapName(firstParent.name) }}
                        </h4>
                        <i
                            v-if="firstParent.name != 'root'"
                            class="fas fa-angle-double-up"
                        />
                    </div>
                    <div
                        v-if="firstParent && firstParent.children && firstParent.children.length > 0"
                        id="children"
                        class="children"
                    >
                        <div
                            v-for="curfolder in firstParent.children"
              
                            :key="curfolder.id"
                            class="child"
                            @mouseenter="openIcon(folder.id)"
                            @mouseleave="closeIcon(folder.id)"
                            @dblclick="enterFolder(folder.id)"
                        >
                            <i
                                :id="curfolder.id"
                                class="fa fa-folder folder-icon"
                            />
                            <span :title="curfolder.name">{{ wrapName(curfolder.name) }}</span>
                        </div>
                    </div>
                    <div
                        v-else
                        id="children"
                        class="children"
                    >
                        No subfolder
                    </div>
                </div>

                <div class="file-info">
                    <ul v-if="file.owner">
                        <li>
                            <span>Owner:</span> {{ file.owner.username }}
                        </li>
                        <li>
                            <span>Group:</span> {{ group.name }}
                        </li>
                        <li>
                            <span>Serial Number:</span> {{ file.serialNbr }}
                        </li>
                        <li>
                            <span>Created at:</span> {{ getDate(file.createdAt) }}
                        </li>
                        <li>
                            <span>Last update:</span> {{ getDate(file.updatedAt) }}
                        </li>
                        <li>
                            <span>Type:</span> {{ file.type }}
                        </li>
                    </ul>
                    <div class="buttons">
                        <button
                            type="button"
                            class="cancel"
                            @click="$modal.hide('moveFilev2')"
                        >
                            Cancel
                        </button>
                        <button
                            id="submitButton"
                            type="submit"
                            class="button success"
                            @click.prevent="onSubmit"
                        >
                            Move here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';
import driveApi from '@/modules/drive/drive_api';
import moment from 'moment';

export default {
    data() {
        return {
            firstParent: {},
            selected: 1,
            file: {},
            group: {}
        };
    },
    computed: {
        folder() {
            return store.getters.folder;
        }
    },
    methods: {
        async beforeOpen(event) {
            console.log('ABCDEF');
            this.file = event.params.file;
            this.firstParent = await store.dispatch('getFoldersList', this.file.dirId);
            this.dirTree = this.firstParent.dirTree;
            this.group = await store.dispatch('retrieveGroup', this.file.groupId);
            this.selected = 1;
            await store.dispatch('getFoldersList', 1);
        },
        getDate(date) {
            return moment(date).format('MMM Do YYYY, HH:mm');
        },
        openIcon(id) {
            document.getElementById(id).classList.remove('fa-folder');
            document.getElementById(id).classList.add('fa-folder-open');
        },
        closeIcon(id) {
            document.getElementById(id).classList.remove('fa-folder-open');
            document.getElementById(id).classList.add('fa-folder');
        },
        async enterFolder(id) {
            this.firstParent = await store.dispatch('getFoldersList', id);
            // if(this.firstParent.children.length > 8) {
            //     document.getElementById('children').classList.toggle('expanded');
            // }
        },
        async goBack() {
            this.firstParent = await store.dispatch('getFoldersList', this.firstParent.dirId);
            // if(this.firstParent.children.length > 8) {
            //     document.getElementById('children').classList.toggle('expanded');
            // }
        },
        wrapName(name) {
            if (name && name.length > 24) {
                return name.substring(0, 24) + '...';
            } else {
                return name;
            }
        },
        async onSubmit() {
            const edit = {
                fileId: this.file.fileId,
                data: {
                    dirId: this.firstParent.id
                }
            };
            await driveApi.editFile(edit)
                .then(() => {
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'File or directory was moved',
                        duration: 5000
                    });
                })
                .catch(() => {
                    this.$modal.hide('moveFilev2');
                });
            await store.dispatch('retrieveFolder', store.getters.folder.fileId);
            //this.firstParent = await store.dispatch('getFoldersList', this.file.dirId);
            this.$modal.hide('moveFilev2');
            await store.dispatch('resetProgress');
        }
    }


};
</script>
