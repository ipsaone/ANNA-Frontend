<template>
    <section class="new-post">
        <div class="editor">
            <h1 class="section-title">New post</h1>

            <input type="text" name="title" placeholder="Title" v-model="title">
            <markdown-editor v-model="markdown"></markdown-editor>
        </div>

        <div class="options">
            <h1 class="section-title">Options</h1>
            <ul>
                <li><label><input type="checkbox" v-model="isDraft"> Add to draft</label></li>
                <li class="submit" :class="{active: canSubmit}" @click.prevent="submit"><i class="fa fa-check" aria-hidden="true"></i> Submit</li>
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
        data() {
            return {
                title: '',
                markdown: '',
                isDraft: false
            };
        },
        computed: {
            canSubmit() {
                return this.title !== '' && this.markdown !== '';
            }
        },
        methods: {
            submit() {
                if (!this.canSubmit) {
                    this.$notify({
                        type: 'error',
                        title: 'Incomplete form',
                        text: 'A title and a content are needed to submit.',
                        duration: 2000
                    });
                }
                else {
                    const post = {
                        title: this.title,
                        markdown: this.markdown,
                        published: !this.isDraft,
                        authorId: store.getters.loggedUserId
                    };
                    store.dispatch('storePost', post)
                        .then(_ => {
                            this.$router.push({name: 'blog'});
                        });
                }
            }
        }
    };
</script>