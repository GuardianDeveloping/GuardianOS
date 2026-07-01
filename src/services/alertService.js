const clients = new Set();

const alertQueue = [];
let processing = false;

function addClient(res) {
  clients.add(res);
}

function removeClient(res) {
  clients.delete(res);
}


function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    client.write(payload);
  }
}

function sendAlert(alert) {
  const fullAlert = {
    type: alert.type || "follow",
    name: alert.name || "GuardianKnight42",
    amount: alert.amount || "",
    message: alert.message || "",
    time: Date.now()
  };

  alertQueue.push(fullAlert);

  processQueue();

  return fullAlert;
}

async function processQueue() {
  if (processing) return;

  processing = true;

  while (alertQueue.length > 0) {
    const alert = alertQueue.shift();

    broadcast("alert", alert);

    // Wait for the overlay animation to finish
    await new Promise(resolve => setTimeout(resolve, 5000));
  }




  processing = false;
}

  function getStatus() {
  return {
    processing,
    queueLength: alertQueue.length
  };
}



module.exports = {
  addClient,
  removeClient,
  broadcast,
  sendAlert,
  getStatus
};