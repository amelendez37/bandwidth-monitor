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

function getIsDownload(packet, [ips]) {
  // console.log(packet);
  // 1. need to spin up process that runs `curl -6 icanhazip.com` (done)
  // 2. store the return value from above into a variable, this will be external ip receiving incoming packets (done)
  // 3. use external ip to analyze packets
  // can look to filter tcpdump traffic based on specific destination and source as well with src and dst argumens
  console.log("!!!: ", packet.split(">")[1]);
  return packet.split(">")[1].includes(externalIP);
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
