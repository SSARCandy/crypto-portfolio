<template>
  <span>{{ $t('update_time') }}: {{ lastUpdate }}</span>
</template>

<script>
import dayjs from "dayjs";
dayjs().format();

export default {
  name: "Timer",
  props: {
    time: Number,
  },
  data() {
    return {
      now: Date.now(),
    };
  },
  computed: {
    lastUpdate() {
      const delta = (dayjs(this.now) - dayjs(this.time)) / 1000;
      return `${delta.toFixed(0)} ${this.$i18n.t('sec_ago')}`;
    },
  },
  created: function () {
    setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },
};
</script>