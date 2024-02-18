// using child-process module spawn function to spin up process to execute tcpdump command
// process can run `sudo tcpdump -i en0 'tcp or udp'`
// see if upload/download can be displayed in real time?
// parse out lengh value from command output and add up.
// upload data = when source ip is my machine
// download data = when source ip is from ip other than mine
// display
// sudo visudo, remove last line

const { spawn } = require("child_process");
// no longer throwing error, but no output
const child = spawn("sudo", ["tcpdump", "-i", "en0", "tcp", "or", "udp"]);
let upload = 0;
let download = 0;

function getIsDownload(packet) {
  return packet.split(">")[1].includes("aarons-mbp");
}

function getLength(packet) {
  const lenAsString = packet.split("length")[1].trim();
  return parseInt(lenAsString);
}

child.stdout.on("data", (data) => {
  const tcpdumpOutput = data.toString();

  if (getIsDownload(tcpdumpOutput)) {
    download += getLength(tcpdumpOutput);
  } else {
    upload += getLength(tcpdumpOutput);
  }
  // we are now summing download and upload. Look for a way to save this and show it on the console
  console.log("download: ", download);
  console.log("upload: ", upload);
});
