const API = "/api/clubs";

const form = document.getElementById("clubForm");
const table = document.getElementById("clubTable");
const message = document.getElementById("message");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const count = document.getElementById("count");

let editingId = null;

const fields = [
  "name",
  "category",
  "description",
  "meeting_day",
  "president",
  "contact_email"
];

function makeCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value ?? "";
  return cell;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

async function loadClubs() {
  try {
    const clubs = await request(API);
    table.replaceChildren();
    count.textContent = `Total clubs: ${clubs.length}`;

    clubs.forEach(club => {
      const row = document.createElement("tr");
      row.appendChild(makeCell(club.id));
      fields.forEach(field => row.appendChild(makeCell(club[field])));

      const actionCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "actions";

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editClub(club));

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";
      deleteButton.addEventListener("click", () => deleteClub(club.id));

      actions.append(editButton, deleteButton);
      actionCell.appendChild(actions);
      row.appendChild(actionCell);
      table.appendChild(row);
    });
  } catch (error) {
    message.textContent = error.message;
  }
}

function editClub(club) {
  editingId = club.id;
  fields.forEach(field => {
    form.elements[field].value = club[field] ?? "";
  });
  formTitle.textContent = `Edit Club #${club.id}`;
  saveButton.textContent = "Save Changes";
  cancelButton.hidden = false;
  message.textContent = "Edit the fields and save your changes.";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "Add a Club";
  saveButton.textContent = "Add Club";
  cancelButton.hidden = true;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const club = {};
  fields.forEach(field => {
    club[field] = form.elements[field].value.trim();
  });

  const url = editingId === null ? API : `${API}/${editingId}`;
  const method = editingId === null ? "POST" : "PUT";

  try {
    await request(url, { method, body: JSON.stringify(club) });
    message.textContent =
      method === "POST" ? "Club added successfully." : "Club updated successfully.";
    resetForm();
    await loadClubs();
  } catch (error) {
    message.textContent = error.message;
  }
});

async function deleteClub(id) {
  if (!confirm(`Are you sure you want to delete club #${id}?`)) return;
  try {
    await request(`${API}/${id}`, { method: "DELETE" });
    message.textContent = "Club deleted successfully.";
    if (editingId === id) resetForm();
    await loadClubs();
  } catch (error) {
    message.textContent = error.message;
  }
}

cancelButton.addEventListener("click", resetForm);
document.getElementById("refreshButton").addEventListener("click", loadClubs);

loadClubs();