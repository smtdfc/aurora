const gradients = [
  ['#f5f7fa', '#c3cfe2'], 
  ['#ff9a9e', '#fad0c4'], 
  ['#84fab0', '#8fd3f4'], 
  ['#ffecd2', '#fcb69f'], 
  ['#43e97b', '#38f9d7'], 
  ['#f7971e', '#ffd200'], 
];

export function getRandomGradient(): string {
  const colors = gradients[Math.floor(Math.random() * gradients.length)];
  return `linear-gradient(135deg, ${colors.join(', ')})`;
}