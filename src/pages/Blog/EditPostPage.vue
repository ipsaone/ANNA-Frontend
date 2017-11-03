<template>
    <section class="form-post">
        <div class="editor">
            <h1 class="section-title">Edit post</h1>

            <input type="text" name="title" placeholder="Title" v-model="title">
            <markdown-editor v-model="markdown"></markdown-editor>
        </div>

        <div class="options">
            <h1 class="section-title">Options</h1>
            <ul>
                <li><label><input type="checkbox" v-model="isDraft"> Add to draft</label></li>
                <li class="submit" :class="{active: canConfirm}" @click.prevent="confirm"><i class="fa fa-check" aria-hidden="true"></i>Confirm</li>
            </ul>
        </div>
    </section>
</template>

<script>
    import markdownEditor from 'vue-simplemde/src/markdown-editor';
    import store from '@/store';

    export default {
        components: {
            markdownEditor
        },
        mounted() {
            store.dispatch('selectPost', this.$route.params.id)
                .then(_ => {
                    this.title = this.post.title;
                    this.markdown = this.post.markdown;
                    this.isDraft = !this.post.published;
                });
        },
        data() {
            return {
                title: '',
                markdown: '',
                isDraft: false
            };
        },
        computed: {
            canConfirm() {
                return this.title !== '' && this.markdown !== '';
            },
            post() {
                return store.getters.selectedPost;
            }
        },
        methods: {
            confirm() {
                if (!this.canConfirm) {
                    this.$notify({
                        type: 'error',
                        title: 'Incomplete form',
                        text: 'A title and a content are needed to edit.',
                        duration: 2000
                    });
                }
                else {
                    let post = this.post;

                    post.title = this.title;
                    post.markdown = this.markdown;
                    post.isDraft = this.isDraft;
                    delete post.content;

                    store.dispatch('updatePost', post)
                        .then(this.$router.push({name: 'readPost', params:{id: post.id}}))
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
        }
    };
</script>