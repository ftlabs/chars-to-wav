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
		debug(char)
		output = output.concat(tone(frequencies[char], toneLength, tone.MAX_8));
	});

	return {
		data : output,
		chars : words
	};

}

function writePCMDataToFile(data, filename){

	const file = fs.createWriteStream(`./${ argv.output || filename}.wav`);
	
	file.write(waveheader(data.length, {
		bitDepth: 8
	}));

	const rawData = Uint8Array.from(data, function (val) {
		return val + 128;
	});

	let buffer;

	if (Buffer.from) {
		buffer = Buffer.from(rawData)
	} else {
		buffer = new Buffer(rawData)
	}

	file.write(buffer)
	file.end();
}

const stringToConvert = argv.phrase;

if(stringToConvert){

	const PCMData = generatePCMForCharacters(stringToConvert);
	writePCMDataToFile(PCMData.data, PCMData.chars);

} else {
	debug('No phrase passed to convert. Exiting...');
	process.exit();
}
