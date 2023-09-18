<script setup lang="ts">
interface Props {
  gameId: string;
}
const { gameId } = defineProps<Props>();

const commentsStore = useComment();

const content = ref("");

const handleSend = () => {
  if (content.value.trim().length <= 4) return;
  // console.log(gameId, content.value);
  commentsStore.sendMessage(gameId, content.value);
  content.value = "";
};
</script>

<template>
  <div>
    <h3 class="text-xl pb-2">Write a comment</h3>
    <div class="flex justify-between items-center gap-5">
      <textarea
        v-model="content"
        type="text"
        class="block w-full text-black text-sm border border-gray-300 rounded-md"
      />
      <div>
        <button
          v-if="useAuth().isAuthed"
          @click="handleSend"
          :disabled="content.trim().length <= 4"
          class="block p-4 rounded-md bg-gradient-to-br from-violet-600 via-violet-800 to-violet-950 transition-opacity shadow-2xl active:opacity-75 duration-0 disabled:opacity-25"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>
