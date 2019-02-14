<template>
    <modal name="managePermissions" height="auto" :scrollable="true">
        <div class="content anna-modal">
            <div class="tableau-permission">
                <div class="case" id="owner">
                    owner
                </div>
                <div class="case" id="group">
                    group
                </div>
                <div class="case" id="all">
                    all
                </div>
                <div class="case" id="read">
                    read
                </div>
                <div class="case" id="write">
                    write
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
import store from '@/modules/store';
import driveApi from '@/modules/drive/drive_api';

export default {
};
</script>
