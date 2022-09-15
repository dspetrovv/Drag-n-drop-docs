<template>
  <div class="btn btn_plus" @click.prevent="clickHandler">
    <span class="btn__icon-plus"></span>
    <slot name="name">Кнопка</slot>
  </div>
</template>
<script>
export default {
  emits: ['onClick'],
  setup(_, { emit }) {
    function clickHandler() {
      emit('onClick');
    }

    return {
      clickHandler
    };
  },
}
</script>