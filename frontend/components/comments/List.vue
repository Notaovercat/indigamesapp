<script setup lang="ts">
import { IComment } from "@workspace/shared";

interface Props {
  gameId: string;
}

const { gameId } = defineProps<Props>();

const commentsStore = useComment();

commentsStore.join(gameId);

const comments: ComputedRef<IComment[]> = computed(
  () => commentsStore.comments
);
</script>

<template>
  <div class="comments flex flex-col gap-7 py-6 bg-[#22155a] p-6 rounded-lg">
    <CommentsInput :gameId="gameId" />
    <div>
      <h2 class="text-xl pb-2">Comments</h2>

      <TransitionGroup
        name="list"
        tag="ul"
        v-if="comments.length > 0"
        class="comments-list flex flex-col"
      >
        <li v-for="comment in comments" :key="comment.id">
          <CommentsContent :comment="comment" />
        </li>
      </TransitionGroup>
      <div v-else class="flex w-full justify-center text-xl py-9">
        <p>There are no comments</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
