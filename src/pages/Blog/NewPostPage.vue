<template>
    <div class="blog basic-layout">
        <section class="form-post">
            <div class="editor">
                <h1 class="section-title">New post</h1>

                <input type="text" name="title" placeholder="Title" v-model="title">
                <markdown-editor v-model="markdown"></markdown-editor>
            </div>

            <button type="submit" class="btn" :class="{active: canSubmit}" @click.prevent="submit">
                <i class="icon-circle-arrow-right icon-large" aria-hidden="true"></i> Submit
            </button>

            <button type="submit" class="btn" @click.prevent="cancel">
                <i class="icon-circle-arrow-right icon-large" aria-hidden="true"></i> Cancel
            </button>
        </section>

        <section class="actions">
            <h1 class="section-title">Options</h1>
            <ul>
                <li>
                   <label><input type="checkbox" v-model="isDraft"> Add to draft</label>
                </li>
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
                    store.dispatch('storePost', this.title, this.markdown, !this.isDraft, store.getters.loggedUserId)
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
            },

            cancel() {
                if(this.title || this.markdown) {
                    let res = confirm('Save current article as draft ?');
                    if(res) {
                        store.dispatch('storePost', this.title, this.markdown, false, store.getters.loggedUserId)
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
