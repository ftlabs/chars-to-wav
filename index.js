require('dotenv').config({silent : true});
const fs = require('fs');

const debug = require('debug')('index');
const tone = require('tonegenerator');
const waveheader = require('waveheader');

const file = fs.createWriteStream('./output.wav')
// const samples = [];

const offset = 100;
const increment = 50;
const toneLength = 0.1;
const characters = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const frequencies = {};

characters.split('').forEach( (char, idx) => {
	frequencies[char] = offset + (increment * idx);
});

function generatePCMForCharacters(words){

	let output = [];

	words.split('').forEach(char => {
		debug(char)
		output = output.concat(tone(frequencies[char], toneLength, tone.MAX_8));
	});

	return output;

}

const PCMData = generatePCMForCharacters('Sean M Tracey');

file.write(waveheader(PCMData.length, {
  bitDepth: 8
}));

const rawData = Uint8Array.from(PCMData, function (val) {
	return val + 128
});

let buffer;

if (Buffer.from) { // Node 5+ 
	buffer = Buffer.from(rawData)
} else {
	buffer = new Buffer(rawData)
}

file.write(buffer)
file.end();