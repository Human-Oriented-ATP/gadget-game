class BitSet {
  private data: bigint = 0n;

  setRange(start: number, end: number): void {
    const mask = ((1n << BigInt(end - start + 1)) - 1n) << BigInt(start);
    this.data |= mask;
  }
  
  intersects(start: number, end: number): boolean {
    const mask = ((1n << BigInt(end - start + 1)) - 1n) << BigInt(start);
    return (this.data & mask) !== 0n;
  }
}

/// Structure to find minimum rank which is 
/// not already occupied by any value in 
/// an inclusive integer range
export class RankAllocator {

  private channels: BitSet[] = [];

  allocate(start: number, end: number, minRank: number = 0): number {
    if (end < start) {
      const oldStart = start; 
      start = end; 
      end = oldStart;
    }

    for (let i = minRank; i < this.channels.length; i++) {
      if (!this.channels[i].intersects(start, end)) {
        this.channels[i].setRange(start, end);
        return i;
      }
    }

    // All channels were full. Create a new one.
    const emptyChannelsRequired = minRank - this.channels.length;
    for (let i = 0; i < emptyChannelsRequired; i++) {
      this.channels.push(new BitSet());
    }
  

    const newChannel = new BitSet();
    newChannel.setRange(start, end);
    this.channels.push(newChannel);
    return this.channels.length - 1;
  }
}