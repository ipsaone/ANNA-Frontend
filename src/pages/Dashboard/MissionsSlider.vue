<template>
    <section class="mission-slider" :key="missionNumber">
        <new-task></new-task>

        <div v-if="loggedUserMissions.length > 0/*&& mission.members.includes(logged.username)*/">
            <div class="controls">
                <a href="#" @click.prevent="prev" :class="{disabled: currentSlide === 0}">
                    <i class="fa fa-chevron-left"></i> Previous
                </a>

                <h1>{{ mission.name }}</h1>

                <a href="#" @click.prevent="next" :class="{disabled: currentSlide === missionNumber-1}">
                    Next <i class="fa fa-chevron-right"></i>
                </a>
            </div>

            <div class="mission">
                <div class="mission-left">

                    <div class="description">
                        <h2>Description :</h2>
                        <p class="content" v-html="mission.description" ></p>
                    </div>

                    <div class="team">
                        <h2>Team</h2>
                        <div class="content">
                            <ul class="leader">
                                Leader:
                                <li v-if="mission.leader && mission.leader.id">
                                    <router-link :to="{name: 'profile', params:{id: mission.leader.id}}">
                                        - {{ mission.leader.username}}
                                    </router-link>
                                </li>
                            </ul>
                            <ul class="members">
                                Members:
                                <li v-for="member in mission.members" v-if="member.id" :key="member.id">
                                    <router-link :to="{name: 'profile', params:{id: member.id}}">
                                        - {{ member.username }},
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
                            <div class="used">Used: {{ mission.budgetUsed+0 }} €</div>
                            <div class="assigned">Assigned: {{ mission.budgetAssigned+0 }} €</div>
                        </div>
                    </div>

                    <div class="tasks">
                        <h2>Tasks</h2>
                        <div class="content">
                            <ul>
                                <li v-for="task in mission.tasks" :key="task.id">
                                    <div class="checkbox-container">
                                        <input type="checkbox" :name="task.name" :id="task.id">
                                        <label :for="task.id">{{ task.name }}</label>
                                        <label class="checkbox" :for="task.id"></label>
                                        <i v-if="$store.getters.loggedUserIsRoot" @click.prevent="delTask(task.id)" class="fa fa-trash"></i>
                                    </div>
                                </li>
                                <em v-if="mission.tasks.length == 0">No tasks yet !</em>
                                <a @click.prevent="newTask">Add task</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <p class="no-mission-message">
                <b>Error 404 : mission not found</b><br>
                You aren't signed-up to any mission. Ask your mission chief !
                <br><br>
                Feel free to go read the <router-link :to="{name: 'blog'}">latest blog entries</router-link> until he finally does his work ;-)

            </p>
        </div>
    </section>
</template>

<script>
    import store from '@/modules/store';

    import newTask from './newTask';

    export default {
        components: {
            newTask
        },
        data() {
            return {
                currentSlide: 0,
            };
        },
        async mounted() {
            await store.dispatch('retrieveMissions', true);
            console.log('store.getters.loggedUser.participatingMissions', store.getters.loggedUser.participatingMissions);
            console.log('store.getters.loggedUserMissions', store.getters.loggedUserMissions);
            if (store.getters.loggedUser.participatingMissions.length > 0) {
                await store.dispatch('retrieveMission', store.getters.loggedUser.participatingMissions[0].id);
            }
        },
        computed: {
            mission() {
                console.log('boum', store.getters.loggedUser.participatingMissions);
                return store.getters.selectedMission;
            },
            missionNumber() {
                return store.getters.loggedUser.participatingMissions.length;
            },
            disabledInput() {
                return !store.getters.loggedUserIsRoot || store.getters.loggedUserId !== this.mission.leader.id;
            },
            logged() {
                return store.getters.loggedUser;
            },
            loggedUserMissions() {
                return store.getters.loggedUser.participatingMissions;
            }
        },
        methods: {
            next() {
                if (this.currentSlide < this.missionNumber - 1) {
                    this.currentSlide += 1;
                    //store.dispatch('retrieveMission', store.getters.missions[this.currentSlide].id);
                    store.dispatch('retrieveMission', store.getters.loggedUser.participatingMissions[this.currentSlide].id);
                }
            },
            prev() {
                if (this.currentSlide > 0) {
                    this.currentSlide -= 1;
                    //store.dispatch('retrieveMission', store.getters.missions[this.currentSlide].id);
                    console.log('VOILA QUI JE SUIS \n', store.getters.loggedUser);
                    store.dispatch('retrieveMission', store.getters.loggedUser.participatingMissions[this.currentSlide].id);
                }
            },
            async taskChange(task) {
                const data = {
                    task: {
                        id: task.id,
                        done: !task.done,
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
                store.dispatch('deleteTask', {id: id, missionId: store.getters.selectedMission.id});
            }
        }
    };
</script>
