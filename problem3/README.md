# Problem 3: Messy React

### 1. Fetching Data in useEffect Without Cleanup

Add a cleanup function or dependency array to limit re-fetching of data to when it's necessary, such as when a prop changes instead of fetching the data every time the component renders or re-renders.

### 2. Typo in error Handling with console.err:
Change `console.err(error)` to `console.error(error)`

### 3. Tight Coupling Between Components and Price Logic
Move the data-fetching logic into a custom hook (usePrices) to encapsulate the side-effect logic and make the component cleaner as the logic for retrieving prices and rendering the component are tightly coupled. This leads to poor separation of concerns.

### 4. Potential Type Mismatch
Use stricter typing for blockchain and other variables to prevent potential runtime issues since it is currently of type any in getPriority, which can lead to runtime errors.

### 5. Unnecessary Sorting in useMemo
Memoize getPriority using useCallback to avoid recalculating for each balance on every render when balances or prices change.

### 6. lhsPriority is undefined (Filter Condition)
Replace lhsPriority with the actual priority of the balance being filtered and clarify the logic for filtering as the condition lhsPriority > -99 is used, but undefined.

### 7. Recomputing Formatted Balances
Move formattedBalances inside useMemo to avoid unnecessary recalculations as formattedBalances is recomputed after sortedBalances on every render which it does not need if sortedBalances doesn't change.