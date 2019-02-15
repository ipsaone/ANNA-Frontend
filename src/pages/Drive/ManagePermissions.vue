<template>
    <modal name="managePermissions" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <div class="big-wrapper">
                <div class="tableau-permission">
                    <div class="case" id="diagonale"></div>
                    <div class="case" id="owner">
                        owner
                    </div>
                    <div class="case" id="group">
                        group
                    </div>
                    <div class="case" id="others">
                        others
                    </div>
                    <div class="case" id="read">
                        read
                    </div>
                    <div class="case" id="write">
                        write
                    </div>
                    <div v-for="number in cases" class="case cochable">
                        <div class="checkbox-container">
                            <input type="checkbox" :name="number" :id="cases.indexOf(number)">
                            <label class="checkbox" :for="cases.indexOf(number)"></label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
    import store from '@/modules/store';
    import driveApi from '@/modules/drive/drive_api';

    export default {
        computed : {
            cases() {
                return Array(1, 2, 3, 4, 5, 6);
            }
        }
    };
</script>
