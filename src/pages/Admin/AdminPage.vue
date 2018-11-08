<template>
    <div class='admin'>
        <new-mission></new-mission>
        <new-group></new-group>
        <new-event></new-event>
        <new-user></new-user>
        <group-members></group-members>
        <mission-members></mission-members>
        <edit-event></edit-event>
        <edit-mission></edit-mission>
        <event-members></event-members>
        <edit-user></edit-user>

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
                            <!-- TODO : why is it a string in the first place ? (+0 to convert to number) -->
                            <td> {{ mission.budgetUsed+0 }} / {{ mission.budgetAssigned+0 }} </td>
                            <td> {{ mission.memberCount }} </td>
                            <td>
                                <a @click.prevent="$modal.show('missionMembers', {mission_id: mission.id});">
                                    Manage members
                                </a>,
                                <a @click.prevent="$modal.show('editMission', {mission_id: mission.id})">Edit</a>,
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
                            <th>Actions</th>
                        </tr>
                        <tr v-for="post in $store.getters.posts" :key="post.id">
                            <td> {{ post.id }} </td>
                            <td> {{ post.title }} </td>
                            <td> {{ post.createdAt | moment('DD/MM/YYYY') }} </td>
                            <td> {{ post.author.username }} </td>
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
                                <a v-if="group.name !== 'root'"@click.prevent="$modal.show('groupMembers', {group_id: group.id});">
                                    Manage users,
                                </a>
                                <a v-if="group.name == 'root'" @click.prevent="$modal.show('groupMembers', {group_id: group.id});">
                                    Manage users
                                </a>
                                <a v-if="group.name !== 'root'" @click.prevent="delItem('group', 'deleteGroup', group.name, group.id)">
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
                            <td> <span> {{userGroups}} </span></td>
                            <td>
                                <a v-if="user.id === $store.getters.loggedUserId" @click.prevent="$modal.show('editUser', {user_id: user.id})">Edit</a>
                                <a v-if="user.id !== $store.getters.loggedUserId" @click.prevent="$modal.show('editUser', {user_id: user.id})">Edit,</a>
                                <a v-if="user.id !== $store.getters.loggedUserId" @click.prevent="delItem('user', 'deleteUser', user.username, user.id)">Delete</a>
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
                            <td> {{ event.registeredCount }} / {{ event.maxRegistered }} </td>
                            <td> {{ event.startDate | moment('DD/MM/YYYY') }} - {{ event.endDate | moment('DD/MM/YYYY') }} </td>
                            <td>
                                <a @click.prevent="$modal.show('eventMembers', {event_id: event.id})">Manage registered</a>,
                                <a @click.prevent="$modal.show('editEvent', {event_id: event.id})">Edit</a>,
                                <a @click.prevent="delItem('event', 'deleteEvent', event.name, event.id)">Delete</a>
                            </td>
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
    import EventMembers from './EventMembers';
    import GroupMembers from './GroupMembers';
    import EditEvent from './EditEvent';
    import EditMission from './EditMission';
    import EditUser from './EditUser';

    import * as moment from 'moment';

    export default {
        components: {
            Loader,
            Tabs, Tab,
            NewMission, MissionMembers,  EditMission,
            NewGroup, GroupMembers,
            NewEvent, EventMembers, EditEvent,
            NewUser, EditUser

        },
        data() {
            return {
                loading: false
            };
        },
        computed: {
            missions() {
                console.log('salut');
                return store.getters.missions;
            },
            groups() {
                return store.getters.loggedUser.groups;
            },
            users() {
                let i;
                let users = [];
                for(i = 1; i <= store.getters.users.length; i++) {
                    store.dispatch('selectUser', i)
                    .then(_ => {
                        store.dispatch('retrieveGroups')
                        .then(_ => {
                            users.push(store.getters.selectedUser);
                        });
                    });
                }
                console.log('voilà les user', users);
                return users;
            },
            userGroups() {
                let i;
                let groups = [];
                let u = this.users;
                for(i = 1; i <= u.length; i++) {
                    store.dispatch('retrieveGroups')
                    .then(_ => {
                        groups.push(u[i]);
                    });
                }
                console.log('tada', groups);
            }
        },
        async mounted() {
            await this.refreshAll();
            return this.user;
        },
        methods: {
            async refreshAll() {
                this.loading = true;
                await store.dispatch('retrieveMissions', true);
                await store.dispatch('retrieveUsers', true);
                await store.dispatch('retrievePosts', true);
                await store.dispatch('retrieveLogs', true);
                await store.dispatch('retrieveGroups', true);
                await store.dispatch('retrieveEvents', true);
                this.loading = false;

            },
            async delItem(type_name, action_name, item_name, item_id) {
                if(confirm('Delete '+type_name+' "'+item_name+'" ?')) {
                    this.loading = true;
                    await store.dispatch(action_name, item_id);
                    await this.refreshAll();
                    this.$notify({
                        type: 'success',
                        title: 'Operation successful',
                        text: type_name+' was successfully deleted',
                        duration: 5000
                    });

                }
            }

        }
    };
</script>
