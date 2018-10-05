<template>
    <div class='admin' v-bind:class="{'basic-layout': show_add_user || show_add_event}">
        <new-mission></new-mission>
        <new-group></new-group>
        <new-event></new-event>
        <section class="content">
            <h1 class="section-title">Administration</h1>
            <tabs>
                <tab name="Missions">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Leader</th>
                            <th>Budget</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="mission in missions" :key="mission.id">
                            <td> {{ mission.name }} </td>
                            <td> {{ mission.leader.username }} </td>
                            <td> {{ mission.budgetUsed+0 }} / {{ mission.budgetAssigned }} </td>
                            <td> {{ mission.memberCount }} </td>
                            <td> <a>Manage members</a>, <a>Manage budget</a>, <a>Manage tasks</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="newMission">Add mission</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Logs">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Linked data</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="log in logs" :key="log.id">
                            <td> {{ log.title }} </td>
                            <td> {{ log.updatedAt}} </td>
                            <td> {{ log.markdown }} </td>
                            <td> [Linked things] </td>
                            <td>
                                <a>Edit</a>,
                                <a>Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a>Add log</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Blog">
                    <table>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Author</th>
                            <th>Text</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="post in posts" :key="post.id">
                            <td> {{ post.id }} </td>
                            <td> {{ post.title }} </td>
                            <td> {{ post.createdAt }} </td>
                            <td> {{ post.author.username }} </td>
                            <td> {{ post.content }} </td>
                            <td>
                                <router-link :to="{name: 'readPost', params: {id: post.id}}">Show</router-link>,
                                <router-link :to="{name: 'editPost', params: {id: post.id}}">Edit</router-link>,
                                <a @click.prevent="delPost(post.title, post.id)">Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><router-link :to="{name: 'newPost'}">Add post</router-link></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Groups">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="group in groups" :key="group.id">
                            <td> {{ group.name }} </td>
                            <td> {{ group.users.length }} </td>
                            <td> <a>Manage users</a>, <a @click.prevent="delGroup(group.name, group.id)">Delete</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="newGroup">Add group</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Users">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Groups</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="user in users" :key="user.id">
                                <td> {{ user.id }} </td>
                            <td> {{ user.username }} </td>
                            <td> {{ user.email }} </td>
                            <td> {{ user.groups }} </td>
                            <td> <a>Manage groups</a>, <a>Change password</a>, <a @click.prevent="delUser(user.username, user.id)">Delete</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="show_add_user = !show_add_user">Add user</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Events">
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Registered</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="event in events" :key="event.id">
                            <td> {{ event.id }} </td>
                            <td> {{ event.name }} </td>
                            <td> ? / {{ event.maxRegistered }} </td>
                            <td> {{ event.startDate }} - {{ event.endDate }} </td>
                            <td> <a>Edit</a>, <a>Manage registered</a>, <a @click.prevent="delEvent(event.name, event.id)">Delete</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="this.$modal.show('newEvent')">Add event</a></td>
                        </tr>
                    </table>
                </tab>
            </tabs>
        </section>

        <section v-if="show_add_user" class="actions">
            <h1 class="section-title">Actions</h1>

            <div v-if="show_add_user" class="add-user">
                <div  class="form-group">
                    <label for="user-name">Username :</label><br>
                    <input type="text" name="user-name" v-model="user_name">
                </div>
                <div class="form-group">
                    <label for="user-email">Email :</label><br>
                    <input type="text" name="user-email" v-model="user_email">
                </div>
                <div class="form-group">
                    <label for="user-pwd">Password :</label><br>
                    <input type="password" name="user-pwd" v-model="user_pwd">
                </div>

                <div class="form-group">
                    <label for="user-pwd-2">Password again :</label><br>
                    <input type="password" name="user-pwd-2" v-model="user_pwd_conf">
                </div>

                <div class="buttons">
                    <button type="button" @click.prevent="show_add_user = !show_add_user" class="cancel">Cancel</button>
                    <button type="button" @click.prevent="newUser" class="submit">Submit</button>
                </div>
            </div>


        </section>
    </div>
