<template>
  <div
    class="modal"
    v-if="is_setting_mode"
    v-on:click="click('is_setting_mode')"
  >
    <div class="modal-content" v-on:click="(e) => { e.stopImmediatePropagation(); }">
      <div v-for="(setting, index) in settingSwitchs" :key="index" class="setting-list">
        <label class="switch">
          <input
            type="checkbox"
            :checked="getSettingValue(setting.key)"
            v-on:click="click(setting.key)"
          />
          <span class="slider round"></span>
        </label>
        <span>{{ $t(setting.label) }}</span>
      </div>
      
      <hr />

      <div v-for="(optionGroup, key) in settingOptions" :key="key" class="setting-list">
        <div>{{ $t(key) }}:</div>
        <button 
          v-for="option in optionGroup"
          v-on:click="change_keyvalue(key, option.value)"
          v-bind:key="option.value"
          v-bind:class="{ 'button-active': getSettingValue(key) === option.value }"
        >
          {{ option.label }}
        </button>
      </div>

      <div id="app-version">app version: {{ version }}</div>
    </div>
  </div>
</template>

<script>
import { version } from "../../package.json";
export default {
  name: "Setting",
  components: {},
  props: {
    is_setting_mode: Boolean,
    is_hide_small_balance: Boolean,
    is_dark_mode: Boolean,
    is_perfer_return: Boolean,
    is_merge_wallets: Boolean,
    is_show_nav_title: Boolean,
    language: String,
    timeframe: String,
    asset_type: String,
  },
  data() {
    return {
      version,
      settingSwitchs: [{
        key: "is_dark_mode",
        value: this.is_dark_mode,
        label: "dark_mode",
      }, {
        key: "is_hide_small_balance",
        value: this.is_hide_small_balance,
        label: "hide_small_balance",
      }, {
        key: "is_perfer_return",
        value: this.is_perfer_return,
        label: "show_return_in_small_device",
      }, {
        key: "is_merge_wallets",
        value: this.is_merge_wallets,
        label: "is_merge_wallets",
      }, {
        key: "is_show_nav_title",
        value: this.is_show_nav_title,
        label: "is_show_nav_title",
      }],
      settingOptions: {
        language: [
          { value: 'en', label: 'English' },
          { value: 'zh', label: 'Chinese' },
          { value: 'jp', label: 'Japanese' }
        ],
        timeframe: [
          { value: '30m', label: '30m' },
          { value: '4h', label: '4h' },
          { value: '1d', label: '1d' },
          { value: '1w', label: '1w' }
        ],
        asset_type: [
          { value: 'all', label: 'all' },
          { value: 'crypto', label: 'crypto' },
          { value: 'stocks', label: 'stocks' }
        ],
      },
    };
  },
  methods: {
    getSettingValue(key) {
      return this[key];
    },
    click(v) {
      this.$emit(`update:${v}`, !this[v]);
    },
    change_keyvalue(k, v) {
      this.$emit(`update:${k}`, v);
    },
  },
};
</script>

<style scoped>

#app-version {
  font-size: 12px;
  color: gray;
  text-align: right;
  padding-bottom: 8px;
}
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

.button-active {
  background: rgba(170, 170, 170, 0.603);
}
</style>
