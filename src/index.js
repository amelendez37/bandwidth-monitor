// using child-process module spawn function to spin up process to execute tcpdump command
// process can run `sudo tcpdump -i en0 'tcp or udp'`
// see if upload/download can be displayed in real time?
// parse out lengh value from command output and add up.
// upload data = when source ip is my machine
// download data = when source ip is from ip other than mine
// display

const { spawn } = require("child_process");
// no longer throwing error, but no output
const child = spawn("sudo", ["tcpdump", "-i", "en0", "tcp", "or", "udp"]);

child.stdout.on("data", (data) => {
  console.log(data);
});
