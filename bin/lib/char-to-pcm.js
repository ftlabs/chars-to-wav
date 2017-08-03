const debug = require('debug')('bin:lib:char-to-pcm');
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

	const rawData = Buffer.from( Uint8Array.from( data, function (val) {
		return val + 128;
	}) );

	const buffer = Buffer.from(rawData);

	return buffer;

}

function generateWAVFile(PCMData){

	const header = waveheader(PCMData.length, {
		bitDepth: 8
	});

	return Buffer.concat( [ header, PCMData ] );

}

function convertCharactersToPCMAndReturnBuffer(characters){
	return createBufferFromToneArrays( generatePCMForCharacters(characters).data );
}

function createWAVFileFromCharacters(characters){
	return generateWAVFile(convertCharactersToPCMAndReturnBuffer(characters));
}

module.exports = {
	generate : convertCharactersToPCMAndReturnBuffer,
	wav : createWAVFileFromCharacters
};