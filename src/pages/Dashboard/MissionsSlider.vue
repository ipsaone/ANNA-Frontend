<template>
    <section class="mission-slider" :key="missionNumber">
        <new-task></new-task>

        <div v-if="mission.id">
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
                <div class="description"><p>Description :</p> <span v-html="mission.description" ></span></div>

                <div class="mission-more">
                    <div class="team">
                        <h2>Team</h2>
                        <div class="content">
                            <ul class="leader">
                                Leader:
                                <li >
                                    <router-link :to="{name: 'profile', params:{id: mission.leader.id}}">
                                        {{ mission.leader.username }}
                                    </router-link>
                                </li>
                            </ul>
                            <ul class="members">
                                Members:
                                <li v-for="member in mission.members" :key="member.id">
                                    <router-link :to="{name: 'profile', params:{id: member.id}}">
                                        {{ member.username }},
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>

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
                            <ul v-if="mission.tasks.length > 0">
                                <li  v-for="task in mission.tasks" :key="task.id">
                                    <input type="checkbox" name="done" id="done" @change="taskChange(task)"
                                           :checked="task.done == 1"
                                           :disabled="disabledInput">
                                    {{ task.name }}
                                </li>
                            </ul>

                            <div v-else>
                                <em>No tasks yet !</em>
                            </div>

                            <div class="add_task"><a @click.prevent="newTask">Add task</a></div>
                            
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
    import TasksApi from '@/modules/missions/tasks_api';

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
        computed: {
            mission() {
                // console.log(store.getters.selectedMission);
                return store.getters.selectedMission;
            },
            missionNumber() {
                return store.getters.missions.length;
            },
            disabledInput() {
                return !store.getters.loggedUserIsRoot || store.getters.loggedUserId !== this.mission.leader.id;
            }
        },
        methods: {
            next() {
                if (this.currentSlide < this.missionNumber - 1) {
                    this.currentSlide += 1;
                    store.dispatch('selectMission', store.getters.missions[this.currentSlide].id);
                }
            },
            prev() {
                if (this.currentSlide > 0) {
                    this.currentSlide -= 1;
                    store.dispatch('selectMission', store.getters.missions[this.currentSlide].id);
                }
            },
            taskChange(task) {
                const data = {
                    id: task.id,
                    done: !task.done,
                    missionId: task.missionId
                };

                TasksApi.update(data)
                    .then(() => store.dispatch('selectMission', task.missionId));
            },
            newTask() {
                this.$modal.show('newTask', store.getters.selectedMission);
            }
        }
    };
</script>