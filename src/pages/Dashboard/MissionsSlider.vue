<template>
    <section :key="missionNumber" class="mission-slider">
        <new-task />
        <mission-modal class="admin" />
        <mission-members class="admin" />

        <div v-if="loggedUserMissions.length > 0">
            <div class="controls">
                <div style="width: 30%; text-align: left;">
                    <a
                        href="#"
                        :class="{ disabled: currentSlide === 0 }"
                        @click.prevent="prev"
                    >
                        <i class="fa fa-chevron-left" /> Previous
                    </a>
                </div>

                <h1 style="margin-bottom: 0;">
                    {{ mission.name }}
                </h1>

                <div style="width: 30%; text-align: right">
                    <a
                        href="#"
                        :class="{ disabled: currentSlide === missionNumber - 1 }"
                        @click.prevent="next"
                    >
                        Next <i class="fa fa-chevron-right" />
                    </a>
                </div>
            </div>
            <h3
                v-if="logged.id === mission.leaderId"
                style="text-align:center; font-size: 1.2em; margin-top: -5px;"
            >
                <a
                    @click.prevent="
                        $modal.show('missionModal', { mission_id: mission.id })
                    "
                >Edit</a>,
                <a
                    @click.prevent="
                        $modal.show('missionMembers', { mission_id: mission.id })
                    "
                >Manage members</a>
            </h3>

            <div class="mission">
                <div class="mission-left">
                    <div class="description">
                        <h2>Description</h2>
                        <p class="content" v-html="mission.description" />
                    </div>

                    <div class="team">
                        <h2>Team</h2>
                        <div class="content">
                            <ul class="leader">
                                Leader:
                                <li v-if="mission.leader && mission.leader.id">
                                    <router-link
                                        :to="{ name: 'profile', params: { id: mission.leader.id } }"
                                    >
                                        - {{ mission.leader.username }}
                                    </router-link>
                                </li>
                            </ul>
                            <ul class="members">
                                Members:
                                <li v-for="member in missionMembers" :key="member.id">
                                    <router-link
                                        :to="{ name: 'profile', params: { id: member.id } }"
                                    >
                                        - {{ member.username }}
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="mission-right">
                    <div class="budget">
                        <h2>Budget</h2>
                        <div class="content">
                            <div class="assigned">
                                Assigned: {{ mission.budgetAssigned + 0 }} €
                            </div>
                            <div class="used">Used: {{ mission.budgetUsed + 0 }} €</div>
                        </div>
                    </div>

                    <div class="tasks">
                        <h2>Tasks</h2>
                        <div class="content">
                            <ul>
                                <li v-for="task in mission.tasks" :key="task.id">
                                    <div class="checkbox-container">
                                        <input
                                            :id="'task' + task.id"
                                            v-model="task.done"
                                            type="checkbox"
                                            :name="task.name"
                                            @change="taskChange(task)"
                                        />
                                        <label :for="task.id">{{ task.name }}</label>
                                        <label class="checkbox" :for="'task' + task.id" />
                                        <i
                                            v-if="
                                                $store.getters.loggedUserIsRoot ||
                                                    logged.id === mission.leaderId
                                            "
                                            class="fa fa-trash"
                                            @click.prevent="delTask(task.id)"
                                        />
                                    </div>
                                </li>
                                <em v-if="mission.tasks && mission.tasks.length === 0">No tasks yet !</em>
                                <a
                                    v-if="
                                        $store.getters.loggedUserIsRoot ||
                                            logged.id === mission.leaderId
                                    "
                                    @click.prevent="newTask"
                                >Add task</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="no-mission-message">
                <b>Error 404 : mission not found</b><br />
                You aren't signed-up to any mission. Ask your mission leader !
                <br /><br />
                Feel free to go read the
                <router-link :to="{ name: 'blog' }">
                    latest blog entries
                </router-link>
                until he finally does his work ;-)
            </p>
        </div>
    </section>
</template>

<script>
import store from '@/modules/store';
import MissionModal from '../Admin/MissionModal';
import MissionMembers from '../Admin/MissionMembers';
import newTask from './newTask';

export default {
    components: {
        newTask,
        MissionModal,
        MissionMembers
    },
    data() {
        return {
            currentSlide: 0
        };
    },
    computed: {
        mission() {
            return store.getters.selectedMission;
        },
        missionNumber() {
            return store.getters.loggedUserMissions.length;
        },
        disabledInput() {
            return (
                !store.getters.loggedUserIsRoot ||
        store.getters.loggedUserId !== this.mission.leader.id
            );
        },
        logged() {
            return store.getters.loggedUser;
        },
        loggedUserMissions() {
            return store.getters.loggedUserMissions;
        },
        missionMembers() {
            return store.getters.selectedMission.members.filter(x => x.id);
        }
    },
    async mounted() {
        await store.dispatch('retrieveMissions', true);
        if (store.getters.loggedUserMissions.length > 0) {
            await store.dispatch(
                'retrieveMission',
                store.getters.loggedUserMissions[0]
            );
        }
    },
    methods: {
        next() {
            if (this.currentSlide < this.missionNumber - 1) {
                this.currentSlide += 1;
                store.dispatch(
                    'retrieveMission',
                    store.getters.loggedUserMissions[this.currentSlide]
                );
            }
        },
        prev() {
            if (this.currentSlide > 0) {
                this.currentSlide -= 1;
                store.dispatch(
                    'retrieveMission',
                    store.getters.loggedUserMissions[this.currentSlide]
                );
            }
        },
        async taskChange(task) {
            const data = {
                task: {
                    id: task.id,
                    done: task.done,
                    name: task.name
                },
                missionId: task.missionId
            };

            await store.dispatch('updateTask', data);
        },
        newTask() {
            this.$modal.show('newTask', store.getters.selectedMission);
        },
        delTask(id) {
            store.dispatch('deleteTask', {
                id: id,
                missionId: store.getters.selectedMission.id
            });
        }
    }
};
</script>
