export const temperatureSettings = {
  hot: 2.0,
  normal: 1.0,
  cold: 0.1
}

export const placeholderTopics = [
  "The Start of a ... Something",
  "A Journey with a Llama and a Chat",
  "Talk to the Llama, the Llama Talks Back",
  "New Chat with Llamini-Flash",
  "Going down the llama hole..."
]

export const randomTopic = () => {
  return placeholderTopics[Math.floor(Math.random() * placeholderTopics.length)]
}
