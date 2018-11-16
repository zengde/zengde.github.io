export default {
  methods: {
    change(e) {
      this.$parent.addInputFile(e.target)
    }
  },
  template:`
  <div>
  <input
    type="file"
    :name="$parent.name"
    :id="$parent.inputId || $parent.name"
    :accept="$parent.accept"
    :capture="$parent.capture"
    @change="change"
    :webkitdirectory="$parent.directory && $parent.features.directory"
    :directory="$parent.directory && $parent.features.directory"
    :multiple="$parent.multiple && $parent.features.html5"
  />
  </div>
  `
}
