export const delay = (interval = 300, likeAnimation) => {
  return new Promise(resolve => {
    likeAnimation.setAttribute(
      "style",
      "animation: rotating 2s linear infinite"
    );
    setTimeout(() => {
      resolve();
    }, interval);
  });
};
