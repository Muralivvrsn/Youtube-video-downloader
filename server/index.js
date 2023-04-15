const dotenv = require("dotenv").config();
// const fs = require("fs");
// const FormData = require("form-data");
// const path = require("path");
// const axios = require("axios");
// const split2 = require("split2");

// const OPEN_API_KEY = process.env.OPEN_API_KEY;
// const CHUNK_SIZE = 1 * 1024 * 1024; // 5 MB chunk size (adjust as needed)
// const filePath = path.join(__dirname, "output.mp3");
// const model = "whisper-1";

// // Create a readable stream from the file using split2 to split it into chunks
// const fileStream = fs
//   .createReadStream(filePath)
//   .pipe(split2(null, { chunkSize: CHUNK_SIZE }));

// // Define a function to send each chunk as a separate request
// const sendChunk = async (formData, chunk) => {
//   console.log("started recieve chunk");
//   return new Promise((resolve, reject) => {
//     formData.append("file", chunk);
//     console.log(formData);
//     axios
//       .post("https://api.openai.com/v1/audio/transcriptions", formData, {
//         headers: {
//           Authorization: `Bearer ${OPEN_API_KEY}`,
//           "Content-Type": `multipart/form-data`,
//         },
//       })
//       .then((response) => {
//         console.log("response");
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // Define an async function to send all the chunks sequentially
// const sendChunks = async () => {
//   console.log("Starting chunked upload...");
//   const formData = new FormData();
//   formData.append("model", model);
//   for await (const chunk of fileStream) {
//     try {
//       console.log("befor try");
//       const response = await sendChunk(formData, chunk);
//       console.log("after try");
//       console.log(response);
//       // Handle the response as needed
//     } catch (error) {
//       console.log("error bro");
//     }
//   }

//   console.log("Chunked upload completed!");
// };

// sendChunks();

// const dotenv = require("dotenv").config();
// const fs = require("fs");
// const FormData = require("form-data");
// const path = require("path");
// const axios = require("axios");
// const ytdl = require("ytdl-core");
// const zlib = require("zlib");
// const split2 = require("split2");

// const OPEN_API_KEY = process.env.OPEN_API_KEY;

// const filePath = path.join(__dirname, "output.mp3");
// const model = "whisper-1";

// const formData = new FormData();
// formData.append("model", model);
// formData.append("file", fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(split2()));

// const response = async () => {
//   console.log("I'm started");
//   console.log(formData)
//   await axios
//     .post("https://api.openai.com/v1/audio/transcriptions", formData, {
//       headers: {
//         Authorization: `Bearer ${OPEN_API_KEY}`,
//         "Content-Type": `multipart/form-data`,
//       },
//     })
//     .then((response) => {
//       console.log(response.data.slice(0, 100));
//       fs.writeFile("data.txt", response.data, function (err) {
//         if (err) {
//           throw err;
//         }
//         console.log("finished creating file");
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//     console.log("i'm ended");
// };

// response();


const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const apiKey = process.env.OPEN_API_KEY; // Replace with your OpenAI API key
console.log(apiKey)
const file = fs.readFileSync('output.mp3'); // Read the audio file to be sent
const chunkSize = 1024 * 1024; // Set the chunk size in bytes (e.g., 1 MB)
const totalChunks = Math.ceil(file.length / chunkSize); // Calculate total number of chunks
let currentChunk = 0; // Initialize current chunk counter

// Define a function to send a chunk and recursively call itself until all chunks are sent
const sendChunk = async () => {
  if (currentChunk < totalChunks) {
    const start = currentChunk * chunkSize; // Calculate start index of chunk
    const end = Math.min((currentChunk + 1) * chunkSize, file.length); // Calculate end index of chunk
    const chunkData = file.slice(start, end); // Extract chunk data

    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append('audio', chunkData, {filename: 'output.mp3'}); // Append the chunk data to the FormData object

      // Send the chunk to the Whisper ASR API using Axios
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          "Content-Type": `multipart/form-data`,
        }
      });

      // Handle the response from the Whisper ASR API
      console.log(`Chunk ${currentChunk + 1} of ${totalChunks} sent successfully.`);
      console.log(response.data); // Retrieve response data
      currentChunk++; // Increment the current chunk counter
      sendChunk(); // Send the next chunk
    } catch (error) {
      console.error(`Error sending chunk ${currentChunk + 1}:`, error);
    }
  } else {
    console.log('All chunks sent successfully.'); // All chunks sent, exit the function
  }
};

sendChunk(); // Start sending the chunks

