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

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved: ${outputPath} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB, ${(samples.length / sampleRate).toFixed(1)}s)`);
}

const inputWav = 'D:/cannogauniversity/public/images/kammah.wav';
const wavBuffer = fs.readFileSync(inputWav);
const { fmt, dataOffset, dataLength } = parseWav(wavBuffer);

const bytesPerSample = fmt.bitsPerSample / 8;
const bytesPerFrame = fmt.channels * bytesPerSample;
const totalFrames = Math.floor(dataLength / bytesPerFrame);
const sr = fmt.sampleRate;

const mono16Samples = new Int16Array(totalFrames);
for (let i = 0; i < totalFrames; i++) {
  const frameOffset = dataOffset + i * bytesPerFrame;
  let left = 0;
  let right = 0;

  if (fmt.bitsPerSample === 24) {
    const b0 = wavBuffer[frameOffset];
    const b1 = wavBuffer[frameOffset + 1];
    const b2 = wavBuffer[frameOffset + 2];
    let valL = (b2 << 24) | (b1 << 16) | (b0 << 8);
    left = valL >> 16;

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

// Create 15s and 20s clips for Hugging Face free tier limit
const segmentDurations = [15, 20];
for (const dur of segmentDurations) {
  const clip = mono16Samples.subarray(0, Math.min(mono16Samples.length, dur * sr));
  writeWavFile(`D:/cannogauniversity/public/images/kammah_${dur}s.wav`, sr, 1, 16, clip);
}

// Also create 10-second parts for full coverage if needed
const partDuration = 15;
let partIdx = 1;
for (let start = 0; start < totalFrames; start += partDuration * sr) {
  const end = Math.min(totalFrames, start + partDuration * sr);
  const partSamples = mono16Samples.subarray(start, end);
  writeWavFile(`D:/cannogauniversity/public/images/kammah_clip${partIdx}_15s.wav`, sr, 1, 16, partSamples);
  partIdx++;
}
