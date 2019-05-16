<template>
    <div class="basic-layout blog">
        <section class="form-post content">
            <div class="editor">
                <h1 class="section-title color-blue">Edit post</h1>

                <input type="text" name="title" placeholder="Title" v-model="title">
                <markdown-editor v-model="markdown" :configs="configs"></markdown-editor>
            </div>

            <button type="submit" class="btn-green" @click.prevent="confirm">
                <i class="icon-circle-arrow-right icon-large" aria-hidden="true"></i> Submit
            </button>

            <button type="submit" class="btn-red" @click.prevent="cancel">
                <i class="icon-circle-arrow-right icon-large" aria-hidden="true"></i> Cancel
            </button>
        </section>

        <section class="actions">
            <h1 class="section-title">Options</h1>
            <ul>
                <li><label><input type="checkbox" v-model="isDraft"> Add to draft</label></li>
                <!-- li class="submit" :class="{active: canConfirm}" @click.prevent="confirm"><a><i class="fa fa-check" aria-hidden="true"></i> Confirm</a></li-->
            </ul>
        </section>
    </div>
</template>

<script>
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import store from '@/modules/store';

    export default {
        components: {
            markdownEditor
        },
        async mounted() {
            await store.dispatch('selectPost', this.$route.params.id);
            this.title = this.post.title;
            this.markdown = this.post.markdown.replace(/<br>/gi, '');
            this.isDraft = !this.post.published;

        },
        data() {
            return {
                title: '',
                markdown: '',
                isDraft: false,

                configs: {
                    placeholder: 'Description...',
                    spellChecker: false
                },
            };
        },
        computed: {
            canConfirm() {
                return this.title !== '' && this.markdown !== '';
            },
            post() {
                return store.getters.selectedPost;
            },
            loggedUserId() {
                return store.getters.loggedUserId;
            }
        },
        methods: {
            async confirm() {
                if (!this.canConfirm) {
                    this.$notify({
                        type: 'error',
                        title: 'Incomplete form',
                        text: 'A title and a content are needed to edit.',
                        duration: 2000
                    });
                }
                else {
                    let post = {
                        id: this.post.id,
                        content: {
                            authorId: this.loggedUserId,
                            markdown: this.markdown.replace(/\n\n/gi, '\n\n<br>'),
                            published: !this.isDraft,
                            title: this.title
                        }
                    };
                    // post.title = this.title;
                    // post.markdown = this.markdown.replace(/\n\n/gi, '\n\n<br>');
                    // post.isDraft = this.isDraft;
                    // delete post.content;

                    await store.dispatch('updatePost', post)
                        .then(() => this.$router.push({name: 'readPost', params:{id: post.id}}))
                        .catch(err => {
                            this.$notify({
                                type: 'error',
                                title: 'Uncaught error',
                                text: err.message,
                                duration: -1
                            });
                        });
                    await store.dispatch('selectPost', post.id);
                }
            },
            cancel() {
                if(this.title || this.markdown) {
                    let res = confirm('Save current article as draft ?');
                    if(res) {
                        const post = {
                            title: this.title,
                            markdown: this.markdown.replace(/\n\n/gi, '\n\n<br>'),
                            published: false,
                            authorId: store.getters.loggedUserId
                        };
                        store.dispatch('storePost', post)
                            .then(this.$router.push({name: 'blog'}))
                            .catch(err => {
                                this.$notify({
                                    type: 'error',
                                    title: 'Uncaught error',
                                    text: err.message,
                                    duration: -1
                                });
                            });
                    }
                }
                this.$router.push('/blog');
            }
        }
    };
</script>
