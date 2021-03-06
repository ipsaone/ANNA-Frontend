<template>
    <section class="sidebar" :class="borderColor">
        <img
            src="../assets/images/logo.png"
            alt="IPSA ONE logo"
            class="logo"
            @click.prevent="redirectToHome"
        />

        <h1 class="title">
            Administration Network for Nanosat Association
        </h1>

        <nav>
            <ul>
                <li v-for="link in links" :key="link.id">
                    <router-link
                        v-if="link.name != 'admin' || showAdmin"
                        :to="{ name: link.name }"
                        :class="[link.color, link.class]"
                    >
                        {{ link.title }}
                    </router-link>
                </li>
            </ul>
        </nav>

        <div class="bottom">
            <transition name="fade">
                <div
                    v-if="tooltipVisible"
                    :class="{ redBorder: tooltipRedBorder }"
                    class="tooltip"
                >
                    {{ this.tooltipText }}
                </div>
            </transition>

            <div
                class="actions"
                @mouseover="mouseOverButton"
                @mouseleave="mouseLeaveButton"
            >
                <!--
                <a class="button badge" data-text="Notifications" @click.prevent="showNotifications"
                   :data-badge="(notifications) ? notifications : false"
                   style="cursor: not-allowed">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </a>
                -->
                <router-link
                    :to="{ name: 'profile', params: { id: logged.id } }"
                    class="button"
                    data-text="Profile"
                >
                    <i class="fa fa-user" aria-hidden="true" />
                </router-link>

                <a class="button" data-text="Logout" @click.prevent="logout">
                    <i class="fa fa-power-off" aria-hidden="true" />
                </a>
            </div>
        </div>
    </section>
</template>

<script>
import store from '@/modules/store';

export default {
    data() {
        return {
            notifications: 0,
            tooltipVisible: false,
            tooltipText: '',
            tooltipRedBorder: false,
            links: [
                {
                    title: 'Dashboard',
                    name: 'dashboard',
                    color: 'purple',
                    class: 'main'
                },
                { title: 'Blog', name: 'blog', color: 'blue' },
                { title: 'Drive', name: 'drive', color: 'green' },
                // {title: 'Forum', name: 'forum', color: 'purple'},
                { title: 'Events', name: 'events', color: 'yellow' },
                // {title: 'Logs', name: 'logs', color: 'red'},
                // {title: 'Gantt', name: 'gantt', color: 'red'},
                { title: 'Administration', name: 'admin', color: 'grey' }
            ]
        };
    },
    computed: {
        borderColor() {
            let curlink = this.links.filter(el => el.name === this.$route.name)[0];
            if (curlink) {
                return curlink.color;
            }
            return 'grey';
        },
        logged() {
            return store.getters.loggedUser;
        },
        showAdmin() {
            return store.getters.loggedUserIsRoot;
        }
    },
    methods: {
        redirectToHome() {
            this.$router.push({ name: 'root' });
        },
        showNotifications() {
            this.notifications = 0;
        },
        async logout() {
            await store.dispatch('logoutUser');

            this.$notify({ clean: true });
            store.commit('CLEAR_LOGIN');
            this.$router.push({ name: 'login' });
            this.$notify({
                type: 'success',
                title: 'You have been disconnected from ANNA.'
            });
        },
        mouseOverButton(event) {
            if (event.target.className.split(' ').includes('button')) {
                this.tooltipVisible = true;
                this.tooltipText = event.target.dataset.text;
                this.tooltipRedBorder = event.target.dataset.text === 'Logout';
            }
        },
        mouseLeaveButton() {
            this.tooltipVisible = false;
        }
    }
};
</script>
