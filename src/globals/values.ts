//// Global Values
const threadCategories = [
  "active",
  "archived"
]

const temperatureSettings = {
  hot: 2.0,
  normal: 1.0,
  cold: 0.4
}

const placeholderTopics = [
  "The Start of a ... Something",
  "A Journey with a Llama and a Chat",
  "Talk to the Llama",
  "New Chat with Llamini-Flash",
  "Going down the llama hole..."
]
const randomTopic = () => {
  return placeholderTopics[Math.floor(Math.random() * placeholderTopics.length)]
}


export {
  threadCategories,
  temperatureSettings,
  randomTopic,
}
