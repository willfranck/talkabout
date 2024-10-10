export const placeholderTopics = [
  "The Start of Something Fan-llama-tastic...",
  "A Journey Begins with a Llama and a Chat...",
  "Talk to the Llama and the Llama Talks Back...",
  "Exploring New Horizons with a Llama...",
  "Charting a New Course with a Llama..."
]

export const randomTopic = () => {
  return placeholderTopics[Math.floor(Math.random() * placeholderTopics.length)]
}
