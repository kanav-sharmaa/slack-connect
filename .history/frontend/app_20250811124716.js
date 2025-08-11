const backendURL = "https://9070a5664ea8.ngrok-free.app";

const connectBtn = document.getElementById("connect-btn");
const appDiv = document.getElementById("app");
const channelSelect = document.getElementById("channel-select");
const messageText = document.getElementById("message-text");
const sendNowBtn = document.getElementById("send-now-btn");
const scheduleBtn = document.getElementById("schedule-btn");
const scheduleSection = document.getElementById("schedule-section");
const scheduleDatetime = document.getElementById("schedule-datetime");
const confirmScheduleBtn = document.getElementById("confirm-schedule-btn");
const cancelScheduleBtn = document.getElementById("cancel-schedule-btn");
const scheduledList = document.getElementById("scheduled-list");
const statusDiv = document.getElementById("status");

let channels = [];

connectBtn.addEventListener("click", () => {
    window.location.href = `${backendURL}/slack/connect`;
});

async function fetchChannels() {
    try {
        const res = await fetch(`${backendURL}/slack/channels`);
        if (res.ok) {
            channels = await res.json();
            populateChannels();
        } else {
            const error = await res.json();
            showStatus("Error fetching channels: " + (error.error || "Unknown"), true);
            // Fall back to demo channels if API fails
            channels = [
                { id: "general", name: "general" },
                { id: "random", name: "random" },
            ];
            populateChannels();
        }
    } catch (err) {
        showStatus("Error fetching channels: " + err.message, true);
        // Fall back to demo channels if API fails
        channels = [
            { id: "general", name: "general" },
            { id: "random", name: "random" },
        ];
        populateChannels();
    }
}

function populateChannels() {
    channelSelect.innerHTML = "";
    channels.forEach(ch => {
        const option = document.createElement("option");
        option.value = ch.id;
        option.textContent = ch.name;
        channelSelect.appendChild(option);
    });
}

sendNowBtn.addEventListener("click", async () => {
    const channel = channelSelect.value;
    const text = messageText.value.trim();

    if (!text) {
        showStatus("Message cannot be empty", true);
        return;
    }

    showStatus("Sending message...");

    try {
        const res = await fetch(`${backendURL}/slack/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel, text }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
            showStatus("Message sent successfully!");
            messageText.value = "";
            fetchScheduledMessages();
        } else {
            showStatus("Error sending message: " + (data.error || "Unknown"), true);
        }
    } catch (err) {
        showStatus("Error sending message: " + err.message, true);
    }
});

scheduleBtn.addEventListener("click", () => {
    scheduleSection.style.display = "block";
});

cancelScheduleBtn.addEventListener("click", () => {
    scheduleSection.style.display = "none";
    scheduleDatetime.value = "";
});

confirmScheduleBtn.addEventListener("click", async () => {
    const channel = channelSelect.value;
    const text = messageText.value.trim();
    const sendAtStr = scheduleDatetime.value;

    if (!text) {
        showStatus("Message cannot be empty", true);
        return;
    }
    if (!sendAtStr) {
        showStatus("Please select a valid date and time", true);
        return;
    }

    const sendAt = new Date(sendAtStr).getTime();
    if (sendAt <= Date.now()) {
        showStatus("Scheduled time must be in the future", true);
        return;
    }

    showStatus("Scheduling message...");

    try {
        const res = await fetch(`${backendURL}/slack/schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channel, text, send_at: sendAt }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
            showStatus("Message scheduled successfully!");
            messageText.value = "";
            scheduleDatetime.value = "";
            scheduleSection.style.display = "none";
            fetchScheduledMessages();
        } else {
            showStatus("Error scheduling message: " + (data.error || "Unknown"), true);
        }
    } catch (err) {
        showStatus("Error scheduling message: " + err.message, true);
    }
});

async function fetchScheduledMessages() {
    try {
        const res = await fetch(`${backendURL}/slack/scheduled`);
        if (res.ok) {
            const data = await res.json();
            renderScheduledMessages(data);
        } else {
            const error = await res.json();
            showStatus("Error fetching scheduled messages: " + (error.error || "Unknown"), true);
        }
    } catch (err) {
        showStatus("Error fetching scheduled messages: " + err.message, true);
    }
}

function renderScheduledMessages(messages) {
    scheduledList.innerHTML = "";
    if (messages.length === 0) {
        scheduledList.textContent = "No scheduled messages.";
        return;
    }
    messages.forEach(msg => {
        const li = document.createElement("li");
        const textSpan = document.createElement("span");
        
        // Find channel name from channels array
        const channelName = channels.find(ch => ch.id === msg.channel)?.name || msg.channel;
        textSpan.textContent = `[${new Date(msg.send_at).toLocaleString()}] #${channelName}: ${msg.text}`;

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", async () => {
            try {
                const res = await fetch(`${backendURL}/slack/scheduled/${msg.id}`, { method: "DELETE" });
                const data = await res.json();
                if (res.ok && data.success) {
                    showStatus("Scheduled message cancelled");
                    fetchScheduledMessages();
                } else {
                    showStatus("Error cancelling message: " + (data.error || "Unknown"), true);
                }
            } catch (err) {
                showStatus("Error cancelling message: " + err.message, true);
            }
        });

        li.appendChild(textSpan);
        li.appendChild(cancelBtn);
        scheduledList.appendChild(li);
    });
}

function showStatus(msg, isError = false) {
    statusDiv.textContent = msg;
    statusDiv.style.color = isError ? "red" : "green";
}

async function checkIfConnected() {
    try {
        // Try to fetch scheduled messages to check if we're connected
        const res = await fetch(`${backendURL}/slack/scheduled`);
        if (res.ok) {
            // We're connected, show the app
            appDiv.style.display = "block";
            connectBtn.style.display = "none";
            await fetchChannels();
            await fetchScheduledMessages();
        } else {
            // Not connected, show connect button
            appDiv.style.display = "none";
            connectBtn.style.display = "block";
        }
    } catch (err) {
        // Connection error, show connect button
        appDiv.style.display = "none";
        connectBtn.style.display = "block";
        showStatus("Backend not available. Please start the backend server.", true);
    }
}

window.onload = checkIfConnected;
