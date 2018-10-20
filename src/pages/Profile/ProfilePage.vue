<template>
    <div class="profile">
        <div class="content">

            <div class="myself">
                <h1> PAGE MEMBRE </h1>
                <p> {{ user.username }} <p>
                <p> {{ user.email }} </p>
            </div>

            <div class="assignments">
                <div class="groupes">
                    <h2> groupes </h2>
                    <ul>
                        <li v-for="group in user.groups" :key="group.id"> {{group.name}} </li>
                    </ul>
                </div>
                <div class="missions">
                    <h2> missions </h2>
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
