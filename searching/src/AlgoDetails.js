export const alogDetails = {
  linearSearch: {
    title: "Linear Search",
    description: `<p><strong>Description:</strong> Linear search sequentially checks each element in a list until a match is found or the end of the list is reached.</p>
    <p><strong>Searches in:</strong> Sequential data structures like arrays and lists.</p>
    <p><strong>Advantages:</strong> Simple to implement, effective for small datasets or unsorted data.</p>
    <p><strong>Disadvantages:</strong> Inefficient for large datasets.</p>
    <p><strong>Conditions:</strong> No specific requirements; works universally with any type of sequential data.</p>`,
    complexities: {
      average: "Θ(n)",
      best: "Ω(1)",
      worst: "O(n)",
      space: "O(1)",
    },
    code: `def linearSearch(arr: List[], target: any) -> int:
    for index in range(len(arr)):
        if (arr[index] == target):
            return index
    return -1`,
  },
  binarySearch: {
    title: "Binary Search",
    description: `<p><strong>Description:</strong> Binary search works by repeatedly dividing the search interval in half. It compares the target value with the middle element of the array and eliminates half of the remaining elements.</p>
    <p><strong>Searches in:</strong> Sorted arrays or lists.</p>
    <p><strong>Advantages:</strong> Efficient, optimal for large sorted datasets.</p>
    <p><strong>Disadvantages:</strong> Requires sorted input; not applicable for unsorted data.</p>
    <p><strong>Conditions:</strong> Input must be sorted; best for searching in large sorted datasets.</p>`,
    complexities: {
      average: "Θ(log<sub>2</sub> n)",
      best: "Ω(1)",
      worst: "O(log<sub>2</sub> n)",
      space: "Recursive: O(log n)<br/>Iterative: O(1)",
    },
    code: `# recursive
def binarySearch(arr: List[int], low: int, high: int, target: int) -> int:
    if low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] > target:
            return binarySearch(arr, low, mid - 1, target)
        else:
        return binarySearch(arr, mid + 1, high, target)
    return -1

# iterative
def binarySearch(arr: List[int], low: int, high: int, target: int) -> int:
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
  },
  ternarySearch: {
    title: "Ternary Search",
    description: `<p><strong>Description:</strong> Ternary search is an extension of binary search where the search space is divided into three parts instead of two. It reduces the search space by two-thirds in each step.</p>
    <p><strong>Searches in:</strong> Sorted arrays.</p>
    <p><strong>Advantages:</strong> Efficient, divides search space into three parts.</p>
    <p><strong>Disadvantages:</strong> Slightly more complex than binary search.</p>
    <p><strong>Conditions:</strong> Input must be sorted; effective when dataset can be divided into three parts efficiently.</p>`,
    complexities: {
      average: "Θ(log<sub>3</sub> n)",
      best: "Ω(1)",
      worst: "O(log<sub>3</sub> n)",
      space: "Recursive: O(log<sub>3</sub> n)<br/>Iterative: O(1)",
    },
    code: `# recursive
def ternarySearch(arr: List[int], low: int, high: int, target: int) -> int:
    if low <= high:
        mid1 = low + (high - low) // 3
        mid2 = high - (high - low) // 3
        if (arr[mid1] == target):
            return mid1
        if (arr[mid2] == target):
            return mid2
        if (target < arr[mid1]):
            return ternarySearch(low, mid1 - 1, target, arr)
        elif (target > arr[mid2]):
            return ternarySearch(mid2 + 1, high, target, arr)
        else:
            return ternarySearch(mid1 + 1, mid2 - 1, target, arr)
    return -1

# iterative
def ternarySearch(arr: List[int], low: int, high: int, target: int) -> int:
    while low <= high:
        mid1 = low + (high - low) // 3
        mid2 = high - (high - low) // 3
        if target == arr[mid1]:
            return mid1
        if target == arr[mid2]:
            return mid2
        if target < arr[mid1]:
            high = mid1 - 1
        elif target > arr[mid2]:
            low = mid2 + 1
        else:
            low = mid1 + 1
            high = mid2 - 1
    return -1`,
  },
  jumpSearch: {
    title: "Jump Search",
    description: `<p><strong>Description:</strong> Jump search works by jumping ahead by a fixed number of steps in the sorted array and then performing a linear search in the smaller segment around the jump point.</p>
    <p><strong>Searches in:</strong> Sorted arrays.</p>
    <p><strong>Advantages:</strong> Efficient, faster than linear search for large datasets.</p>
    <p><strong>Disadvantages:</strong> Requires sorted input; works best when elements are uniformly distributed.</p>
    <p><strong>Conditions:</strong> Input must be sorted; optimal for scenarios where quick access and sorted data are available.</p>`,
    complexities: {
      average: "Θ(&Sqrt;n)",
      best: "Ω(1)",
      worst: "O(&Sqrt;n)",
      space: "O(1)",
    },
    code: `import math

def jumpSearch(arr: List[int], length: int, target: int) -> int:
    step = int(math.sqrt(length))
    prev = 0
    while arr[min(step, length) - 1] < target:
        prev = step
        step += int(math.sqrt(length))
        if prev >= length:
            return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, length):
            return -1
    if arr[prev] == target:
        return prev
    return -1`,
  },
  interpolationSearch: {
    title: "Interpolation Search",
    description: `<p><strong>Description:</strong> Interpolation search improves on binary search by calculating the probable position of the target value based on the distribution of values in the array.</p>
    <p><strong>Searches in:</strong> Sorted arrays with uniformly distributed values.</p>
    <p><strong>Advantages:</strong> Faster than binary search for uniformly distributed data under favorable conditions.</p>
    <p><strong>Disadvantages:</strong> Requires sorted input and uniformly distributed values to work effectively.</p>
    <p><strong>Conditions:</strong> Input must be sorted and values must be uniformly distributed; effective for evenly spaced data points.</p>`,
    complexities: {
      average: "Θ(log<sub>2</sub>(log<sub>2</sub> n))",
      best: "Ω(1)",
      worst: "O(n)",
      space: "Recursive: O(log<sub>2</sub> n)<br/>Iterative: O(1)",
    },
    code: `# recursive
def interpolationSearch(arr: List[int], low: int, high: int, target: int) -> int:
    if low <= high and target >= arr[low] and target <= arr[high]:
        pos = low + (((high - low) // (arr[high] - arr[low])) * (target - arr[low]))
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            return interpolationSearch(arr, pos + 1, high, target)
        if arr[pos] > target:
            return interpolationSearch(arr, low, pos - 1, target)
    return -1

# iterative
def interpolationSearch(arr: List[int], length: int, target: int) -> int:
    low = 0
    high = length - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        if low == high:
            if arr[low] == target:
                return low
            return -1
        pos = low + (((high - low) // (arr[high] - arr[low])) * (target - arr[low]))
        if arr[pos] == target:
            return pos
        if arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1`,
  },
};