</template> 

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import UserApi from '@/modules/users/users_api';
    import {Tabs, Tab} from 'vue-tabs-component';
    import NewMission from './NewMission';
    import NewGroup from './NewGroup';
    import NewEvent from './NewEvent';

    export default {
        components: {
            Loader,
            Tabs, Tab,
            NewMission, NewGroup, NewEvent
        },
        data() {
            return {
                loading: false,
                group_name: '',
                user_name: '',
                user_email: '',
                user_pwd: '',
                user_pwd_conf: '',
                show_add_mission: false,
                show_add_user: false,
                show_add_event: false,
                panel_title: 'Actions'
            };
        },
        computed: {
            posts() {
                return store.getters.posts;
            },
            users() {
                return store.getters.users;
            },
            groups() {
                return store.getters.groups;
            },
            logs() {
                return store.getters.logs;
            },
            missions() {
                return store.getters.missions;
            },
            events() {
                return store.getters.events;
            }
        },
        mounted() {
            this.loading = true;

            let usersP = store.dispatch('retrieveUsers', true)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve users from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let postsP = store.dispatch('retrievePosts', true)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve posts from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let logsP = store.dispatch('retrieveLogs', true)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve logs from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let missionsP = store.dispatch('retrieveMissions', true)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve missions from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let groupsP = store.dispatch('retrieveGroups', true)
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve groups from server',
                        text: err.message,
                        duration: -1
                    });
                });


            Promise.all([usersP, postsP, logsP, missionsP, groupsP]).then(() => {
                this.loading = false;
            });
        },
        methods: {
            newGroup() {
                this.$modal.show('newGroup');
            },

            newEvent() {
                this.$modal.show('newEvent');
            },

            newMission() {
                this.$modal.show('newMission');
            },

            newUser() {
                if(this.user_pwd != this.user_pwd_conf) {
                    this.$notify({
                        type: 'error',
                        title: 'Please retry',
                        text: 'Passwords don\'t match !',
                        duration: 5000
                    });
                } else {
                    this.loading = true;
                    store.dispatch('insertUser', {username: this.user_name, email: this.user_email, password: this.user_pwd})
                        .then(() => {
                            this.user_name = '';
                            this.user_email = '';
                            this.user_pwd = '';
                            this.user_pwd_conf = '';
                        })
                        .then(() => {this.loading = false;})
                        .then(() => this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'User was successfully added',
                            duration: 5000
                        }))
                        .catch((err) => this.$notify({
                            type: 'error',
                            title: 'Operation failed',
                            text: err,
                            duration: 5000
                        }));
                }
            },

            async delGroup(name, id) {
                if(confirm('Delete group '+name+' ?')) {
                    this.loading = true;
                    try {
                        await store.dispatch('deleteGroup', id);
                        this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'User was successfully deleted',
                            duration: 5000
                        });
                    } catch(err) {
                        this.$notify({
                            type: 'error',
                            title: 'Operation failed',
                            text: err,
                            duration: 5000
                        });
                    }

                }
            },

            delUser(name, id) {
                if(confirm('Delete user '+name+' ?')) {
                    this.loading = true;
                    store.dispatch('deleteUser', id)
                        .then(() => {this.loading = false;})
                        .then(() => this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'User was successfully deleted',
                            duration: 5000
                        }))
                        .catch((err) => this.$notify({
                            type: 'error',
                            title: 'Operation failed',
                            text: err,
                            duration: 5000
                        }));
                }
            },

            delPost(title, id) {
                if(confirm('Delete post "'+title+'" ?')) {
                    this.loading = true;
                    store.dispatch('deletePost', id)
                        .then(() => {this.loading = false;})
                        .then(() => this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'Post was successfully deleted',
                            duration: 5000
                        }))
                        .catch(err => {
                            this.$notify({
                                type: 'error',
                                title: 'Uncaught error',
                                text: err.message,
                                duration: -1
                            });
                        });
                }
            },

            delEvent(title, id) {
                if(confirm('Delete event "'+title+'" ?')) {
                    this.loading = true;
                    store.dispatch('deleteEvent', id)
                        .then(() => {this.loading = false;})
                        .then(() => this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: 'Event was successfully deleted',
                            duration: 5000
                        }))
                        .catch(err => {
                            this.$notify({
                                type: 'error',
                                title: 'Uncaught error',
                                text: err.message,
                                duration: -1
                            });
                        });
                }
            },

        }
    };
</script>
