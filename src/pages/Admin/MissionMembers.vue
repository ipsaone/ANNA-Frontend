<template>
    <modal name="missionMembers" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal mission-members">
            <h1>Mission: {{ mission.name }}</h1>

            <div class="twocols">
                <div class="leftcol">
                    <h2>Users</h2>

                    <ul>
                        <a v-for="user in filteredUsers" :key="user.id" v-on:click="addUser">
                            {{user.username}}
                        </a>
                    </ul>
                </div>

                <div class="rightcol">
                    <h2>Members</h2>

                    <ul>
                        <a v-for="member in mission.members" :key="member.id" v-on:click="remUser">
                            {{member.username}}
                        </a>
                    </ul>
                </div>
            </div>


            <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
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
                mission: {}
            };
        },
        computed: {
            async filteredUsers() {
                await store.dispatch('retrieveUsers');
                let data = await store.getters.users.filter(el => this.mission.members.includes(el));
                return data;
            }
        },
        methods: {
            async beforeOpen(event) {
                this.group = await store.dispatch('getGroup', event.params.mission_id)[0];
                console.log(this.mission);
            },
            onSubmit() {
                console.log('Hello world!');
            },
            addUser(evt) {

            },
            remUser(evt) {

            }
        }
    };
</script>
