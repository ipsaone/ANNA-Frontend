<template>
    <section class="admin">
        <div class="content">
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
                            <td> {{ mission.leader }} </td>
                            <td> {{ mission }} </td>
                            <td> {{ mission.members.length }} </td>
                            <td> [Actions] </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="show_add_mission = !show_add_mission">Add mission</a></td>
                        </tr>
                    </table>

                    <div v-if="show_add_mission" class="add-mission">
                        <div class="form-group">
                            <label for="miss-name">Mission name :</label>
                            <input type="text" name="miss-name" v-model="miss_name">
                        </div>

                        <div class="form-group">
                            <label for="miss-budget">Mission budget :</label>
                            <input type="number" name="miss-budget" v-model="miss_budget">
                        </div>

                        <div class="form-group">
                            <label for="miss-budget">Mission leader :</label>
                            <input type="number" name="miss-leader" v-model="miss_leader">
                        </div>

                        <div class="form-group">
                            <label for="miss-desc">Mission description (markdown) :</label>
                            <input type="text" name="miss-desc" v-model="miss_desc">
                        </div>

                        

                        <input type="submit" @click.prevent="newMission" value="Send"></button>
                    </div>
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
                            <td> {{ log.name }} </td>
                            <td> {{ mission.date }} </td>
                            <td> {{ mission.description }} </td>
                            <td> [Linked things] </td>
                            <td> [Actions] </td>
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
                            <td> <a>Show</a>, <a>Edit</a>, <a>Delete</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a>Add post</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="groups">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="group in groups" :key="group.id">   
                            <td> {{ mission.name }} </td>
                            <td> {{ mission.members.length }} </td>
                            <td> [Actions] </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td><a>Add group</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="users">
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Groups</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="user in users" :key="user.id">   
                            <td> {{ user.username }} </td>
                            <td> {{ user.email }} </td>
                            <td> {{ user.groups }} </td>
                            <td> <a>Change password</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="show_add_user = !show_add_user">Add user</a></td>
                        </tr>
                    </table>
                    <div v-if="show_add_user" class="add-user">
                        <div  class="form-group add_user">
                            <label for="user-name">Username :</label>
                            <input type="text" name="user-name" v-model="user_name">
                        </div>
                        <div class="form-group">
                            <label for="user-email">Email :</label>
                            <input type="text" name="user-email" v-model="user_email">
                        </div>
                        <div class="form-group">
                            <label for="user-pwd">Password :</label>
                            <input type="password" name="user-pwd" v-model="user_pwd">
                        </div>

                        <div class="form-group">
                            <label for="user-pwd-2">Password (again) :</label>
                            <input type="password" name="user-pwd-2" v-model="user_pwd_conf">
                        </div>

                        <input type="submit" @click.prevent="newUser" value="Send"></button>
                    </div>
                </tab>
            </tabs>
        </div>
    </section>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import UserApi from '@/modules/users/users_api';
    import {Tabs, Tab} from 'vue-tabs-component';

    export default {
        components: {
            Loader,
            Tabs, Tab
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
                show_add_user: false
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
            }
        },
        mounted() {
            this.loading = true;

            let usersP = store.dispatch('retrieveUsers')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve users from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let postsP = store.dispatch('retrievePosts')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve posts from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let logsP = store.dispatch('retrieveLogs')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve logs from server',
                        text: err.message,
                        duration: -1
                    });
                });
            let missionsP = store.dispatch('retrieveMissions')
                .catch(err => {
                    this.$notify({
                        type: 'error',
                        title: 'Cannot retrieve missions from server',
                        text: err.message,
                        duration: -1
                    });
                });

            
            Promise.all([usersP, postsP, logsP, missionsP]).then(() => {
                this.loading = false;
            });
        },
        methods: {
            newGroup() {
                if (group_name)
                    GroupApi.create(group_name);
            },

            newMission() {
                this.loading = true;
                store.dispatch('saveMission')
                    .then(() => {
                        this.loading = false;
                    });
            },

            newUser() {
                if (this.user_name && this.user_email && this.user_pwd) {
                    if(this.user_pwd != this.user_pwd_conf) {
                        alert('Passwords don\'t match !');
                        return false;
                    }

                    UserApi.add({
                        username: this.user_name,
                        email: this.user_email,
                        password: this.user_pwd
                    }).then(() => this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: 'User was successfully added',
                        duration: 5000
                    }))
                    .then(() => {
                        this.user_name = '';
                        this.user_email = '';
                        this.user_pwd = '';
                        this.user_pwd_conf = '';
                    })
                    .catch((err) => this.$notify({
                        type: 'error',
                        title: 'Operation failed',
                        text: err,
                        duration: 5000
                    }));
                }
            }

        }
    };
</script>
