require('dotenv').config({silent : true});
const fs = require('fs');

const debug = require('debug')('index');
const argv = require('yargs').argv
const tone = require('tonegenerator');
const waveheader = require('waveheader');

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
		output = output.concat(tone(frequencies[char], toneLength, tone.MAX_8));
	});

	return {
		data : output,
		chars : words
	};

}

function createBufferFromToneArrays(data){

	const header = waveheader(data.length, {
		bitDepth: 8
	});

	const rawData = Buffer.from( Uint8Array.from( data, function (val) {
		return val + 128;
	}) );

	const buffer = Buffer.concat( [ header, rawData ] );

	return buffer;

}

function writePCMDataToFile(data, filename){

	const file = fs.createWriteStream(`./${ argv.output || filename}.wav`);
	
	file.write(data);
	file.end();

}

function convertCharactersToPCMAndReturnBuffer(characters){

	const a = createBufferFromToneArrays( generatePCMForCharacters(characters).data );
	return a;

}

module.exports = {
	generate : convertCharactersToPCMAndReturnBuffer
};
