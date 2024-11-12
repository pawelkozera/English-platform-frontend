export function decodeBase64(data: string) {
    return atob(data);
}

export function decodeTask(task: any) {
    return {
      ...task,
      content: decodeBase64(task.content),
      correctAnswer: decodeBase64(task.correctAnswer),
      words: task.words.map((word: any) => ({
        ...word,
        word: decodeBase64(word.word),
        translation: decodeBase64(word.translation),
      })),
    };
  }