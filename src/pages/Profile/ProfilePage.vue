<template>
    <div class="profile">
        <div class="content">

            <div class="myself">
            <!--    <div class="user-image">
                    <img src="https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-1/p240x240/41548489_1083714755126011_7097230446420819968_n.jpg?_nc_cat=0&oh=e5a655eae8ce4024ff449ae53a9a5515&oe=5C62D8D3"
                     alt="photo du membre">
                    <h3>EDIT</h3>
                </div>-->
                <h1> PAGE MEMBRE </h1>
                <p> {{ user.username }} <p>
                <p> {{ user.email }} </p>
            </div>

            <div class="assignments">
                <div class="groupes">
                    <h2> groupes </h2>
                    <ul>
                        <li v-for="group in $store.getters.groups" :key="group.id"> {{group.name}} </li>
                    </ul>
                </div>
                <div class="missions">
                    <h2> missions </h2>
                    <ul>
                        <li v-for="mission in $store.getters.missions" :key="mission.id"> {{mission.name}} </li>
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
