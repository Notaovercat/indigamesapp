import { IComment } from "@workspace/shared";

export const useComment = defineStore("comment", () => {
  const io = useNuxtApp().$io;

  const comments: Ref<IComment[]> = ref([]);

  function join(gameId: string) {
    io.connect();
    io.emit("createRoom", gameId);
  }

  function sendMessage(gameId: string, content: string) {
    io.emit("sendComment", { gameId, content });
  }

  function updateMessage(commentId: string, content: string) {
    io.emit("updateComment", { commentId, content });
  }

  function deleteMessage(commentId: string) {
    io.emit("deleteComment", { commentId });
  }

  io.on("getComments", (commentsArr: IComment[]) => {
    comments.value = commentsArr;
  });

  io.on("newComment", (newComment: IComment) => {
    comments.value.unshift(newComment);
  });

  io.on("commentUpdated", (newComment: IComment) => {
    const index = comments.value.findIndex(
      (comment) => comment.id === newComment.id
    );
    if (index !== -1) comments.value[index] = newComment;
  });

  io.on("commentDeleted", (commentId: string) => {
    const index = comments.value.findIndex(
      (comment) => comment.id === commentId
    );
    if (index !== -1) comments.value[index].isDeleted = true;
  });

  return {
    join,
    comments,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
});
