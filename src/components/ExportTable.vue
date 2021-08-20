<template>
  <button v-on:click="download">Export As CSV</button>
</template>

<script>
import { download_table_as_csv } from "../common/utils";

export default {
  name: "ExportTable",
  props: {
    table_id: String,
  },

  computed: {},
  methods: {
    download() {
      download_table_as_csv(this.table_id);
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
