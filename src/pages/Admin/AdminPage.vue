<template>
    <div class="admin">
        <!--new-mission></new-mission-->
        <new-group />
        <!--new-event></new-event-->
        <new-user />
        <group-members />
        <mission-members />
        <!--edit-event></edit-event-->
        <event-modal />
        <!--edit-mission></edit-mission-->
        <mission-modal />
        <event-members />
        <edit-user />
        <edit-group />

        <section class="content">
            <h1 class="section-title">
                Administration
            </h1>
            <tabs>
                <tab name="Missions">
                    <table>
                        <tr>
                            <!--th>ID</th-->
                            <th>Name</th>
                            <th>Leader</th>
                            <th>Budget</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="mission in orderedMissions" :key="mission.id">
                            <!--td> {{ mission.id }} </td-->
                            <td>{{ mission.name }}</td>
                            <td>{{ mission.leader.username }}</td>
                            <!-- TODO : why is it a string in the first place ? (+0 to convert to number) -->
                            <td>
                                {{ mission.budgetUsed + 0 }} / {{ mission.budgetAssigned + 0 }}
                            </td>
                            <td>{{ mission.memberCount }}</td>
                            <td>
                                <a
                                    @click.prevent="
                                        $modal.show('missionMembers', { mission_id: mission.id })
                                    "
                                >
                                    Manage members </a>,
                                <a
                                    @click.prevent="
                                        $modal.show('missionModal', { mission_id: mission.id })
                                    "
                                >Edit</a>,
                                <a
                                    @click.prevent="
                                        delItem(
                                            'mission',
                                            'deleteMission',
                                            mission.name,
                                            mission.id
                                        )
                                    "
                                >
                                    Delete
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <!--td></td-->
                            <td />
                            <td />
                            <td />
                            <td />
                            <td>
                                <a
                                    @click.prevent="
                                        $modal.show('missionModal', { loggedUser: loggedUser })
                                    "
                                >Add mission</a>
                            </td>
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
                            <!--th>ID</th-->
                            <th>Title</th>
                            <th>Date</th>
                            <th>Author</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="post in $store.getters.posts" :key="post.id">
                            <!--td> {{ post.id }} </td-->
                            <td>{{ post.title }}</td>
                            <td>{{ post.createdAt | moment("DD/MM/YYYY") }}</td>
                            <td>{{ post.author.username }}</td>
                            <td>
                                {{ post.published ? "Published" : "Draft"
                                }}{{ post.pinned ? ", Pinned" : "" }}
                            </td>
                            <td>
                                <router-link
                                    :to="{ name: 'readPost', params: { id: post.id } }"
                                >
                                    Show
                                </router-link>,
                                <router-link
                                    :to="{ name: 'editPost', params: { id: post.id } }"
                                >
                                    Edit
                                </router-link>,
                                <a
                                    @click.prevent="
                                        delItem('post', 'deletePost', post.title, post.id)
                                    "
                                >Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <!--td></td-->
                            <td />
                            <td />
                            <td />
                            <td />
                            <td>
                                <router-link :to="{ name: 'newPost' }">
                                    Add post
                                </router-link>
                            </td>
                        </tr>
                    </table>
                </tab>

                <tab name="Groups">
                    <table>
                        <tr>
                            <!--th>ID</th-->
                            <th>Name</th>
                            <th>Members</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="group in orderedGroups" :key="group.id">
                            <!--td> {{group.id}} </td-->
                            <td>{{ group.name }}</td>
                            <td>{{ group.users.length }}</td>
                            <td>
                                <a
                                    v-if="group.name !== 'default'"
                                    @click.prevent="
                                        $modal.show('groupMembers', { group_id: group.id })
                                    "
                                >
                                    Manage users,
                                </a>
                                <a
                                    v-if="
                                        group.name !== 'root' &&
                                            group.name !== 'default' &&
                                            group.name !== 'authors' &&
                                            group.name !== 'organizers'
                                    "
                                    @click.prevent="
                                        $modal.show('editGroup', {
                                            group_id: group.id,
                                            group_name: group.name
                                        })
                                    "
                                >
                                    Edit name,
                                </a>
                                <a
                                    v-if="group.name !== 'root' && group.name !== 'default'"
                                    @click.prevent="
                                        delItem('group', 'deleteGroup', group.name, group.id)
                                    "
                                >
                                    Delete
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <!--td></td-->
                            <td />
                            <td />
                            <td><a @click.prevent="$modal.show('newGroup')">Add group</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Users">
                    <table>
                        <tr>
                            <!--th>ID</th-->
                            <th>Name</th>
                            <th>Email</th>
                            <!--th>Groups</th-->
                            <th>Actions</th>
                        </tr>
                        <tr v-for="user in orderedUsers" :key="user.id">
                            <!--td> {{ user.id }} </td-->
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <!-- td> <span> {{userGroups}} </span></td-->
                            <td>
                                <a
                                    v-if="user.id === loggedUser.id"
                                    @click.prevent="$modal.show('editUser', { user_id: user.id })"
                                >Edit</a>
                                <a
                                    v-if="user.id !== loggedUser.id"
                                    @click.prevent="$modal.show('editUser', { user_id: user.id })"
                                >Edit,</a>
                                <a
                                    v-if="user.id !== loggedUser.id"
                                    @click.prevent="
                                        delItem('user', 'deleteUser', user.username, user.id)
                                    "
                                >Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <!--td></td-->
                            <td />
                            <td />
                            <!--td></td-->
                            <td><a @click.prevent="$modal.show('newUser')">Add user</a></td>
                        </tr>
                    </table>
                </tab>

                <tab name="Events">
                    <table>
                        <tr>
                            <!--th>ID</th-->
                            <th>Name</th>
                            <th>Registered</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        <tr v-for="event in $store.getters.events" :key="event.id">
                            <!--td> {{ event.id }} </td-->
                            <td>{{ event.name }}</td>
                            <td>{{ event.registeredCount }} / {{ event.maxRegistered }}</td>
                            <td>
                                {{ event.startDate | moment("DD/MM/YYYY") }} -
                                {{ event.endDate | moment("DD/MM/YYYY") }}
                            </td>
                            <td>
                                <a
                                    @click.prevent="
                                        $modal.show('eventMembers', { event_id: event.id })
                                    "
                                >Manage registered</a>,
                                <!--a @click.prevent="$modal.show('editEvent', {event_id: event.id})">Edit</a>,-->
                                <a
                                    @click.prevent="
                                        $modal.show('eventModal', {
                                            event_id: event.id,
                                            isEditing: true
                                        })
                                    "
                                >Edit</a>,
                                <a
                                    @click.prevent="
                                        delItem('event', 'deleteEvent', event.name, event.id)
                                    "
                                >Delete</a>
                            </td>
                        </tr>
                        <tr>
                            <!--td></td-->
                            <td />
                            <td />
                            <td />
                            <td>
                                <!--a @click.prevent="$modal.show('newEvent');">Add event</a-->
                                <a
                                    @click.prevent="
                                        $modal.show('eventModal', { isEditing: false })
                                    "
                                >Add event</a>
                            </td>
                        </tr>
                    </table>
                </tab>
            </tabs>
        </section>
    </div>
