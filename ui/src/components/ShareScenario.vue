<template>
  <vue-tailwind-modal :showing="modalShowing" @close="close" :showClose="true" :backgroundClose="true">
    <div class="flex flex-wrap content-around">
      <div class="w-11/12">
        <input id="scenarioUrl" type=text disabled=true class="w-full" :value="scenarioUrl" />
      </div>
      <div class="h-11 w-8 cursor-pointer">
        <div class="mt-1 ml-1" v-on:click="copyUrl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </div>
      </div>
    </div>
  </vue-tailwind-modal>
</template>

<script>
export default {
  name: 'ShareScenario',
  props: {
    modalShowing: {
      type: Boolean,
      required: true
    },
    scenarioUrl: String,
    copyUrl: {
      type: Function,
      required: true
    }
  },
  methods: {
    close: function () {
      this.$emit('update:showing', false)
    }
  }
}
</script>
