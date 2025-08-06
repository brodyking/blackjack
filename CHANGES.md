# Todo for splitting hands

- [x] Multiple hands
- [x] Show both cards
- [x] Split hand divides cards
- [x] Upon standing the first hand, move to the second hand
- [x] When moved to a new hand, determine if it needs another card (from 1 to 2 before hit)
- [ ] Game logic to determine which hands won
- [ ] Proper interface for splits

# Changes made

- Removed the "onclick" in the interface. This will be required on the interface rewrite. It is better to use events inside of the game class.

# Ideas

this is how i could await a button click when redesigning logic

```javascript
  function awaitEvent(element, eventType) {
  return new Promise(resolve => {
    const handler = (event) => {
      element.removeEventListener(eventType, handler); // Remove listener after event fires
      resolve(event); // Resolve the Promise with the event object
    };
    element.addEventListener(eventType, handler);
  });
}

async function performActionAfterClick() {
  const button = document.getElementById('myButton');
  console.log('Waiting for button click...');
  const clickEvent = await awaitEvent(button, 'click');
  console.log('Button clicked!', clickEvent);
  // Perform actions that depend on the click event
}

// Call the async function to start the process
performActionAfterClick();
```
