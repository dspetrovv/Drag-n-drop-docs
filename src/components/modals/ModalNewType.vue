<template>
  <modal-window
    :is-closed="isClosed"
    :is-valid="isValid"
    @acceptResult="makeTypeActions"
    @closeModal="closeModal"
  >
    <template #title>{{ isNew ? 'Создать' : 'Изменить' }} тип</template>
    <template #body>
      <label for="title" class="label_mini">Название</label>
      <input id="title" type="text" v-model="title">
      <label for="short-title" class="label_mini">Короткое название</label>
      <input id="short-title" type="text" v-model="shortTitle">
      <label id="description" class="label_mini">Описание</label>
      <textarea
        id="description"
        type="text"
        v-model="description"
        rows="5"
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
  setup(_, { emit }) {
    const modalStore = useModalStore();
    let initials = computed(() => modalStore.initialTitle);
    let title = ref('');
    let shortTitle = ref('');
    let description = ref('');
    let isNew = ref(true);
    let isValid = computed(() => {
      return !!(title.value.trim().length && shortTitle.value.trim().length && description.value.trim().length)
    });
    watch(initials, () => {
      title.value = modalStore.initialTitle;
      shortTitle.value = modalStore.initialShortTitle;
      description.value = modalStore.initialDescription;
      isNew.value = modalStore.isNew;
    });

    function closeModal() {
      title.value = shortTitle.value = description.value = '';
      modalStore.resetModalState();
      emit('closeModal', modals.MODAL_NEW_TYPE, true);
    }
    function makeTypeActions() {
      modalStore.makeTypeActions(title.value, shortTitle.value, description.value, isNew.value);
      closeModal();
    }

    return {
      title,
      shortTitle,
      description,
      isNew,
      isValid,
      closeModal,
      makeTypeActions
    };
  },
}
</script>