<template>
  <modal
    name="moveFile"
    @before-open="beforeOpen"
    @before-close="beforeClose"
    height="auto"
    :scrollable="true"
  >
    <div class="content anna-modal">
      <h1>Move file</h1>
      <div class="folder_tree">
        <item
          class="item noborder"
          :model="this.baseFolder"
          v-on:selected="setSelected"
          v-bind:selected="this.selected"
        ></item>
      </div>
      <button type="submit" class="button success" @click.prevent="onSubmit">
        Submit
      </button>
    </div>
  </modal>
</template>

<script>
import store from "@/modules/store";
import driveApi from "@/modules/drive/drive_api";

let item = {
  template: `
        <div class='item_template'>
            <li>
                <a href="#">
                    <a @click.prevent="fetch(model.fileId)"> [{{ open ? '-' : '+'}}]</a>
                    <span @click.prevent="setSelected(model.fileId)" :style="{'font-weight': selected==model.fileId?'bold':'normal'}">{{ model.name }}</span>
                </a>

                <ul v-if="folder.children" v-show="open">
                    <item class="item"
                        v-for="(model2, index) in folder.children" :key="index"
                        :model="model2" v-on:selected="setSelectedChild" v-bind:selected="selected">
                    </item>
                </ul>
            </li>
        </div>`,
  name: "item",
  props: {
    model: Object,
    selected: Number
  },
  data() {
    return {
      open: false,
      folder: {}
    };
  },
  methods: {
    async fetch() {
      this.folder = await store.dispatch("getFoldersList", this.model.fileId);
      this.open = !this.open;
    },
    async setSelected(id) {
      this.$emit("selected", id);
    },
    async setSelectedChild(id) {
      this.$emit("selected", id);
    }
  }
};

export default {
  data() {
    return {
      baseFolder: {},
      selected: 1
    };
  },
  computed: {},
  components: {
    item
  },
  methods: {
    async beforeOpen(event) {
      this.baseFolder = await store.dispatch("getFoldersList", 1);
      this.selected = 1;
    },
    async setSelected(id) {
      this.selected = id;
    },
    beforeClose(event) {
      this.target = [];
      this.selected = 0;
    },
    async onSubmit() {
      const edit = {
        fileId: store.getters.selectedFile.fileId,
        data: {
          dirId: this.selected
        }
      };

      await driveApi.editFile(edit);
      await store.dispatch("retrieveFolder", store.getters.folder.fileId);
      this.$modal.hide("moveFile");
    }
  }
};
</script>
