<template>
  <div class="quill-editor" :id="qid" :key="qid">
    <div v-once ref="editor">
      <div v-pre v-html="content"></div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import uuid from 'uuid/v4'

export default {
  props: {
    content: {
      type: String,
      required: true
    },

    allowed: {
      type: Object,
      required: false,
      default () {
        return {
          header: true,
          format: true,
          align: true
        }
      }
    }
  },

  data () {
    return {
      id: uuid(),
      editor: false,
      debounce: null,
      Quill: undefined
    }
  },

  computed: {
    qid () {
      return 'ql-' + this.id
    },

    loggedIn () {
      return this.$store.getters.authenticated
    },

    isEditing () {
      return this.$store.state.editing
    }
  },

  methods: {
    change () {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$emit('change', this.editor.root.innerHTML)
      }, 200)
    },

    attachEditor () {
      import('quill').then(Quill => {



        const Aligns = Quill.import('formats/align')
        Aligns.whitelist = ['right', 'left', 'center', 'justify']
        Quill.register(Aligns, true)

        const Icons = Quill.import('ui/icons')
        Icons['align']['left'] = '<svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line> <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line> <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line> </svg>'
        Icons['align'][''] = `<svg width="14px" height="14px" viewBox="0 0 12 12" style="margin:3px 0 0 2px">
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="Artboard" transform="translate(-6.000000, -6.000000)" fill="#FFFFFF">
        <path d="M8,6 L16,6 L16,6 C17.1045695,6 18,6.8954305 18,8 L18,16 L18,16 C18,17.1045695 17.1045695,18 16,18 L8,18 L8,18 C6.8954305,18 6,17.1045695 6,16 L6,8 L6,8 C6,6.8954305 6.8954305,6 8,6 Z M14.1352941,14.9920844 L13.7235294,14.0211082 L10.2176471,14.0211082 L9.80588235,15.0131926 C9.64509724,15.4001778 9.50784371,15.6613889 9.39411765,15.7968338 C9.28039159,15.9322786 9.09411894,16 8.83529412,16 C8.61568518,16 8.42156947,15.9278811 8.25294118,15.7836412 C8.08431288,15.6394012 8,15.4758145 8,15.292876 C8,15.1873346 8.01960765,15.0782767 8.05882353,14.9656992 C8.09803941,14.8531217 8.16274465,14.6965709 8.25294118,14.4960422 L10.4588235,9.47229551 C10.5215689,9.32805557 10.5970584,9.15479433 10.6852941,8.9525066 C10.7735299,8.75021887 10.8676466,8.58223462 10.9676471,8.44854881 C11.0676476,8.31486301 11.1990188,8.20668467 11.3617647,8.12401055 C11.5245106,8.04133644 11.725489,8 11.9647059,8 C12.2078444,8 12.4107835,8.04133644 12.5735294,8.12401055 C12.7362753,8.20668467 12.8676466,8.31310401 12.9676471,8.44327177 C13.0676476,8.57343953 13.1519604,8.71327982 13.2205882,8.86279683 C13.289216,9.01231385 13.3764701,9.21196005 13.4823529,9.46174142 L15.7352941,14.4538259 C15.9117656,14.833775 16,15.1099376 16,15.2823219 C16,15.4617423 15.9166675,15.6262086 15.75,15.7757256 C15.5833325,15.9252426 15.3823541,16 15.1470588,16 C15.0098032,16 14.8921574,15.9780125 14.7941176,15.9340369 C14.6960779,15.8900613 14.6137258,15.8302554 14.5470588,15.7546174 C14.4803918,15.6789794 14.4088239,15.5628856 14.3323529,15.4063325 C14.255882,15.2497793 14.1901964,15.111698 14.1352941,14.9920844 Z M10.6764706,12.8443272 L13.2529412,12.8443272 L11.9529412,9.65171504 L10.6764706,12.8443272 Z" id="Rectangle"></path>
      </g>
    </g>
  </svg>`
        Quill.register(Icons, true)

        const { allowed, content } = this.$props
        const palette = this.$store.state.website.theme.straps.default

        const colors = [
          '#FFFFFF',
          '#000000',
          '#D83733',
          '#E87A31',
          '#FFCE43',
          '#56A984',
          '#17999E',
          '#2464AE',
          '#9463BF',
          '#5E616A',
          '#95979E',
          palette.text,
          palette.titleText,
          palette.linkText,
          palette.uiPrimary.bgColor,
          palette.uiPrimary.text,
          palette.uiSecondary.bgColor,
          palette.uiSecondary.text,
          palette.bgColor,
          palette.accentColor
        ]

        this.$refs.editor.innerHTML = content

        Vue.nextTick(() => {
          const toolbar = []
          toolbar.push(['bold', 'italic', 'underline'])
          if (allowed.header) toolbar.push([{ 'header': 1 }, { 'header': 2 }])
          if (allowed.format) toolbar.push([{ 'list': 'ordered' }, { 'list': 'bullet' }, 'blockquote', 'link'])
          toolbar.push([{ 'size': ['small', false, 'large', 'huge'] }])
          toolbar.push([{ 'color': colors }, { 'background': colors }])
          if (allowed.align) toolbar.push([{ 'align': [ '', 'left', 'right', 'center', 'justify' ] }])
          toolbar.push(['clean'])

          this.editor = new Quill(this.$refs.editor, {
            theme: 'bubble',
            modules: {
              toolbar
            }
          })
          this.editor.on('text-change', this.change.bind(this))
          this.editor.enable(this.isEditing)
        })
      })
    }
  },

  mounted () {
    this.attachEditor()
  },

  updated () {
    this.attachEditor()
  },

  watch: {
    isEditing (value) {
      if (!process.browser) return

      this.editor = null
      if (this.loggedIn) this.attachEditor()
    }
  }
}
</script>

<style lang="sass">
.ql-align-left
  text-align: left
</style>
