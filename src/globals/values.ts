export const placeholderTopics = [
  "The Start of Something Llama-tastic",
  "A Journey with a Llama and a Chat",
  "Talk to the Llama, the Llama Talks Back",
  "Exploring New Horizons with a Llama",
  "Charting a New Course with a Llama"
]

export const randomTopic = () => {
  return placeholderTopics[Math.floor(Math.random() * placeholderTopics.length)]
}
