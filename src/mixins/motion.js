import dom from '@/helpers/dom.js'
import loop from '@/mixins/loop.js'
import transform from '@/mixins/transform.js'

const HTMLElement = process.browser ? window.HTMLElement : Object

export default {
  mixins: [ loop, transform ],

  props: {
    motionEl: {
      type: [ HTMLElement, String, Boolean ],
      default: false
    },

    motionEnabled: {
      type: [ Boolean, undefined ],
      default: undefined
    },

    motionDecay: {
      type: [ Object, Boolean ],
      default: false
    },

    motionTargets: {
      type: [ Array, Boolean ],
      default: false
    },

    motionGravity: {
      type: [ Object, Boolean ],
      default: false
    },

    motionRestrict: {
      type: [ Object, Boolean ],
      default: false
    },

    motionVelocity: {
      type: [ Object, Boolean ],
      default: false
    },

    motionBounciness: {
      type: [ Object, Boolean ],
      default: false
    },

    motionTargetForce: {
      type: [ Number, Boolean ],
      default: false
    },

    motionSeekTargets: {
      type: [ Boolean, undefined ],
      default: undefined
    },

    motionStickToTargets: {
      type: [ Boolean, undefined ],
      default: undefined
    },

    motionConstrainTo: {
      type: [ HTMLElement, String, Boolean ],
      default: false
    }
  },

  data () {
    const mixin = {
      el: false,
      decay: { x: 0, y: 0, z: 0 },
      enabled: true,
      targets: [],
      gravity: { x: 0, y: 0, z: 0 },
      restrict: { x: false, y: false, z: false },
      velocity: { x: 0, y: 0, z: 0 },
      following: false,
      bounciness: { x: 1, y: 1, z: 1 },
      targetForce: 0.02,
      seekTargets: true,
      constrainTo: false,
      currentTarget: false,
      stickToTargets: true,
      stopFollowingCb: false,
      lastTranslation: { x: 0, y: 0, z: 0 },

      // Methods

      startFollowing: (pos) => {
        const $motion = this.mixinMotion
        const $transform = this.mixinTransform

        $motion.velocity.x = 0
        $motion.velocity.y = 0
        $motion.velocity.z = 0

        $motion.following = {
          self: { x: $transform.translation.x, y: $transform.translation.y },
          target: { x: pos.x, y: pos.y },
          position: { x: 0, y: 0 },
        }
      },

      follow: (pos) => {
        const $motion = this.mixinMotion

        $motion.following.position = {
          x: pos.x - $motion.following.target.x,
          y: pos.y - $motion.following.target.y
        }
      },

      stopFollowing: (cb) => {
        this.mixinMotion.following = false
        if (cb) this.mixinMotion.stopFollowingCb = cb
      },

      getEl: () => {
        let { el } = this.mixinMotion
        const { motionEl: mEl } = this

        if (!el) {
          el = this.$el
        }

        if (mEl) {
          if (mEl instanceof HTMLElement) el = mEl
          if (typeof mEl === 'string') el = this.$parent.$refs[mEl]
        }

        return el
      },

      findClosest: (where) => {
        let { x, y } = where

        x = x || 0
        y = y || 0

        let found = false
        let closest = Number.MAX_SAFE_INTEGER

        this.mixinMotion.targets.forEach((target) => {
          if (typeof target === 'string') target = this.$parent.$refs[target]

          if (!target) return

          if (target instanceof HTMLElement) {
            const posx = this.mixinTransform.translation.x
            const posy = this.mixinTransform.translation.y
            const rect = dom.getRoundedClientRect(this.mixinMotion.getEl())
            const trect = dom.getRoundedClientRect(target)

            target = {
              x: (trect.x - rect.x) + (trect.width / 2) + posx - (rect.width / 2),
              y: (trect.y - rect.y) + (trect.height / 2) + posy - (rect.height / 2),
              el: target,
              width: trect.width,
              height: trect.height
            }
          }

          if (target.radius) {
            const dx = (target.x !== undefined) ? (target.x - x) : 0
            const dy = (target.y !== undefined) ? (target.y - y) : 0
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < closest) {
              found = target
              closest = dist
            }
          } else if (target.width && target.height) {
            const dx = x - (target.x + (target.width / 2))
            const dy = y - (target.y + (target.height / 2))
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < closest) {
              found = target
              closest = dist
            }
          }
        })

        return found
      },

      findTarget: (where, { rect, posx, posy } = {}) => {
        let top, left, right, bottom

        posx = posx || this.mixinTransform.translation.x
        posy = posy || this.mixinTransform.translation.y

        if (where.radius) {
          top = posy + where.radius
          left = posx - where.radius
          right = posx + where.radius
          bottom = posy - where.radius
        } else {
          top = posy + (where.height / 2)
          left = posx - (where.width / 2)
          right = posx + (where.width / 2)
          bottom = posy - (where.height / 2)
        }

        let found = false

        this.mixinMotion.targets.forEach((target) => {
          if (typeof target === 'string') target = this.$parent.$refs[target]

          if (!target) return

          if (target instanceof HTMLElement) {
            rect = rect || dom.getRoundedClientRect(this.mixinMotion.getEl())
            const trect = dom.getRoundedClientRect(target)

            target = {
              x: (trect.x - rect.x) + (trect.width / 2) + posx - (rect.width / 2),
              y: (trect.y - rect.y) + (trect.height / 2) + posy - (rect.height / 2),
              el: target,
              width: trect.width,
              height: trect.height
            }
          }

          if (
            target.radius &&
            ((typeof target.x !== 'number') || (right >= target.x - target.radius)) &&
            ((typeof target.x !== 'number') || (left <= target.x + target.radius)) &&
            ((typeof target.y !== 'number') || (bottom >= target.y - target.radius)) &&
            ((typeof target.y !== 'number') || (top <= target.y + target.radius))) {
            found = target
          } else if (
            target.width &&
            target.height &&
            right >= target.x - (target.width / 2) &&
            left <= target.x + (target.width / 2) &&
            bottom >= target.y - (target.height / 2) &&
            top <= target.y + (target.height / 2)) {
            found = target
          }
        })

        return found
      }
    }

    return {
      mixinMotion: mixin,
      mixinLoop: {
        _update: () => {
          const $motion = this.mixinMotion
          const $transform = this.mixinTransform

          let {
            enabled,
            restrict,
            following,
            bounciness,
            constrainTo
          } = $motion

          const {
            motionEnabled: mEnabled,
            motionRestrict: mRestrict,
            motionBounciness: mBounciness,
            motionConstrainTo: mConstrainTo
          } = this

          // Enabled setup

          if (mEnabled !== undefined) enabled = mEnabled

          // Element setup

          const el = $motion.getEl()

          // Movement restriction setup

          if (mRestrict) {
            restrict = Object.assign(restrict, mRestrict)
          }

          // Bounciness setup

          if (mBounciness) {
            bounciness = Object.assign(bounciness, mBounciness)
          }

          // Constraints setup

          if (mConstrainTo) {
            if (mConstrainTo instanceof HTMLElement) constrainTo = mConstrainTo
            else if (typeof mConstrainTo === 'string') constrainTo = this.$parent.$refs[mConstrainTo]
          }

          // Velocity & Gravity

          let { x: posx, y: posy, z: posz } = $transform.translation

          let vel = $motion.velocity
          const mVel = this.motionVelocity

          if (mVel) vel = Object.assign(vel, mVel)
          let { x: velx, y: vely, z: velz } = vel

          if (enabled && !following) {
            // Gravity

            let gravity = $motion.gravity
            const mGravity = this.motionGravity

            if (mGravity) gravity = Object.assign(gravity, mGravity)

            velx += gravity.x
            vely += gravity.y
            velz += gravity.z

            // Attraction targets

            let targets = $motion.targets
            const mTargets = this.motionTargets

            if (mTargets) targets = mTargets

            let targetForce = $motion.targetForce
            const mTargetForce = this.motionTargetForce

            if (mTargetForce) targetForce = mTargetForce

            if (el && targets.length) {
              const rect = dom.getRoundedClientRect(el)

              if ($motion.seekTargets) {
                const target = $motion.findTarget(rect, { rect, posx, posy })
                if (target || !$motion.stickToTargets) $motion.currentTarget = target
              }

              if ($motion.currentTarget) {
                const target = $motion.currentTarget

                const dx = (typeof target.x !== 'number') ? 0 : posx - target.x
                const dy = (typeof target.y !== 'number') ? 0 : posy - target.y

                velx += dx * -targetForce
                vely += dy * -targetForce
              }
            }

            // Add velocity to position

            posx += velx
            posy += vely
            posz += velz
          }

          // Follow

          if (following) {
            const { self } = $motion.following
            let { x, y, z } = $motion.following.position

            if (x) {
              posx = self.x + x
              velx = posx - $motion.lastTranslation.x
            }

            if (y) {
              posy = self.y + y
              vely = posy - $motion.lastTranslation.y
            }

            if (z) {
              posz = self.z + z
              velz = posz - $motion.lastTranslation.z
            }
          }

          // Constraints

          if (el && constrainTo) {
            const bounds = dom.getRoundedClientRect(constrainTo)

            const box = dom.getRoundedClientRect(el)
            box.x += velx
            box.y += vely

            if (bounds) {
              if (box.x + box.width >= bounds.x + bounds.width) {
                if (!following) velx *= -bounciness.x
                posx = bounds.x + bounds.width - box.x + posx - box.width
              }
              if (box.x <= bounds.x) {
                if (!following) velx *= -bounciness.x
                posx = bounds.left - box.x + posx
              }
              if (box.y + box.height >= bounds.y + bounds.height) {
                if (!following) vely *= -bounciness.y
                posy = bounds.y + bounds.height - box.y + posy - box.height
              }
              if (box.y <= bounds.y) {
                if (!following) vely *= -bounciness.y
                posy = bounds.top - box.y + posy
              }
            }
          }

          // Following velocity second pass

          if (following) {
            velx = posx - $motion.lastTranslation.x
            vely = posy - $motion.lastTranslation.y
            velz = posz - $motion.lastTranslation.z
          }

          // Update values

          if (!restrict.x) $transform.translation.x = posx
          if (!restrict.y) $transform.translation.y = posy
          if (!restrict.z) $transform.translation.z = posz

          if (!restrict.x) $motion.velocity.x = velx
          if (!restrict.y) $motion.velocity.y = vely
          if (!restrict.z) $motion.velocity.z = velz

          // Events

          if ($motion.stopFollowingCb) {
            $motion.stopFollowingCb()
            $motion.stopFollowingCb = false
          }

          if (posx === $motion.lastTranslation.x && posy === $motion.lastTranslation.y) {
            this.$emit('motion-stopped')
          }

          // Velocity Decay

          if (enabled && !following) {
            let { decay } = $motion
            const { motionDecay: mDecay } = this

            if (mDecay) {
              decay = Object.assign(decay, mDecay)
            }

            $motion.velocity.x *= 1 - decay.x
            $motion.velocity.y *= 1 - decay.y
            $motion.velocity.z *= 1 - decay.z
          }

          this.mixinLoop.update()

          // Last position

          $motion.lastTranslation = {
            x: $transform.translation.x,
            y: $transform.translation.y,
            z: $transform.translation.z
          }
        }
      }
    }
  },

  computed: {
    $motion () {
      return this.$data.mixinMotion
    }
  }
}
