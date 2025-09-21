// Huffman Compression Algorithm Implementation
// Ported from the original JavaScript implementation

class MinHeap {
  private heap_array: Array<[number, any]> = [];

  size(): number {
    return this.heap_array.length;
  }

  empty(): boolean {
    return this.size() === 0;
  }

  push(value: [number, any]): void {
    this.heap_array.push(value);
    this.up_heapify();
  }

  private up_heapify(): void {
    let current_index = this.size() - 1;
    while (current_index > 0) {
      const current_element = this.heap_array[current_index];
      const parent_index = Math.trunc((current_index - 1) / 2);
      const parent_element = this.heap_array[parent_index];

      if (parent_element[0] < current_element[0]) {
        break;
      } else {
        this.heap_array[parent_index] = current_element;
        this.heap_array[current_index] = parent_element;
        current_index = parent_index;
      }
    }
  }

  top(): [number, any] {
    return this.heap_array[0];
  }

  pop(): void {
    if (!this.empty()) {
      const last_index = this.size() - 1;
      this.heap_array[0] = this.heap_array[last_index];
      this.heap_array.pop();
      this.down_heapify();
    }
  }

  private down_heapify(): void {
    let current_index = 0;
    const current_element = this.heap_array[0];
    
    while (current_index < this.size()) {
      const child_index1 = (current_index * 2) + 1;
      const child_index2 = (current_index * 2) + 2;
      
      if (child_index1 >= this.size() && child_index2 >= this.size()) {
        break;
      } else if (child_index2 >= this.size()) {
        const child_element1 = this.heap_array[child_index1];
        if (current_element[0] < child_element1[0]) {
          break;
        } else {
          this.heap_array[child_index1] = current_element;
          this.heap_array[current_index] = child_element1;
          current_index = child_index1;
        }
      } else {
        const child_element1 = this.heap_array[child_index1];
        const child_element2 = this.heap_array[child_index2];
        
        if (current_element[0] < child_element1[0] && current_element[0] < child_element2[0]) {
          break;
        } else {
          if (child_element1[0] < child_element2[0]) {
            this.heap_array[child_index1] = current_element;
            this.heap_array[current_index] = child_element1;
            current_index = child_index1;
          } else {
            this.heap_array[child_index2] = current_element;
            this.heap_array[current_index] = child_element2;
            current_index = child_index2;
          }
        }
      }
    }
  }
}

export interface CompressionResult {
  data: string;
  message: string;
  compressionRatio: number;
  originalSize: number;
  compressedSize: number;
}

export class HuffmanCodec {
  private heap!: MinHeap;
  private codes: Record<string, string> = {};
  private index: number = 0;

  private getCodes(node: any, curr_code: string): void {
    if (typeof node[1] === "string") {
      this.codes[node[1]] = curr_code;
      return;
    }
    this.getCodes(node[1][0], curr_code + '0');
    this.getCodes(node[1][1], curr_code + '1');
  }

  private make_string(node: any): string {
    if (typeof node[1] === "string") {
      return "'" + node[1];
    }
    return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
  }

  private make_tree(tree_string: string): any {
    const node: any = [];
    if (tree_string[this.index] === "'") {
      this.index++;
      node.push(tree_string[this.index]);
      this.index++;
      return node;
    }
    this.index++;
    node.push(this.make_tree(tree_string));
    this.index++;
    node.push(this.make_tree(tree_string));
    return node;
  }

  encode(data: string): CompressionResult {
    this.heap = new MinHeap();
    const mp = new Map<string, number>();

    // Count character frequencies
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      mp.set(char, (mp.get(char) || 0) + 1);
    }

    // Handle edge cases
    if (mp.size === 0) {
      const final_string = "zer#";
      return {
        data: final_string,
        message: "Compression complete! Empty file processed.",
        compressionRatio: data.length / final_string.length,
        originalSize: data.length,
        compressedSize: final_string.length
      };
    }

    if (mp.size === 1) {
      const [key, value] = Array.from(mp.entries())[0];
      const final_string = "one" + '#' + key + '#' + value.toString();
      return {
        data: final_string,
        message: "Compression complete! Single character file processed.",
        compressionRatio: data.length / final_string.length,
        originalSize: data.length,
        compressedSize: final_string.length
      };
    }

