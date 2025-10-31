// Get references to the buttons, dropdowns, text input, and response display area
const iceBtn = document.getElementById('iceBtn');
const factBtn = document.getElementById('factBtn');
const jokeBtn = document.getElementById('jokeBtn');
const weatherBtn = document.getElementById('weatherBtn');
const contextDropdown = document.getElementById('contextDropdown');
const personaDropdown = document.getElementById('personaDropdown');
const customTextInput = document.getElementById('customText');
const responseDiv = document.getElementById('response');

// Define context-specific instructions for each setting
const contextInstructions = {
  casual: 'Keep it relaxed, friendly, and fun - like hanging out with friends.',
  meeting: 'Keep it professional but warm - appropriate for a team meeting or work setting.',
  classroom: 'Keep it educational and encouraging - suitable for students and teachers.',
  gamenight: 'Keep it playful, energetic, and entertaining - perfect for a fun game night atmosphere.'
};

// Define persona-specific instructions for different personalities
const personaInstructions = {
  friendly: 'Respond in the voice of a friendly, supportive coworker who is warm and encouraging.',
  sassy: 'Respond in the voice of a sassy, playful intern who uses emojis and has a fun, cheeky attitude. Be witty and spirited!',
  professor: 'Respond in the voice of a knowledgeable professor who is wise, articulate, and loves to educate. Use a scholarly but accessible tone.'
};

// Define base prompts for each button type
const buttonPrompts = {
  icebreaker: 'Generate a creative and fun icebreaker question that can be used in a conversation or meeting. Keep it short and engaging.',
  fact: 'Share a surprising and interesting fact that most people don\'t know. Make it fascinating and memorable.',
  joke: 'Tell a friendly, clean, and funny joke that will make people smile. Keep it appropriate for all audiences.',
  weather: 'Create a weather-related conversation prompt that encourages people to share what the weather is like where they are. Make it engaging and fun.'
};

// Function to get the current context instruction
function getContextInstruction() {
  const selectedContext = contextDropdown.value;
  return contextInstructions[selectedContext];
}

// Function to get the current persona instruction
function getPersonaInstruction() {
  const selectedPersona = personaDropdown.value;
  return personaInstructions[selectedPersona];
}

// Function to log button click with current settings
function logButtonClick(buttonName, buttonEmoji) {
  // Get the current settings
  const customText = customTextInput.value.trim();
  const contextText = contextDropdown.options[contextDropdown.selectedIndex].text;
  const personaText = personaDropdown.options[personaDropdown.selectedIndex].text;
  
  // Build the log message
  const customPart = customText ? `| Custom: "${customText}"` : '';
  console.log(`${buttonEmoji} ${buttonName} clicked with Context: ${contextText} | Persona: ${personaText} ${customPart}`);
}

// Function to call OpenAI API with context-aware and persona-aware prompts
async function getOpenAIResponse(prompt) {
  responseDiv.textContent = 'Generating response... 🤔';
  
  // Get the instructions based on dropdown selection.
  const contextInstruction = getContextInstruction();
  const personaInstruction = getPersonaInstruction();
  
  // Get custom text from the input box
  const customText = customTextInput.value.trim();
  
  // Add custom text to the prompt if provided
  let fullPrompt = prompt;
  if (customText) {
    fullPrompt = `${prompt} Include this detail: ${customText}.`;
  }
  
  // Combine with context and persona instructions
  fullPrompt = `${fullPrompt} ${contextInstruction} ${personaInstruction}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: fullPrompt
          }
        ],
        max_tokens: 150
      })
    });

    // Parse the response from OpenAI
    const data = await response.json();

    // Extract and return the generated text
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Error:', error);
    return 'Oops! Something went wrong. Please try again. 😕';
  }
}

// Event listener for Icebreaker button
iceBtn.addEventListener('click', async () => {
  logButtonClick('Icebreaker', '🗨️');
  const result = await getOpenAIResponse(buttonPrompts.icebreaker);
  responseDiv.textContent = result;
});

// Event listener for Weird Fact button
factBtn.addEventListener('click', async () => {
  logButtonClick('Weird Fact', '💡');
  const result = await getOpenAIResponse(buttonPrompts.fact);
  responseDiv.textContent = result;
});

// Event listener for Joke button
jokeBtn.addEventListener('click', async () => {
  logButtonClick('Joke', '😄');
  const result = await getOpenAIResponse(buttonPrompts.joke);
  responseDiv.textContent = result;
});

// Event listener for Weather button
weatherBtn.addEventListener('click', async () => {
  logButtonClick('Weather', '☁️');
  const result = await getOpenAIResponse(buttonPrompts.weather);
  responseDiv.textContent = result;
});