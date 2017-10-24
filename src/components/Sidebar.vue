<template>
    <section class="sidebar">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo" @click.prevent="redirectToHome">

        <h1 class="title">Administration Network for Nanosat Association</h1>

        <nav>
            <router-link :to="{name: 'dashboard'}" class="grey">Dashboard</router-link>

            <ul>
                <li>
                    <router-link :to="{name: 'blog'}" class="blue">Internal blog</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'storage'}" class="green">Storage</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'forum'}" class="purple">Forum</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'events'}" class="yellow">Events</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'gantt'}" class="red">Gantt</router-link>
                </li>
            </ul>
        </nav>

        <div class="bottom">
            <a class="button badge" @click.prevent="showNotifications"
               :data-badge="(notifications) ? notifications : false">
                <i class="fa fa-bell" aria-hidden="true"></i>
            </a>

            <router-link to="/profile" class="button">
                <i class="fa fa-user" aria-hidden="true"></i>
            </router-link>

            <a class="button" @click.prevent="logout">
                <i class="fa fa-power-off" aria-hidden="true"></i>
            </a>
        </div>
    </section>
</template>

<script>
    import swal from 'sweetalert2';

    export default {
        data() {
            return {
                notifications: 5
            };
        },
        methods: {
            redirectToHome() {
                swal({
                    title: 'You clicked on the logo!',
                    type: 'success'
                });
            },
            showNotifications() {
                this.notifications = 0;
            },
            logout() {
                this.notifications += 1;
            }
        }
    };
</script>