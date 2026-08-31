const fs = require('fs');

function parseWav(buffer) {
  let offset = 12;
  let fmt = null;
  let dataOffset = 0;
  let dataLength = 0;

  while (offset < buffer.length) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    if (chunkId === 'fmt ') {
      fmt = {
        format: buffer.readUInt16LE(offset + 8),
        channels: buffer.readUInt16LE(offset + 10),
        sampleRate: buffer.readUInt32LE(offset + 12),
        byteRate: buffer.readUInt32LE(offset + 16),
        blockAlign: buffer.readUInt16LE(offset + 20),
        bitsPerSample: buffer.readUInt16LE(offset + 22),
      };
    } else if (chunkId === 'data') {
      dataOffset = offset + 8;
      dataLength = chunkSize;
      break;
    }
    offset += 8 + chunkSize;
  }

  return { fmt, dataOffset, dataLength };
}

function writeWavFile(outputPath, sampleRate, numChannels, bitsPerSample, samples) {
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20);  // AudioFormat 1 = PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples (16-bit signed integer)
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved: ${outputPath} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
}

const inputWav = 'D:/cannogauniversity/public/images/kammah.wav';
const wavBuffer = fs.readFileSync(inputWav);
const { fmt, dataOffset, dataLength } = parseWav(wavBuffer);
console.log('Original WAV Format:', fmt);

const bytesPerSample = fmt.bitsPerSample / 8;
const bytesPerFrame = fmt.channels * bytesPerSample;
const totalFrames = Math.floor(dataLength / bytesPerFrame);
console.log('Total Frames:', totalFrames, 'Duration:', (totalFrames / fmt.sampleRate).toFixed(2), 'seconds');

// Extract into 16-bit mono
const mono16Samples = new Int16Array(totalFrames);
for (let i = 0; i < totalFrames; i++) {
  const frameOffset = dataOffset + i * bytesPerFrame;
  let left = 0;
  let right = 0;

  if (fmt.bitsPerSample === 24) {
    // 24-bit signed int -> read 3 bytes
    const b0 = wavBuffer[frameOffset];
    const b1 = wavBuffer[frameOffset + 1];
    const b2 = wavBuffer[frameOffset + 2];
    let valL = (b2 << 24) | (b1 << 16) | (b0 << 8); // shift into 32-bit signed
    left = valL >> 16; // convert to 16-bit

    if (fmt.channels > 1) {
      const rb0 = wavBuffer[frameOffset + 3];
      const rb1 = wavBuffer[frameOffset + 4];
      const rb2 = wavBuffer[frameOffset + 5];
      let valR = (rb2 << 24) | (rb1 << 16) | (rb0 << 8);
      right = valR >> 16;
    } else {
      right = left;
    }
  } else if (fmt.bitsPerSample === 16) {
    left = wavBuffer.readInt16LE(frameOffset);
    right = fmt.channels > 1 ? wavBuffer.readInt16LE(frameOffset + 2) : left;
  }

  mono16Samples[i] = Math.round((left + right) / 2);
}

// 1. Save compressed 16-bit 44.1kHz Mono WAV (Full audio, ~9 MB instead of 28 MB)
writeWavFile('D:/cannogauniversity/public/images/kammah_compressed.wav', fmt.sampleRate, 1, 16, mono16Samples);

// 2. Save 30-second and 60-second chunks (in case Hedra requires <= 30s or <= 60s per clip)
const sr = fmt.sampleRate;
const clip60_1 = mono16Samples.subarray(0, Math.min(mono16Samples.length, 60 * sr));
writeWavFile('D:/cannogauniversity/public/images/kammah_part1_60s.wav', sr, 1, 16, clip60_1);

if (mono16Samples.length > 60 * sr) {
  const clip60_2 = mono16Samples.subarray(60 * sr, Math.min(mono16Samples.length, 120 * sr));
  writeWavFile('D:/cannogauniversity/public/images/kammah_part2_60s.wav', sr, 1, 16, clip60_2);
}

if (mono16Samples.length > 120 * sr) {
  const clip60_3 = mono16Samples.subarray(120 * sr);
  writeWavFile('D:/cannogauniversity/public/images/kammah_part3_end.wav', sr, 1, 16, clip60_3);
}
