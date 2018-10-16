<template>
    <div class='admin'>
        <new-mission></new-mission>
        <new-group></new-group>
        <new-event></new-event>
        <new-user></new-user>
        <group-members></group-members>
        <mission-members></mission-members>


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
                        <tr v-for="mission in $store.getters.missions" :key="mission.id">
                            <td> {{ mission.name }} </td>
                            <td> {{ mission.leader.username }} </td>
                            <td> {{ mission.budgetUsed+0 }} / {{ mission.budgetAssigned }} </td>
                            <td> {{ mission.memberCount }} </td>
                            <td>
                                <a @click.prevent="$modal.show('missionsMembers', {mission_id: mission.id});">
                                    Manage members
                                </a>,
                                <a>
                                    Manage budget
                                </a>,
                                <a>
                                    Manage tasks
                                </a>,
                                <a @click.prevent="delItem('mission', 'deleteMission', mission.name, mission.id)">
                                    Delete
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="$modal.show('newMission')">Add mission</a></td>
                        </tr>
                    </table>
                </tab>

                <!--
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
                -->

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
                        <tr v-for="post in $store.getters.posts" :key="post.id">
                            <td> {{ post.id }} </td>
                            <td> {{ post.title }} </td>
                            <td> {{ post.createdAt }} </td>
                            <td> {{ post.author.username }} </td>
                            <td> {{ post.content }} </td>
                            <td>
                                <router-link :to="{name: 'readPost', params: {id: post.id}}">Show</router-link>,
                                <router-link :to="{name: 'editPost', params: {id: post.id}}">Edit</router-link>,
                                <a @click.prevent="delItem('post', 'deletePost', post.title, post.id)">Delete</a>
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
                        <tr v-for="group in $store.getters.groups" :key="group.id">
                            <td> {{ group.name }} </td>
                            <td> {{ group.users.length }} </td>
                            <td>
                                <a @click.prevent="$modal.show('groupMembers', {group_id: group.id});">
                                    Manage users
                                </a>,
                                <a @click.prevent="delItem('group', 'deleteGroup', group.name, group.id)">
                                    Delete
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="$modal.show('newGroup');">Add group</a></td>
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
                        <tr v-for="user in $store.getters.users" :key="user.id">
                                <td> {{ user.id }} </td>
                            <td> {{ user.username }} </td>
                            <td> {{ user.email }} </td>
                            <td> {{ user.groups }} </td>
                            <td>
                                <a>Manage groups</a>,
                                <a>Change password</a>,
                                <a @click.prevent="delItem('user', 'deleteUser', user.username, user.id)">Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="$modal.show('newUser')">Add user</a></td>
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
                        <tr v-for="event in $store.getters.events" :key="event.id">
                            <td> {{ event.id }} </td>
                            <td> {{ event.name }} </td>
                            <td> ? / {{ event.maxRegistered }} </td>
                            <td> {{ event.startDate }} - {{ event.endDate }} </td>
                            <td>
                                <a>Edit</a>,
                                <a>Manage registered</a>,
                                <a @click.prevent="delItem('mission', 'deleteMission', event.name, event.id)">Delete</a> </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><a @click.prevent="$modal.show('newEvent');">Add event</a></td>
                        </tr>
                    </table>
                </tab>
            </tabs>
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
    import NewUser from './NewUser';
    import MissionMembers from './MissionMembers';
    import GroupMembers from './GroupMembers';

    export default {
        components: {
            Loader,
            Tabs, Tab,
            NewMission, MissionMembers,
            NewGroup, GroupMembers,
            NewEvent,
            NewUser
        },
        data() {
            return {
                loading: false
            };
        },
        computed: {
        },
        async mounted() {
            this.loading = true;

            try {
                await store.dispatch('retrieveMissions', true);
                await store.dispatch('retrieveUsers', true);
                await store.dispatch('retrievePosts', true);
                await store.dispatch('retrieveLogs', true);
                await store.dispatch('retrieveGroups', true);
                this.loading = false;
            } catch (err) {
                this.$notify({
                    type: 'error',
                    title: 'Cannot retrieve users from server',
                    text: err.message,
                    duration: -1
                });
            }

        },
        methods: {
            async delItem(type_name, action_name, item_name, item_id) {
                if(confirm('Delete '+type_name+' "'+item_name+'" ?')) {
                    this.loading = true;
                    try {
                        await store.dispatch(action_name, item_id);
                        this.$notify({
                            type: 'success',
                            title: 'Operation successful',
                            text: type_name+' was successfully deleted',
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
            }

        }
    };
</script>
