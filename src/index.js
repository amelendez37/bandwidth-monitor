const { spawn } = require("child_process");

const icanhazipProcess = spawn("curl", ["-6", "icanhazip.com"]);
const ipconfigProcess = spawn("ipconfig", ["getifaddr", "en0"]);
const tcpDumpProcess = spawn("sudo", [
  "tcpdump",
  "-i",
  "en0",
  "-n",
  "tcp",
  "or",
  "udp",
]);

let upload = 0;
let download = 0;
let exip;
let ip;

function getIsDownload(packet, ips) {
  const destinationIP = packet.match(/> (\w*:*)*/)[0].slice(2);
  return ips.includes(destinationIP);
}

function getLength(packet) {
  const lenAsString = packet.split("length")[1].trim();
  return parseInt(lenAsString);
}

icanhazipProcess.stdout.on("data", (data) => {
  exip = data.toString();
});

ipconfigProcess.stdout.on("data", (data) => {
  ip = data.toString();
});

tcpDumpProcess.stdout.on("data", (data) => {
  if (!exip || !ip) {
    return;
  }

  const tcpdumpOutput = data.toString();
  const len = getLength(tcpdumpOutput);
  if (!len) {
    return;
  }
  if (getIsDownload(tcpdumpOutput, [exip, ip])) {
    console.log("download: ", len);
    download += len;
  } else {
    console.log("upload: ", len);
    upload += len;
  }
});

process.on("SIGINT", () => {
  const oneMillion = 1000000;
  console.log("download (megabits): ", Math.ceil((download * 8) / oneMillion));
  console.log("upload: (megabits)", Math.ceil((upload * 8) / oneMillion));
  process.exit(0);
});
