<template>
  <editable-list
    tag="div"
    label="Roster"
    class="strap-roster-tiles"
    v-if="$store.state.editing || list.length > 0"
    @create="onCreate(listKey, defaultRosterTile)">
    <div class="columns is-multiline">
      <editable-team-tile
        v-for="(item, i) in list"
        :key="i"
        :keyName="i"
        :value="item"
        @change="e => { onChange(listKey, e) }"
        @delete="onDelete(listKey, i)"
      />
    </div>
  </editable-list>
</template>

<script>
import defaultTeamRosterTile from '@/store/defaults/components/teamRosterTile'
import defaultTextShadow from '@/store/defaults/components/textShadow'
import mixinEditableList from '@/mixins/editable-list'
import EditableTeamTile from '@/components/editable/EditableTeamTile'

export default {
  name: 'EditableTeamRosterList',

  mixins: [mixinEditableList],

  components: {
    EditableTeamTile
  },

  computed: {
    defaultRosterTile () {
      return defaultTeamRosterTile
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
