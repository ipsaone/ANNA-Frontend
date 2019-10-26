<template>
    <modal name="missionMembers" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal mission-members manage-members">

            <h1 v-if="mission.name"> Mission: {{ mission.name }}</h1>
            <h1 v-if="mission.leader"> Leader : {{ mission.leader.username }} </h1>
            <i class="fa fa-times" v-on:click="$modal.hide('missionMembers')"></i>

            <div class="lists-wrapper">
                <div class="left-col">
                    <h2>Users</h2>
                    <ul>
                        <a v-for="user in shownUsers" :key="user.id" @click.prevent="addUser(user.id);">
                          {{user.username}}
                        </a>
                    </ul>
                </div>
                <div class="right-col">
                    <h2>Members</h2>
                        <ul>
                            <a v-for="member in mission.members" :key="member.id" @click.prevent="remUser(member.id);">
                                {{member.username}}
                            </a>
                        </ul>
                </div>
            </div>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import swal from 'sweetalert2';

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                shownUsers: []
            };
        },
        computed: {
            mission() {
                return store.getters.selectedMission;
            },
            users() {
                return store.getters.users;
            }
        },
        methods: {
            async beforeOpen(event) {
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveMission', event.params.mission_id);
                this.refreshUsers();
            },
            async addUser(id) {
                await store.dispatch('addMissionMember', id);
                await this.refreshUsers();
            },
            async remUser(id) {
                await store.dispatch('remMissionMember', id);
                await this.refreshUsers();

            },
            async refreshUsers() {
                await store.dispatch('retrieveUsers');
                await store.dispatch('retrieveMissions', true);
                if (!this.mission.members) {
                    this.shownUsers = store.getters.users;
                }
                this.shownUsers =  store.getters.users.filter(el1 => {
                    let found = false;
                    console.log(this.mission);
                    this.mission.members.forEach(el2 => {
                        if (el1.id == el2.id) {
                            found = true;
                        }
                    });
                    if (el1.id == this.mission.leaderId) {
                        found = true;
                    }
                    return !found;
                });
            },
        }
    };
</script>
