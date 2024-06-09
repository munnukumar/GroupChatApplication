const form = document.querySelector("form");
const token = localStorage.getItem("token");
const groupId = localStorage.getItem("groupId");
const groupName = localStorage.getItem("groupName");

async function fetchAllMessages() {
    const memberList = document.getElementById("members");
    const messagesList = document.getElementById("all-messages");
    try {
        const p1 = axios.get(`http://localhost:3000/get-all-messages/${groupId}`, { headers: { "Authorization": token } });
        const p2 = axios.get(`http://localhost:3000/get-all-members/${groupId}`, { headers: { "Authorization": token } });
        const [allMessagesResponse, membersResponse] = await Promise.all([p1, p2]);
        const newMessages = allMessagesResponse.data.message;
        const allMembers = Object.entries(membersResponse.data.message).map(([id, member]) => `<li onclick="deleteUser(${id})" id="${id}">${member}</li>`).join('');
        memberList.innerHTML = allMembers;
        const storedMessages = localStorage.getItem("messages");
        const allMessages = [...newMessages];
        const last10Messages = allMessages.slice(-10);
        let messageContent = '';
        if (storedMessages) {
            JSON.parse(storedMessages).forEach((message) => {
                messageContent += `${message.sender}: ${message.message}\n`;
            });
        }
        else {
            last10Messages.forEach((message) => {
                messageContent += `${message.sender}: ${message.message}\n`;
            });
        }
        messagesList.textContent = messageContent;
        localStorage.setItem("messages", JSON.stringify(last10Messages));
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

async function deleteUser(userId) {
    try {
        await axios.delete(`http://localhost:3000/delete-member/${groupId}/${userId}`, { headers: { "Authorization": token } });
        document.location.reload();
    } catch (err) {
        alert(err.response.data.error);
    }
}

form.addEventListener("submit", async (e) => {
    try {
        e.preventDefault();
        const message = e.target.message.value;
        await axios.post(`http://localhost:3000/send-group-message/${groupId}`, { message }, { headers: { "Authorization": token } });
        document.location.reload();
    }
    catch (err) {
        console.error(err);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const navBar = document.getElementById("nav-bar");
    try {
        if (!token) {
            alert("You are not logged in!");
            document.location.href = "login.html";
        }
        else {
            const li = document.createElement("li");
            li.innerHTML = `<a class="active" href="group.html/${groupId}">${groupName}</a>`;
            navBar.appendChild(li);
            editGroup(navBar);
            fetchAllMessages();
            setInterval(fetchAllMessages, 1000);
        }
    }
    catch (err) {
        console.error(err);
    }
});

async function editGroup(navBar) {
    const membersResponse = await axios.get(`http://localhost:3000/get-all-members/${groupId}`, { headers: { "Authorization": token } });
    if (membersResponse.data.admin) {
        const button = document.createElement("button");
        button.textContent = "Edit Group Settings";
        button.type = "button";
        button.id = "edit-group-settings";
        button.onclick = () => {
            document.getElementById("editGroupDialog").classList.add("active");
            const form = document.getElementById("editGroupForm");
            const groupName = document.getElementById("groupName");
            const allMembers = document.getElementById("allMembers");
            groupName.value = localStorage.getItem("groupName");
            allMembers.value = membersResponse.data.emails;
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const newGroupName = e.target.groupName.value;
                const editGroupMember = e.target.allMembers.value.split(",");
        
                try {
                    await axios.put(`http://localhost:3000/edit-group/${groupId}`, { name: newGroupName,editGroupMember: editGroupMember }, { headers: { "Authorization": token } });
                    window.location.href = "single-group.html";
                } catch (err) {
                    alert(err.response.data.error);
                }
            });
        }
        navBar.appendChild(button);
    }
}

document.getElementById("close").addEventListener("click", () => {
    document.getElementById("editGroupDialog").classList.remove("active");
});

document.getElementById("delete-group").addEventListener("click", async () => {
    try {
        await axios.delete(`http://localhost:3000/delete-group/${groupId}`, { headers: { "Authorization": token } });
        window.location.href = "groups.html";
    } catch (err) {
        alert(err.response.data.error);
    }
});