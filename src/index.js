const { spawn } = require("child_process");

const child = spawn("sudo", ["tcpdump", "-i", "any", "tcp", "or", "udp"]);

let upload = 0;
let download = 0;

function getIsDownload(packet) {
  console.log(packet);
  // todo: this is wrong. Checking for aarons-mbp isn't working
  // 2603-8000-ca00-9379-6d74-a7c1-8752-d9ae.res6.spectrum.com.60934, see if terminal command can be used to ping for IPv6 address
  return packet.split(">")[1].includes("aarons-mbp");
}

function getLength(packet) {
  const lenAsString = packet.split("length")[1].trim();
  return parseInt(lenAsString);
}

child.stdout.on("data", (data) => {
  const tcpdumpOutput = data.toString();
  const len = getLength(tcpdumpOutput);
  if (!len) {
    return;
  }
  if (getIsDownload(tcpdumpOutput)) {
    download += len;
  } else {
    upload += len;
  }
});

process.on("SIGINT", () => {
  const oneMillion = 1000000;
  console.log("download (megabits): ", Math.ceil((download * 8) / oneMillion));
  console.log("upload: (megabits)", Math.ceil((upload * 8) / oneMillion));
  process.exit(0);
});
