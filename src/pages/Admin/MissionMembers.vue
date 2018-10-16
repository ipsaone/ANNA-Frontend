<template>
    <modal name="missionMembers" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal mission-members">
            <h1 v-if="mission.name">Mission: {{ mission.name }}</h1>

            <div class="twocols">
                <div class="leftcol">
                    <h2>Users</h2>

                    <ul>
                        <a v-for="user in filteredUsers" :key="user.id" v-on:click="addUser(user.id)">
                            {{user.username}}
                        </a>
                    </ul>
                </div>

                <div class="rightcol">
                    <h2>Members</h2>

                    <ul>
                        <a v-for="member in mission.members" :key="member.id" v-on:click="remUser(user.id)">
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

    export default {
        components: {
            markdownEditor
        },
        data() {
            return {
                
            };
        },
        computed: {
            mission() {
                return store.getters.selectedMission;
            },
            filteredUsers() {                
                if(!this.mission.members) {
                    return store.getters.users;
                }

                return store.getters.users.filter(el => !this.mission.members.includes(el));      
                
            }
        },
        methods: {
            async beforeOpen(event) {
                await store.dispatch('retrieveMission', event.params.mission_id);
                console.log(this.mission);
            },
            async addUser(id) {
                console.log('adding', id);
                await store.dispatch('addMember', id);
            },
            async remUser(id) {
                console.log('removing', id);
                await store.dispatch('remMember', id);
            }
        }
    };
</script>
