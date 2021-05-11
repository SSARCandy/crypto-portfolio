<template>
  <div class="modal">
    <div class="modal-content">
      <div class="setting-list">
        <label class="switch">
          <input
            type="checkbox"
            :checked="is_dark_mode"
            v-on:click="click('is_dark_mode')"
          />
          <span class="slider round"></span>
        </label>
        <span>Dark mode</span>
      </div>
      <div class="setting-list">
        <label class="switch">
          <input
            type="checkbox"
            :checked="is_hide_small_balance"
            v-on:click="click('is_hide_small_balance')"
          />
          <span class="slider round"></span>
        </label>
        <span>Hide small balance</span>
      </div>
      <div class="setting-list">
        <label class="switch">
          <input
            type="checkbox"
            :checked="is_perfer_return"
            v-on:click="click('is_perfer_return')"
          />
          <span class="slider round"></span>
        </label>
        <span>Show Return(%) in small device</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Setting",
  components: {},
  props: {
    is_hide_small_balance: Boolean,
    is_dark_mode: Boolean,
    is_perfer_return: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    click(v) {
      this.$emit(`update:${v}`, !this[v]);
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: var(--color-bg);
  margin: auto;
  padding: 0 15px;
  border: 1px solid var(--color-border);
  width: 80%;
  max-width: 500px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 14px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: ease 0.1s;
  transition: ease 0.1s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 0px;
  bottom: -3px;
  background-color: var(--color-border);
  -webkit-transition: ease 0.1s;
  transition: ease 0.1s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.setting-list {
  margin: 20px 0;
}

.setting-list > span {
  margin-left: 15px;
  font-size: 14px;
}
</style>
