<template>
    <div class="basic-layout">
        <section class="blog form-post content">
            <div class="editor">
                <h1 class="section-title">Edit post</h1>

                <input type="text" name="title" placeholder="Title" v-model="title">
                <markdown-editor v-model="markdown" :configs="configs"></markdown-editor>
            </div>
        </section>

        <section class="actions">
            <h1 class="section-title">Options</h1>
            <ul>
                <li><label><input type="checkbox" v-model="isDraft"> Add to draft</label></li>
                <li class="submit" :class="{active: canConfirm}" @click.prevent="confirm"><a><i class="fa fa-check" aria-hidden="true"></i> Confirm</a></li>
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
        mounted() {
            store.dispatch('selectPost', this.$route.params.id)
                .then(_ => {
                    this.title = this.post.title;
                    console.log('original : ', this.post.markdown);
                    this.markdown = this.post.markdown.replace(/<br>/gi, '');
                    this.isDraft = !this.post.published;
                });
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
                    post.markdown = this.markdown.replace(/\n\n/gi, '\n\n<br>');
                    console.log('saved as', post.markdown.replace(/\n\n/gi, '\n\n<br>'));
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
