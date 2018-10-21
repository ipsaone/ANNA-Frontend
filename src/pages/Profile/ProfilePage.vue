<template>
    <div class="profile">
        <div class="content">

          <h1 class="page-title"> Profile page </h1>

          <div class="myself">
                <span> {{ user.username }} </span>
                <span> {{ user.email }} </span>
                <img src="https://tse2.mm.bing.net/th?id=OIP.pNG1rtt42rb6YYQpfusd4AHaGm&pid=Api"
                 alt="member picture">
            </div>

              <div class="events">
                  <h2> Events </h2>
                  <ul>
                      <li v-for="event in user.events" :key="event.id"> {{event.name}} </li>
                  </ul>
              </div>


            <div class="groups">
                <h2> Groups </h2>
                <ul>
                    <li v-for="group in user.groups" :key="group.id"> {{group.name}} </li>
                </ul>
            </div>

            <div class="missions">
                <h2> Missions </h2>
                <ul>
                    <li v-for="mission in user.participatingMissions" :key="mission.id"> {{mission.name}} </li>
                </ul>
            </div>
            </div>


        </div>
    </div>
</template>

<script>
    import store from '@/modules/store';
    import Loader from '@/components/Loader';
    import UserApi from '@/modules/users/users_api';
    import GroupsApi from '@/modules/groups/groups_api';
    import MissionsApi from '@/modules/missions/missions_api';

    export default {
        components: {},
        async mounted() {
            this.loading = true;
            try {
                await store.dispatch('retrieveMissions', true);
                await store.dispatch('retrieveUsers', true);
                await store.dispatch('retrievePosts', true);
                await store.dispatch('retrieveLogs', true);
                await store.dispatch('retrieveGroups', true);
                await store.dispatch('selectUser', this.$route.params.id);
            } catch (err) {
                console.log(err);
                this.$notify({
                    type: 'error',
                    title: 'Cannot retrieve data from server',
                    text: err.message,
                    duration: -1
                });
            }
            this.loading = false;

        },
        computed: {
            auth() {
                return store.getters.loggedUser;
            },
            user() {
                return store.getters.selectedUser;
            }
        },
        methods: {

        }
    };
</script>
