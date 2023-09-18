<script setup lang="ts">
import { IComment } from "@workspace/shared";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";

interface Props {
  comment: IComment;
}
const { comment } = defineProps<Props>();
const commentsStore = useComment();
const editMode = ref(false);

const handleDelete = () => {
  commentsStore.deleteMessage(comment.id);
};

const editedContent = ref(comment.content);

const closeEditing = () => {
  editedContent.value = comment.content;
  editMode.value = false;
};

const handleEdit = () => {
  commentsStore.updateMessage(comment.id, editedContent.value);
  editMode.value = false;
};
</script>

<template>
  <div class="px-5 py-4 text-lg flex gap-5 w-full">
    <UserIcon class="w-12 h-11 bg-slate-500 rounded-full" />

    <div class="flex w-full bg-violet-900 rounded-2xl">
      <div class="flex flex-col w-full p-3">
        <div class="font-bold flex items-center gap-2">
          {{ comment.user.username }}
          <span class="text-sm text-slate-300 font-normal">
            <NuxtTime
              :datetime="comment.createdAt"
              day="numeric"
              month="short"
              hour="numeric"
            />
          </span>
        </div>

        <div
          class="flex gap-4 items-center"
          v-if="!comment.isDeleted && !editMode"
        >
          <p>
            {{ comment.content }}
            <span class="text-slate-400" v-if="comment.isRedacted"
              >(edited)</span
            >
          </p>

          <div class="flex gap-2" v-if="comment.user.id === useAuth().userId">
            <button
              @click="editMode = true"
              class="block hover:bg-cyan-400 transition-all rounded p-1 duration-100 active:opacity-70"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              @click="handleDelete"
              class="block hover:bg-red-400 hover:text-black transition-all rounded p-1 duration-100 active:opacity-70"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="editMode" class="flex gap-4">
          <!-- <input
            type="text"
            class="w-2/3 bg-purple-300 text-black rounded-xl focus:outline-none"
          /> -->
          <div class="relative mt-2">
            <input
              v-model="editedContent"
              type="text"
              name="name"
              class="peer block w-full border-0 py-1.5 bg-violet-900 text-white focus:ring-0 sm:text-lg sm:leading-6"
            />
            <div
              class="absolute inset-x-0 bottom-0 border-t border-purple-300 peer-focus:border-t-2 peer-focus:border-purple-400"
              aria-hidden="true"
            />
          </div>
          <div class="flex items-center gap-4">
            <button
              @click="closeEditing"
              class="block hover:bg-red-500 p-1 transition-all rounded duration-100 active:opacity-70"
            >
              <XMarkIcon class="w-4" />
            </button>

            <button
              @click="handleEdit"
              :disabled="editedContent.trim().length <= 4"
              class="block hover:bg-blue-500 p-1 transition-all rounded duration-100 active:opacity-70 disabled:opacity-60"
            >
              <CheckIcon class="w-4" />
            </button>
          </div>
        </div>

        <div v-if="comment.isDeleted" class="flex w-full items-center">
          <p class="text-slate-400">Comment was deleted</p>
        </div>
      </div>
    </div>
  </div>
</template>
