<template>
    <modal name="fileAuth" height="auto" :scrollable="true" @before-open="beforeOpen">
        <div class="content anna-modal">
            <h1>File authorization</h1>
            <form>
                <p v-if="this.file.id">Owner: {{this.file.owner.username}} ( {{this.file.owner.id}})</p>
                <p v-if="this.file.id">Group: ({{this.file.groupId}})</p>

                <table>
                    <tr>
                        <th></th>
                        <th>Owner</th>
                        <th>Group</th>
                        <th>Other</th>
                    </tr>
                    <tr>
                        <td>Read</td>
                        <td><input type="checkbox" v-model="readOwner" :disabled="disableReadOwner"></td>
                        <td><input type="checkbox" v-model="readGroup" :disabled="disableReadGroup"></td>
                        <td><input type="checkbox" v-model="readOther" :disabled="disableReadOther"></td>
                    </tr>
                    <tr>
                        <td>Write</td>
                        <td><input type="checkbox" v-model="writeOwner" :disabled="disableWriteOwner"></td>
                        <td><input type="checkbox" v-model="writeGroup" :disabled="disableWriteGroup"></td>
                        <td><input type="checkbox" v-model="writeOther" :disabled="disableWriteOther"></td>
                    </tr>
                </table>
                
                <br>

                <button type="submit" class="button success" @click.prevent="onSubmit">Submit</button>
            </form>
        </div>
    </modal>
</template>


<script>
    import store from '@/modules/store';

    export default {
        data() {
            return {
                file: {},
                readOwner: false,
                readGroup: false,
                readOther: false,
                writeOwner: false,
                writeGroup: false,
                writeOther: false,
                disableReadOwner: true,
                disableReadGroup: false,
                disableReadOther: false,
                disableWriteOwner: false,
                disableWriteGroup: false,
                disableWriteOther: false
            };
        },
        methods: {
            onSubmit() {
                console.log('Hello world!');
            },

            beforeOpen(data) {
                this.file = data.params;
            }
        }
    };
</script>