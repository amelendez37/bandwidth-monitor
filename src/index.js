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

child.stdout.on("data", (data) => {
  console.log(data.toString());
  const tcpdumpOutput = data.toString();
  upload += getUploadLength(tcpdumpOutput);
  download += getDownloadLength(tcpdumpOutput);
});

// on exit of process show totalled upload and download
