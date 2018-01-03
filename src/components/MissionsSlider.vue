<template>
    <section class="mission-slider" :key="missionNumber">
        <div class="controls">
            <a href="#" @click.prevent="prev" :class="{disabled: currentSlide === 0}">
                <i class="fa fa-chevron-left"></i> Previous
            </a>

            <h1>{{ mission.name }}</h1>

            <a href="#" @click.prevent="next" :class="{disabled: currentSlide === missionNumber - 1}">
                Next <i class="fa fa-chevron-right"></i>
            </a>
        </div>

        <div class="mission">
            <p v-html="mission.description" class="description"></p>

            <div class="mission-more">
                <div class="team">
                    <h2>Team</h2>
                    <div class="content">
                        <ul>
                            <li class="leader">Leader:
                                <router-link :to="{name: 'profile', params:{id: mission.leader.id}}">
                                    {{ mission.leader.username }}
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="budget">
                    <h2>Budget</h2>
                    <div class="content">
                        <div class="used">Used: {{ mission.budgetUsed }} €</div>
                        <div class="assigned">Assigned: {{ mission.budgetAssigned }} €</div>
                    </div>
                </div>

                <div class="tasks">
                    <h2>Tasks</h2>
                    <div class="content">

                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import store from '@/store';

    export default {
        data() {
            return {
                currentSlide: 0,
            };
        },
        computed: {
            mission() {
                const mission = store.getters.missions[this.currentSlide];
                return mission ? mission : {};
            },
            missionNumber() {
                return store.getters.missions.length;
            },
        },
        methods: {
            next() {
                if (this.currentSlide < this.missionNumber - 1)
                    this.currentSlide += 1;
            },
            prev() {
                if (this.currentSlide > 0)
                    this.currentSlide -= 1;
            }
        }
    };
</script>