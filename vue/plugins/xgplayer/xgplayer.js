//1.1.4-beta
import 'https://cdn.jsdelivr.net/npm/xgplayer@1/browser/index.js';
import 'https://cdn.jsdelivr.net/npm/xgplayer-mp4/browser/index.js';
import 'https://cdn.jsdelivr.net/npm/xgplayer-flv.js/browser/index.js';
export default {
  name: 'VueXgplayer',
  template:`
  <div :id='config.id' :style='rootStyle'>
  </div>`,
  data: function () {
    return {
      player: null
    }
  },
  props: {
    config: {
      type: Object,
      default () {
        return { id: 'mse', url: '' }
      }
    },
    rootStyle: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    init() {
      let self = this;
      if (this.config.url && this.config.url !== '') {
        this.player = new Player(this.config);
        this.$emit('player', this.player)
      }
    }
  },
  mounted() {
    this.init();
  },
  beforeUpdate() {
    this.init();
  },
  beforeDestroy() {
    this.player && typeof this.player.destroy === 'function' && this.player.destroy();
  }
}