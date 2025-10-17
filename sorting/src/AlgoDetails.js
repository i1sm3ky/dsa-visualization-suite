export const alogDetails = {
  bubbleSort: {
    title: "Bubble Sort",
    description: `<p><strong>Description:</strong> Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. This process repeats until no swaps are needed.</p>
    <p><strong>Advantages:</strong> Simple to understand and implement.</p>
    <p><strong>Stability:</strong> Yes, Adjacent elements are swapped only when needed, preserving order.</p>
    <p><strong>Disadvantages:</strong> Very inefficient for large datasets.</p>
    <p><strong>Conditions:</strong> Best suited for small datasets or nearly sorted data.</p>`,
    complexities: {
      average: "Θ(n<sup>2</sup>)",
      best: "Ω(n)",
      worst: "O(n<sup>2</sup>)",
      space: "O(1)",
    },
    code: `def bubbleSort(arr: List[int]) -> None:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break`,
  },

  selectionSort: {
    title: "Selection Sort",
    description: `<p><strong>Description:</strong> Selection sort divides the array into a sorted and unsorted part, repeatedly selecting the minimum element from the unsorted portion and placing it at the end of the sorted portion.</p>
      <p><strong>Advantages:</strong> Simple, reduces number of swaps.</p>
      <p><strong>Stability:</strong> No, Can swap non-adjacent elements, breaking the relative order.</p>
      <p><strong>Disadvantages:</strong> Inefficient for large datasets.</p>
      <p><strong>Conditions:</strong> Performs well on small datasets.</p>`,
    complexities: {
      average: "Θ(n<sup>2</sup>)",
      best: "Ω(n<sup>2</sup>)",
      worst: "O(n<sup>2</sup>)",
      space: "O(1)",
    },
    code: `def selectionSort(arr: List[int]) -> None:
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
  },

  insertionSort: {
    title: "Insertion Sort",
    description: `<p><strong>Description:</strong> Insertion sort builds the sorted array one element at a time by comparing and inserting elements into their correct position.</p>
      <p><strong>Advantages:</strong> Efficient for small or nearly sorted datasets.</p>
      <p><strong>Stability:</strong> Yes, Elements are inserted in the correct place, preserving relative order.</p>
      <p><strong>Disadvantages:</strong> Poor performance on large unsorted datasets.</p>
      <p><strong>Conditions:</strong> Best suited for small datasets or data that's already partially sorted.</p>`,
    complexities: {
      average: "Θ(n<sup>2</sup>)",
      best: "Ω(n)",
      worst: "O(n<sup>2</sup>)",
      space: "O(1)",
    },
    code: `def insertionSort(arr: List[int]) -> None:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
  },

  mergeSort: {
    title: "Merge Sort",
    description: `<p><strong>Description:</strong> Merge sort is a divide and conquer algorithm that splits the array into halves, sorts each half, and then merges them together.</p>
      <p><strong>Advantages:</strong> Efficient, stable, consistent O(n log<sub>2</sub> n) performance.</p>
      <p><strong>Stability:</strong> Yes, Standard implementation is stable if merging preserves order.</p>
      <p><strong>Disadvantages:</strong> Requires extra memory for merging.</p>
      <p><strong>Conditions:</strong> Suitable for large datasets and stable sorting requirements.</p>`,
    complexities: {
      average: "Θ(n log<sub>2</sub> n)",
      best: "Ω(n log<sub>2</sub> n)",
      worst: "O(n log<sub>2</sub> n)",
      space: "O(n)",
    },
    code: `def mergeSort(arr: List[int]) -> List[int]:
    if len(arr) > 1:
        mid = len(arr) // 2
        left = mergeSort(arr[:mid])
        right = mergeSort(arr[mid:])
        return merge(left, right)
    return arr

def merge(left: List[int], right: List[int]) -> List[int]:
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  },

  quickSort: {
    title: "Quick Sort",
    description: `<p><strong>Description:</strong> Quick sort selects a pivot and partitions the array around the pivot such that elements less than the pivot are on the left, and those greater are on the right.</p>
      <p><strong>Advantages:</strong> Fast on average, in-place sort.</p>
      <p><strong>Stability:</strong> No, Swapping during partitioning can break relative order.</p>
      <p><strong>Disadvantages:</strong> Worst-case is O(n<sup>2</sup>); not stable.</p>
      <p><strong>Conditions:</strong> Good for large datasets; performance depends on pivot choice.</p>`,
    complexities: {
      average: "Θ(n log<sub>2</sub> n)",
      best: "Ω(n log<sub>2</sub> n)",
      worst: "O(n<sup>2</sup>)",
      space: "O(log n)",
    },
    code: `def quickSort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quickSort(left) + middle + quickSort(right)`,
  },

  heapSort: {
    title: "Heap Sort",
    description: `<p><strong>Description:</strong> Heap sort builds a max heap and repeatedly swaps the root with the last element, reducing the heap size and maintaining the heap property.</p>
      <p><strong>Advantages:</strong> In-place, consistent O(n log<sub>2</sub> n) performance.</p>
      <p><strong>Stability:</strong> No, Structure of the heap leads to non-stable behavior.</p>
      <p><strong>Disadvantages:</strong> Not stable, more complex to implement.</p>
      <p><strong>Conditions:</strong> Suitable when space is constrained and stability isn't required.</p>`,
    complexities: {
      average: "Θ(n log<sub>2</sub> n)",
      best: "Ω(n log<sub>2</sub> n)",
      worst: "O(n log<sub>2</sub> n)",
      space: "O(1)",
    },
    code: `def heapify(arr: List[int], n: int, i: int) -> None:
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[largest] < arr[left]:
        largest = left
    if right < n and arr[largest] < arr[right]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heapSort(arr: List[int]) -> None:
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`,
  },
};
