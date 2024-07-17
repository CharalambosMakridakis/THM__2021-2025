let MessageLock: boolean = false;

export const lock = () => {
  MessageLock = true;

  setTimeout(() => {
    MessageLock = false;
  }, 1000);
};

export const isLocked = () => MessageLock;
