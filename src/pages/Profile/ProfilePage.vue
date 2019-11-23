<template>
  <div class="profile">
    <change-password />

    <div class="content">
      <div class="page-title">
        <h1 class="maj-cap">
          Profile page : {{ user.username }}
        </h1>
        <h3 style="font-size: 1.2em">
          <a
            v-if="user.id == auth.id"
            @click.prevent="$modal.show('changePassword', {user_id: auth.id})"
          >Change Password</a>
        </h3>
      </div>

      <div class="myself">
        <h2> Info </h2>
        <div class="content-wrapper">
          <span> Email: {{ user.email }} </span>
          <br>
          <span> Creation date: {{ getDate(user.createdAt) }} </span>
          <!--img src="https://tse2.mm.bing.net/th?id=OIP.pNG1rtt42rb6YYQpfusd4AHaGm&pid=Api"
                 alt="member picture"-->
        </div>
      </div>

      <div class="events">
        <h2> Events </h2>
        <div class="content-wrapper">
          <ul>
            <li
              v-for="event in user.events"
              :key="event.id"
            >
              {{ event.name }}
            </li>
          </ul>
        </div>
      </div>


      <div class="groups">
        <h2> Groups </h2>
        <div class="content-wrapper">
          <ul>
            <li
              v-for="group in user.groups"
              :key="group.id"
            >
              {{ group.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="missions">
        <h2> Missions </h2>
        <div
          id="missions-wrapper"
          class="content-wrapper"
        >
          <ul id="leading">
            Leading:
            <li
              v-for="mission in user.leaderMissions"
              :key="mission.id"
            >
              {{ mission.name }}
            </li>
          </ul>
          <ul id="participating">
            Participating:
            <li
              v-for="mission in user.participatingMissions"
              :key="mission.id"
            >
              {{ mission.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/modules/store';
import moment from 'moment';
import ChangePassword from './ChangePassword';

export default {
    components: {
        ChangePassword
    },
    computed: {
        auth() {
            return store.getters.loggedUser;
        },
        user() {
            return store.getters.selectedUser;
        }
    },
    async mounted() {
        this.loading = true;
        await store.dispatch('retrieveMissions', true);
        await store.dispatch('retrieveUsers', true);
        await store.dispatch('retrievePosts', true);
        await store.dispatch('retrieveLogs', true);
        await store.dispatch('retrieveGroups', true);
        await store.dispatch('selectUser', this.$route.params.id);
        this.loading = false;

    },
    methods: {
        getDate(date) {
            return moment(date).format('YYYY-MM-DD');
        },
    }
};
</script>
