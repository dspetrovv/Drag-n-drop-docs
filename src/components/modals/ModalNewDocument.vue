<template>
  <modal-window
    :is-closed="isClosed"
    :is-valid="isValid"
    @acceptResult="makeDocumentActions"
    @closeModal="closeModal"
  >
    <template #title>{{ isNew ? 'Создать' : 'Изменить' }} документ</template>
    <template #body>
      <label for="name" class="label_mini">Название</label>
      <input id="name" type="text" v-model="name">
      <label id="description" class="label_mini">Описание</label>
      <textarea
        id="description"
        type="text"
        v-model="description"
        rows="8"
        style="resize: none"
      ></textarea>
    </template>
    <template #accept_btn>{{ isNew ? 'Создать' : 'Изменить' }}</template>
    <template #decline_btn>Отмена</template>
  </modal-window>
</template>
<script>
import modals from '@/static/constants';
import { computed, ref, watch } from 'vue';
import ModalWindow from '../ModalWindow.vue';
import { useModalStore } from '@/store/modal-store';
export default {
  components: { ModalWindow },
  props: {
    isClosed: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['closeModal'],
  setup(props, { emit }) {
    const modalStore = useModalStore();
    let initials = computed(() => modalStore.initialTitle);
    let name = ref('');
    let description = ref('');
    let isNew = ref(true);
    let isValid = computed(() => {
      return !!name.value.trim().length
    });
    watch(initials, () => {
      name.value = modalStore.initialTitle;
      description.value = modalStore.initialDescription;
      isNew.value = modalStore.isNew;
    });

    function closeModal() {
      name.value = description.value = '';
      modalStore.resetModalState();
      emit('closeModal', modals.MODAL_NEW_DOC, true);
    }
    function makeDocumentActions() {
      modalStore.makeDocumentActions(name.value, description.value, isNew.value);
      closeModal();
    }

    return {
      name,
      description,
      isNew,
      isValid,
      closeModal,
      makeDocumentActions
    };
  },
}
</script>