</template>

<script>
import store from '@/modules/store';
import { Tabs, Tab } from 'vue-tabs-component';

//import NewMission from './NewMission';
import MissionModal from './MissionModal';
import NewGroup from './NewGroup';
import EditGroup from './EditGroup';
// import NewEvent from './NewEvent';
import NewUser from './NewUser';
import MissionMembers from './MissionMembers';
import EventMembers from './EventMembers';
import GroupMembers from './GroupMembers';
// import EditEvent from './EditEvent';
import EventModal from './EventModal';
// import EditMission from './EditMission';
import EditUser from './EditUser';

import * as _ from 'lodash';
import swal from 'sweetalert2';

export default {
    components: {
        Tabs,
        Tab,
        MissionMembers,
        MissionModal,
        NewGroup,
        GroupMembers,
        EditGroup,
        // NewEvent, EditEvent,
        EventMembers,
        EventModal,
        NewUser,
        EditUser
    },
    data() {
        return {
            loading: false
        };
    },
    computed: {
        missions() {
            return store.getters.missions;
        },
        orderedMissions() {
            return _.orderBy(this.missions, 'id');
        },
        groups() {
            return store.getters.groups;
        },
        orderedGroups() {
            return _.orderBy(this.groups, 'id');
        },
        users() {
            return store.getters.users;
        },
        orderedUsers() {
            return _.orderBy(this.users, 'id');
        },
        loggedUser() {
            return store.getters.loggedUser;
        }
    },
    async mounted() {
        await this.refreshAll();
        return this.user;
    },
    methods: {
        async refreshAll() {
            this.loading = true;
            let reqs = [
                store.dispatch('retrieveMissions', true),
                store.dispatch('retrieveUsers', true),
                store.dispatch('retrievePosts', true),
                store.dispatch('retrieveLogs', true),
                store.dispatch('retrieveGroups', true),
                store.dispatch('retrieveEvents', true)
            ];
            await Promise.all(reqs);
            this.loading = false;
        },
        async delItem(type_name, action_name, item_name, item_id) {
            swal.fire({
                title: 'Deletion warning',
                text: 'Remove '+type_name+'?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor: '#E74D3C',
                cancelButtonColor: '#7A7A7A'
            }).then((go) => {
                if(!go.value) {
                    return;
                }

                this.loading = true;
                store.dispatch(action_name, item_id);
                this.refreshAll();
                this.$notify({
                    type: 'success',
                    title: 'Operation successful',
                    text: type_name+' was successfully deleted',
                    duration: 5000
                });
            });
        }
    }
};
</script>