    // Build Huffman tree
    for (const [key, value] of mp) {
      this.heap.push([value, key]);
    }

    while (this.heap.size() >= 2) {
      const min_node1 = this.heap.top();
      this.heap.pop();
      const min_node2 = this.heap.top();
      this.heap.pop();
      this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
    }

    const huffman_tree = this.heap.top();
    this.heap.pop();
    this.codes = {};
    this.getCodes(huffman_tree, "");

    // Encode data
    let binary_string = "";
    for (let i = 0; i < data.length; i++) {
      binary_string += this.codes[data[i]];
    }

    const padding_length = (8 - (binary_string.length % 8)) % 8;
    for (let i = 0; i < padding_length; i++) {
      binary_string += '0';
    }

    let encoded_data = "";
    for (let i = 0; i < binary_string.length;) {
      let curr_num = 0;
      for (let j = 0; j < 8; j++, i++) {
        curr_num *= 2;
        curr_num += parseInt(binary_string[i]);
      }
      encoded_data += String.fromCharCode(curr_num);
    }

    const tree_string = this.make_string(huffman_tree);
    const ts_length = tree_string.length;
    const final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;

    return {
      data: final_string,
      message: "Compression completed successfully!",
      compressionRatio: data.length / final_string.length,
      originalSize: data.length,
      compressedSize: final_string.length
    };
  }

  decode(data: string): CompressionResult {
    let k = 0;
    let temp = "";
    
    // Extract metadata
    while (k < data.length && data[k] !== '#') {
      temp += data[k];
      k++;
    }

    if (k === data.length) {
      throw new Error("Invalid compressed file format!");
    }

    // Handle special cases
    if (temp === "zer") {
      return {
        data: "",
        message: "Decompression completed successfully!",
        compressionRatio: 1,
        originalSize: 0,
        compressedSize: data.length
      };
    }

    if (temp === "one") {
      data = data.slice(k + 1);
      k = 0;
      temp = "";
      while (data[k] !== '#') {
        temp += data[k];
        k++;
      }
      const one_char = temp;
      data = data.slice(k + 1);
      const str_len = parseInt(data);
      let decoded_data = "";
      for (let i = 0; i < str_len; i++) {
        decoded_data += one_char;
      }
      return {
        data: decoded_data,
        message: "Decompression completed successfully!",
        compressionRatio: 1,
        originalSize: decoded_data.length,
        compressedSize: data.length
      };
    }

    // Regular decompression
    data = data.slice(k + 1);
    const ts_length = parseInt(temp);
    k = 0;
    temp = "";
    
    while (data[k] !== '#') {
      temp += data[k];
      k++;
    }
    
    data = data.slice(k + 1);
    const padding_length = parseInt(temp);
    temp = "";
    
    for (k = 0; k < ts_length; k++) {
      temp += data[k];
    }
    
    data = data.slice(k);
    const tree_string = temp;
    const encoded_data = data;
    
    this.index = 0;
    const huffman_tree = this.make_tree(tree_string);

    // Decode binary data
    let binary_string = "";
    for (let i = 0; i < encoded_data.length; i++) {
      const curr_num = encoded_data.charCodeAt(i);
      let curr_binary = "";
      for (let j = 7; j >= 0; j--) {
        const foo = curr_num >> j;
        curr_binary = curr_binary + (foo & 1);
      }
      binary_string += curr_binary;
    }
    
    binary_string = binary_string.slice(0, -padding_length);
    let decoded_data = "";
    let node = huffman_tree;
    
    for (let i = 0; i < binary_string.length; i++) {
      if (binary_string[i] === '1') {
        node = node[1];
      } else {
        node = node[0];
      }

      if (typeof node[0] === "string") {
        decoded_data += node[0];
        node = huffman_tree;
      }
    }

    return {
      data: decoded_data,
      message: "Decompression completed successfully!",
      compressionRatio: 1,
      originalSize: decoded_data.length,
      compressedSize: data.length
    };
  }
}

export const downloadFile = (fileName: string, text: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};