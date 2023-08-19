<script setup lang="ts">
import Comment from "./Comment.vue";
import CommentInput from "./CommentInput.vue";
</script>

<template>
  <div
    class="comments flex flex-col gap-7 py-6 bg-[#332088] p-6 rounded-lg shadow-lg"
  >
    <CommentInput />
    <div>
      <h2 class="text-xl pb-2">Comments</h2>
      <ul class="comments-list flex flex-col gap-5">
        <li>
          <Comment />
        </li>
      </ul>
    </div>
  </div>
</template>
