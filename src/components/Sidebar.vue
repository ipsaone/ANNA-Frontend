<template>
    <section class="sidebar" :class="borderColor">
        <img src="../assets/images/logo.png" alt="IPSA ONE logo" class="logo" @click.prevent="redirectToHome">

        <h1 class="title">Administration Network for Nanosatellite Association</h1>

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
                <div id="tooltip" v-if="tooltipVisible" :class="{redBorder: tooltipRedBorder}">
                    {{ this.tooltipText }}
                </div>
            </transition>
                 
            <div id="buttons" @mouseover="mouseOverButton" @mouseleave="mouseLeaveButton">
                <a class="button badge" data-text="Notifications" @click.prevent="showNotifications"
                   :data-badge="(notifications) ? notifications : false">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                </a>

                <router-link to="/profile" class="button" data-text="Profil">
                    <i class="fa fa-user" aria-hidden="true"></i>
                </router-link>

                <a class="button" data-text="Déconnexion" @click.prevent="logout">
                    <i class="fa fa-power-off" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    </section>
</template>

<script>
    import swal from 'sweetalert2';

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
                    {title: 'Drive', name: 'storage', color: 'green'},
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
            mouseOverButton(event) {
                if(event.target.className.split(' ').includes('button')) {
                    this.tooltipVisible = true;
                    this.tooltipText = event.target.dataset.text;
                    this.tooltipRedBorder = (event.target.dataset.text === 'Déconnexion');
                }
            },
            mouseLeaveButton() {
                this.tooltipVisible = false;
            }
        }
    };
</script>