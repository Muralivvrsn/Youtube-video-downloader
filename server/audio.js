const ytdl = require('ytdl-core');
const fs = require('fs');


const videoUrl = 'https://youtu.be/dC7V42KgWcc'; // Replace <VIDEO_ID> with the actual YouTube video ID
const downloadOptions = {
  quality: 'highest',
};

ytdl(videoUrl, downloadOptions)
  .pipe(fs.createWriteStream('output.mp4')) // Replace <DOWNLOAD_PATH> with the desired download path
  .on('finish', () => {
    console.log('Video downloaded successfully!');
  })
  .on('error', (error) => {
    console.error('Error downloading video:', error);
  });
