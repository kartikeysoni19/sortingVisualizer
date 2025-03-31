
let array = [];
let arraySize = 50;
let animationSpeed = 50;
let isRunning = false;
let algorithm = 'bubble';
let startTime;
let sortingProcess = null;

function disableControls(disable) {
  document.getElementById('newArray').disabled = disable;
  document.getElementById('startSort').disabled = disable;
  document.getElementById('arraySize').disabled = disable;
  document.querySelectorAll('.algorithm-buttons button').forEach(btn => {
    btn.disabled = disable;
  });
  document.getElementById('resetSort').disabled = !disable;
}

async function startSorting() {
  if (isRunning) return;
  isRunning = true;
  disableControls(true);
  
  switch(algorithm) {
    case 'bubble':
      await bubbleSort();
      break;
    case 'selection':
      await selectionSort();
      break;
    case 'insertion':
      await insertionSort();
      break;
    case 'merge':
      await mergeSort(0, array.length - 1);
      break;
    case 'quick':
      await quickSort(0, array.length - 1);
      break;
  }
  
  isRunning = false;
}

async function selectionSort() {
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      displayArray([minIdx, j], [j], [], Array.from({length: i}, (_, x) => x));
      comparisons++;
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
      updateMetrics(comparisons, swaps);
      await sleep(50);
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      swaps++;
      displayArray([i, minIdx], [], [i, minIdx]);
      await sleep(50);
    }
  }
  displayArray([], [], [], Array.from({length: array.length}, (_, i) => i));
}

async function insertionSort() {
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    displayArray([i], [j], [], Array.from({length: i}, (_, x) => x));
    await sleep(50);
    
    while (j >= 0 && array[j] > key) {
      comparisons++;
      array[j + 1] = array[j];
      swaps++;
      displayArray([j + 1], [], [j, j + 1]);
      updateMetrics(comparisons, swaps);
      await sleep(50);
      j--;
    }
    array[j + 1] = key;
  }
  displayArray([], [], [], Array.from({length: array.length}, (_, i) => i));
}

async function merge(l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;
  let L = new Array(n1);
  let R = new Array(n2);
  
  for(let i = 0; i < n1; i++) L[i] = array[l + i];
  for(let j = 0; j < n2; j++) R[j] = array[m + 1 + j];
  
  let i = 0, j = 0, k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    displayArray([k], [l + i, m + 1 + j], [k]);
    await sleep(50);
    k++;
  }
  
  while (i < n1) {
    array[k] = L[i];
    displayArray([k], [], [k]);
    await sleep(50);
    i++;
    k++;
  }
  
  while (j < n2) {
    array[k] = R[j];
    displayArray([k], [], [k]);
    await sleep(50);
    j++;
    k++;
  }
}

