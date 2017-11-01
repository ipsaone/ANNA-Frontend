<template>
    <section class="sidebar" :class="borderColor">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo" @click.prevent="redirectToHome">

        <h1 class="title">Administration Network for Nanosat Association</h1>

        <nav>
            <ul>
                <li v-for="link in links" :key="link.id">
                    <router-link :to="{name: link.name}"  :class="[link.color, link.class]">
                        {{ link.title }}
                    </router-link>
                </li>
            </ul>
        </nav>


        <div class="bottom">      
            <transition name="fade">
                <div v-if="tooltipVisible" :class="{redBorder: tooltipRedBorder}" class="tooltip">
                    {{ this.tooltipText }}
                </div>
            </transition>
                 
            <div class="actions" @mouseover="mouseOverButton" @mouseleave="mouseLeaveButton">
                <a class="button badge" data-text="Notifications" @click.prevent="showNotifications"
                   :data-badge="(notifications) ? notifications : false">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </a>

                <router-link to="/profile" class="button" data-text="Profile">
                    <i class="fa fa-user" aria-hidden="true"></i>
                </router-link>

                <a class="button" data-text="Logout" @click.prevent="logout">
                    <i class="fa fa-power-off" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    </section>
</template>

<script>
    import swal from 'sweetalert2';
    import store from '@/store';

    export default {
        data() {
            return {
                notifications: 0,
                tooltipVisible: false,
                tooltipText: 'blablabla',
                tooltipRedBorder: false,
                links: [
                    {title: 'Dashboard', name: 'dashboard', color: 'grey', class: 'main'},
                    {title: 'Blog', name: 'blog', color: 'blue'},
                    {title: 'Drive', name: 'drive', color: 'green'},
                    {title: 'Forum', name: 'forum', color: 'purple'},
                    {title: 'Events', name: 'events', color: 'yellow'},
                    {title: 'Gantt', name: 'gantt', color: 'red'}
                ]
            };
            
        },
        computed: {
            borderColor() {
                let curlink = this.links.filter(el => el.name === this.$route.name)[0];
                if(curlink) {return curlink.color;}
                return 'grey';
            }
        },
        methods: {
            redirectToHome() {
                this.$router.push({name: 'root'});
            },
            showNotifications() {
                this.notifications = 0;
            },
            logout() {
                store.dispatch('logoutUser')
                    .then(_ => {
                        this.$notify({clean: true});
                        this.$router.push({name: 'login'});
                        this.$notify({
                            type: 'success',
                            title: 'You are disconnected from ANNA.'
                        });
                    });
            },
            mouseOverButton(event) {
                if(event.target.className.split(' ').includes('button')) {
                    this.tooltipVisible = true;
                    this.tooltipText = event.target.dataset.text;
                    this.tooltipRedBorder = (event.target.dataset.text === 'Logout');
                }
            },
            mouseLeaveButton() {
                this.tooltipVisible = false;
            }
        }
    };
</script>