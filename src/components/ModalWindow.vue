<template>
  <div :class="{ modal: true, modal_hidden: isClosed }" @click="closeModal">
    <div
      :class="{ modal__window: true, modal__window_hidden: isClosed }"
      @click.stop
    >
      <div class="modal__title">
        <slot name="title">Заголовок</slot>
        <div class="modal__close-icon" @click.prevent="closeModal"></div>
      </div>
      <div class="modal__body">
        <slot name="body"></slot>
      </div>
      <div class="modal__footer">
        <button
          :class="{btn: true, 'modal__save-btn': true, btn_disabled: !isValid}"
          @click="acceptResult"
        >
          <slot name="accept_btn">Сохранить</slot>
        </button>
        <button class="btn modal__close-btn" @click="closeModal">
          <slot name="decline_btn">Сохранить</slot>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isClosed: {
      type: Boolean,
      required: true,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['closeModal', 'acceptResult'],
  setup(props, { emit }) {
    function closeModal() {
      if (!props.isClosed) {
        emit('closeModal');
      }
    }
    function acceptResult() {
      emit('acceptResult');
    }

    return {
      closeModal,
      acceptResult
    };
  },
}
</script>