async function mergeSort(l, r) {
  if (l < r) {
    let m = Math.floor(l + (r - l) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    displayArray([high], [j], [], []);
    await sleep(50);
    
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      displayArray([high], [], [i, j]);
      await sleep(50);
    }
  }
  
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  displayArray([], [], [i + 1, high]);
  await sleep(50);
  
  return i + 1;
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

function resetSorting() {
  isRunning = false;
  disableControls(false);
  generateArray();
}

const algorithmInfo = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
    pseudocode: {
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]`,
      cpp: `void bubbleSort(int arr[], int n) {
    for(int i = 0; i < n; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
        }
    }
}`,
      java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for(int i = 0; i < n; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`
    }
  },
  selection: {
    name: 'Selection Sort',
    description: 'Selection Sort divides the input list into a sorted and an unsorted region. It repeatedly selects the smallest element from the unsorted region and adds it to the sorted region.',
    pseudocode: {
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
      cpp: `void selectionSort(int arr[], int n) {
    for(int i = 0; i < n; i++) {
        int min_idx = i;
        for(int j = i+1; j < n; j++) {
            if(arr[j] < arr[min_idx])
                min_idx = j;
        }
        swap(arr[i], arr[min_idx]);
    }
}`,
      java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for(int i = 0; i < n; i++) {
        int min_idx = i;
        for(int j = i+1; j < n; j++) {
            if(arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`
    }
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Insertion Sort builds the final sorted array one item at a time. It iterates through the input array and removes one element per iteration, finds the location it belongs to in the sorted list, and inserts it there.',
    pseudocode: {
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key`,
      cpp: `void insertionSort(int arr[], int n) {
    for(int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i-1;
        while(j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}`,
      java: `void insertionSort(int[] arr) {
    for(int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i-1;
        while(j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}`
    }
  },
  merge: {
    name: 'Merge Sort',
    description: 'Merge Sort is a divide-and-conquer algorithm that recursively breaks down a problem into smaller, more manageable subproblems until they become simple enough to solve directly.',
    pseudocode: {
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        merge(arr, L, R)`,
      cpp: `void mergeSort(int arr[], int l, int r) {
    if(l < r) {
        int m = l+(r-l)/2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}`,
      java: `void mergeSort(int[] arr, int l, int r) {
    if(l < r) {
        int m = l+(r-l)/2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}`
    }
  },
  quick: {
    name: 'Quick Sort',
    description: 'Quick Sort is a highly efficient sorting algorithm that uses a divide-and-conquer strategy to sort elements. It works by selecting a "pivot" element and partitioning the array around it.',
    pseudocode: {
      python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi-1)
        quick_sort(arr, pi+1, high)`,
      cpp: `void quickSort(int arr[], int low, int high) {
    if(low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}`,
      java: `void quickSort(int[] arr, int low, int high) {
    if(low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}`
    }
  }
}


function generateArray() {
  array = [];
  for (let i = 0; i < arraySize; i++) {
    array.push(Math.random() * 100);
  }
  displayArray();
  resetMetrics();
}

function displayArray(current = [], comparing = [], swapping = [], sorted = []) {
  const container = document.getElementById('array-container');
  container.innerHTML = '';
  const maxVal = Math.max(...array);
  
  array.forEach((value, idx) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${(value / maxVal) * 280}px`;
    
    if (current.includes(idx)) bar.style.backgroundColor = '#0d1117';
    if (comparing.includes(idx)) bar.style.backgroundColor = '#ff6b6b';
    if (swapping.includes(idx)) bar.style.backgroundColor = '#51cf66';
    if (sorted.includes(idx)) bar.style.backgroundColor = '#339af0';
    
    container.appendChild(bar);
  });
}

function resetMetrics() {
  document.getElementById('comparisons').textContent = '0';
  document.getElementById('swaps').textContent = '0';
  document.getElementById('timeElapsed').textContent = '0.0s';
  document.getElementById('steps').textContent = '0';
  startTime = null;
}

function updateMetrics(comparisons, swaps) {
  if (!startTime) startTime = performance.now();
  const timeElapsed = ((performance.now() - startTime) / 1000).toFixed(1);
  
  document.getElementById('comparisons').textContent = comparisons;
  document.getElementById('swaps').textContent = swaps;
  document.getElementById('timeElapsed').textContent = `${timeElapsed}s`;
  document.getElementById('steps').textContent = comparisons + swaps;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms * (100 - animationSpeed) / 50));
}

async function bubbleSort() {
  let comparisons = 0;
  let swaps = 0;
  
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      displayArray([j, j + 1], [j, j + 1], [], 
                  Array.from({length: array.length - i}, (_, x) => x + array.length - i));
      
      comparisons++;
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;
        displayArray([j, j + 1], [], [j, j + 1]);
        await sleep(50);
      }
      
      updateMetrics(comparisons, swaps);
      await sleep(50);
    }
  }
  
  displayArray([], [], [], Array.from({length: array.length}, (_, i) => i));
}

// Event Listeners
document.getElementById('newArray').addEventListener('click', generateArray);
document.getElementById('startSort').addEventListener('click', startSorting);
document.getElementById('resetSort').addEventListener('click', resetSorting);

document.getElementById('arraySize').addEventListener('input', function() {
  arraySize = parseInt(this.value);
  generateArray();
});

document.getElementById('speed').addEventListener('input', function() {
  animationSpeed = parseInt(this.value);
});

document.querySelectorAll('.algorithm-buttons button').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelector('.algorithm-buttons button.active').classList.remove('active');
    this.classList.add('active');
    algorithm = this.textContent.toLowerCase().split(' ')[0];
    document.getElementById('algorithmDescription').textContent = algorithmInfo[algorithm].description;
    updatePseudocode();
  });
});

let currentLanguage = 'python';

function updatePseudocode() {
  document.getElementById('algorithmPseudocode').textContent = algorithmInfo[algorithm].pseudocode[currentLanguage];
}

// Modal functionality
function toggleModal() {
  document.getElementById('infoModal').classList.toggle('active');
}

// Initialize
window.onload = function() {
  // Add modal handlers
  document.querySelector('.info-icon').addEventListener('click', toggleModal);
  document.querySelector('.close-modal').addEventListener('click', toggleModal);
  document.getElementById('infoModal').addEventListener('click', function(e) {
    if (e.target === this) toggleModal();
  });
  generateArray();
  document.getElementById('algorithmDescription').textContent = algorithmInfo.bubble.description;
  updatePseudocode();
  
  // Add language selection handlers
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelector('.lang-btn.active').classList.remove('active');
      this.classList.add('active');
      currentLanguage = this.dataset.lang;
      updatePseudocode();
    });
  });
};
