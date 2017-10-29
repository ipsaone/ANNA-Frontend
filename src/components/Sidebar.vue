<template>
    <section class="sidebar" v-bind:class="borderColor">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo" @click.prevent="redirectToHome">

        <h1 class="title">Administration Network for Nanosat Association</h1>

        <nav>
            <ul>
                <li @click="updateBorderColor('grey')">
                    <router-link :to="{name: 'dashboard'}" class="grey main">Dashboard</router-link>
                </li>
                <li @click="updateBorderColor('blue')">
                    <router-link  :to="{name: 'blog'}" class="blue">Blog</router-link>
                </li>
                <li @click="updateBorderColor('green')">
                    <router-link :to="{name: 'storage'}" class="green">Drive</router-link>
                </li>
                <li @click="updateBorderColor('purple')" >
                    <router-link :to="{name: 'forum'}" class="purple">Forum</router-link>
                </li>
                <li @click="updateBorderColor('yellow')">
                    <router-link :to="{name: 'events'}" class="yellow">Events</router-link>
                </li>
                <li @click="updateBorderColor('red')">
                    <router-link :to="{name: 'gantt'}" class="red">Gantt</router-link>
                </li>
            </ul>
        </nav>

        <div class="bottom">
            <a class="button badge" @click.prevent="showNotifications"
               :data-badge="(notifications) ? notifications : ''">
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
                notifications: 5,
                borderColor: ''
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
            },
            updateBorderColor(color) {
                console.log('called with '+color);
                this.borderColor = color;
            }
        }
    };
</script>