<template>
  <div class="strap-team-roster-strip">
    <editable-team-roster-list
      tag="div"
      listKey="rosterList"
      :list="strap_state.rosterList"
      :onCreate="$strap_onListCreate"
      :onChange="$strap_onListChange"
      :onDelete="$strap_onListDelete"
      :style="tileStyle"
      :customColor="tileTextColor"
    />
  </div>
</template>

<script>
import mixinStrap from '@/mixins/strap'
import EditableTeamRosterList from '@/components/editable/EditableTeamRosterList'
import EditableTeamTile from '@/components/editable/EditableTeamTile'
import defaultTeamRosterTile from '@/store/defaults/components/teamRosterTile'
import defaultTextShadow from '@/store/defaults/components/textShadow'


export default {
  name: 'StrapTeamRosterStrip',

  components: {
    EditableTeamRosterList
  },

  mixins: [mixinStrap],

  computed: {
    tileTextColor () {
      const { useCustomTextColor, customTextColor } = this.strap_state
      return useCustomTextColor ? customTextColor : ''
    },

    tileStyle () {
      const { useTextShadow, textShadow } = this.strap_state
      const { x, y, blur, color } = textShadow

      if (useTextShadow) {
        return {
          textShadow: useTextShadow && `${x}px ${y}px ${blur}px ${color}`
        }
      } else {
        return {}
      }
    },
  },

  initialState (strap, state) {
    return {
      rosterList: [defaultTeamRosterTile()],
      useTextShadow: false,
      textShadow: defaultTextShadow(),
      useCustomTextColor: false,
      customTextColor: '#ffffff'
    }
  },

  schema () {
    return [
      {
        title: 'Tile',
        tabs: [
          {
            title: 'Text',
            fields: [
              {
                key: 'state.useTextShadow',
                type: 'checkbox',
                label: 'Text Shadow',
                text: 'Apply a drop shadow to the text',
                default: false,
                onValue: true,
                offValue: false
              },
              {
                key: 'state.textShadow.x',
                type: 'number',
                label: 'Text Shadow Position (x, y, blur)',
                default: 0,
                hint: 'Left/right position of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.y',
                type: 'number',
                default: 0,
                hint: 'Top/bottom position of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.blur',
                type: 'number',
                default: 0,
                hint: 'The softness of the shadow.',
                minValue: 0,
                maxValue: 100,
                step: 1
              },
              {
                key: 'state.textShadow.color',
                type: 'color',
                label: 'Text Shadow Color',
                default: '#000000'
              },
              {
                type: 'hr'
              }
            ]
          }
        ]
      }
    ]
  }
}
</script>

<style scoped lang="sass">
.strap-team-roster-strip
</style>
